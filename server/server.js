// Required packages and dependencies
const express = require("express");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// ------------------------ Models ---------------------------------

const Business = require("./src/models/business.model");

// ----------------------- Server set up ---------------------------

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

const mgcnt = "mongodb://localhost/manook";
mongoose
  .connect(mgcnt, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("connected to manook"))
  .catch((err) => console.log(err));

const store = new MongoDBSession({
  uri: mgcnt,
  collection: "mySessions",
});

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { maxAge: oneDay },
  })
);

app.listen(process.env.PORT || 5000, () =>
  console.log("listening on port 5000 | http://localhost:5000")
);

//                        API REQUESTS

// ------------------------ Users ---------------------------------

app.post("/signup", async (req, res) => {
  try {
    const { name, lastName, userType, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    if (!hashedPassword) res.status(400).send();
    const newUser = new Users({
      name,
      lastName,
      email,
      password: hashedPassword,
      userType,
    });

    await newUser.save();
    const rep = await Users.findOne({ email: email, password: password });
    if (!rep) res.status(401).send();
    const newProcess = new Process({
      repId: rep._id,
      courses: [],
    });
    if (await newProcess.save()) {
      res.status(200).send();
      res.send(rep);
      return;
    }
    res.status(402).send();
  } catch (err) {
    res.status(400).send();
    console.log(err);
  }
});

app.get("/login", async (req, res) => {
  const { email, password } = req.query;
  try {
    const user = await Users.findOne({
      email,
    });

    if (!user) {
      res.status(400).send();
      res.redirect("/login");
    }

    const match = bcrypt.compare(password, user.password);
    if (!match) {
      res.status(400)-send();
      res.redirect("/login");
    }

    res.status(200).send();
    res.send(user);

    req.session.isAuth = true;
    console.log(req.session.isAuth);
  } catch (err) {
    console.log(err);
  }
});

app.get("/isLogedIn", (req, res) => {
  console.log("logiedin");
  if (!req.session.isAuth || req.session.isAuth == false) {
    res.status(200);
    console.log("400");
  } else {
    res.status(400);
    console.log("logiedin");
  }
});
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/validate-email", (req, res) => {
  Users.findOne({ email: req.query.email })
    .then((data) => {
      if (data) {
        res.status(200).send();
      } else {
        res.status(400).send();
      }
    })
    .catch((err) => {
      console.log(res.json({ message: err }));
    });
});

app.get("/userId", async (req, res) => {
  try {
    const user = await Users.findOne({ _id: req.query.id });
    res.status(200);
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});

//--------------------------- Courses -----------------------------

app.get("/courses", async (req, res) => {
  try {
    const courses = await Courses.find();
    if (courses) {
      res.status(200);
      res.send(courses);
      return;
    }
    res.status(400);
    return;
  } catch (err) {
    console.log(err);
  }
});

app.get("/course/:id", async (req, res) => {
  try {
    const course = await Courses.findOne({ _id: req.query.id });
    if (course) {
      res.status(200);
      res.send(course);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

// ------------------------ Process --------------------------

app.get("/process", async (req, res) => {
  console.log("process request");
  try {
    const process = await Process.find();
    if (!process) {
      console.log("There are not processes");
      res.status(401).send();
      return;
    }
    console.log("There are Processes");
    let courseFound;
    let repFound;
    process.map((p) => {
      if (req.query.userId == p.repId) {
        repFound = process._id;
        console.log("rep found on process id", p._id);
        p.courses.map((course) => {
          if (!course) {
            console.log("There are not courses at process id", p._id);
            return;
          } else {
            if (course.courseId == req.query.courseId) {
              console.log(
                `course process id ${course._id} found in process id ${p._id}`
              );
              courseFound = course;
              return;
            }
          }
        });
        return;
      }
      return;
    });
    if (courseFound) {
      res.status(200);
      res.send(courseFound);
      console.log("course was found and sent");
      return;
    }
    if (repFound) {
      console.log(
        "course was not found but rep was found in process id",
        repFound
      );
      const courseUniqueId = new mongoose.Types.ObjectId();
      const newProcessCourse = {
        courseId: req.query.courseId,
        score: 0,
        percentage: 0,
        completed: false,
        modules: [],
      };

      const newProcess = new Process({
        _id: courseUniqueId,
        repId: req.query.userId,
        courses: [newProcessCourse],
      });

      await newProcess.save();
      console.log(
        `new  process was created with id ${courseUniqueId} for rep with id  ${repFound}`
      );

      // confirm it was saved

      const findNewProcess = await Process.findOne({ _id: courseUniqueId });
      if (findNewProcess) {
        console.log(
          `process with id ${findNewProcess._id} was successfully created and CONFIRMED`
        );
        res.status(201);
        res.send(findNewProcess);
      } else {
        res.status(402).send();
        console.log(`process with id ${courseUniqueId} wasn't CONFIRMED`);
      }
    } else {
      console.log(`rep with id ${req.query.userId} wasn't found`);
      res.status(403).send();
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/enroll", async (req, res) => {
  const { userId, courseId } = req.query;
  let courseFound;
  console.log("process request");
  try {
    const process = await Process.find();
    if (!process) {
      console.log("There are not processes");
      res.status(401).send();
      return;
    }
    console.log("There are Processes");
    
    process.map((p) => {
      if (userId == p.repId) {
        console.log("rep found on process id", p._id);
        p.courses.map((course) => {
          if (!course) {
            console.log("There are not courses at process id", p._id);
            res.status(402).send();
            return;
          }
          if (course.courseId == courseId) {
            console.log(
              `course process id ${course._id} found in process id ${p._id}`
            );
            courseFound = course;
            return;
          }
          console.log('need to create course');
          res.status(403);
        });
        return;
      }
    });
    if(courseFound){
      res.status(200);
      res.send(courseFound);
    }else{
      res.status(404).send();
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/enroll", async (req, res) => {
  const { userId, courseId } = req.query;
  const courseUniqueId = new mongoose.Types.ObjectId();
  const newProcessCourse = {
    courseId: courseId,
    score: 0,
    percentage: 0,
    completed: false,
    modules: [],
  };

  const newProcess = new Process({
    _id: courseUniqueId,
    repId: userId,
    courses: [newProcessCourse],
  });

  const save = await newProcess.save();
  if (save) {
    res.send(newProcess);
    console.log(
      `new  process was created with id ${courseUniqueId} for rep with id  ${userId}`
    );
  }
});
/*
cases: 
- no processes found
- no user found
- no course found
- no new course created

*/

// ----------------------------------------------------------

app.get("/", (req, res) => {
  console.log(req.session.cookie);
});
