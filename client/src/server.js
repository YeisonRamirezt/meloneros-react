const express     = require('express');
const connection  = require('./connection.js')

const app = express()
const PORT = 3000
 
var business;
app.listen(PORT, (error) =>{
    if(error) throw err
    
    connection.connect()
    connection.query('SELECT * FROM business WHERE  fetchfrom = "comidas-medellin"', function (err, rows, fields) {
    if (err) throw err
        console.log('The solution is: ', rows[0]["business"])
        business = rows[0]["business"];
    })
    connection.end()
   
});

app.get("/api", (req, res) => {
    console.log(res.send(business))
})