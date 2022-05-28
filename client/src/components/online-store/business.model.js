const BusinessModel = {
  business: {
    name: "Comidas Medellin",
    image: "https://meloneros.com/comidas-medellin/images/image_business.jpg",
    address: "Cll 10 # 43a - 10",
    phone: "3057436601",
    city: "Medellin",
    location: "Buenos aires",
  },
  categories: [
    {
      id: 1,
      number: 1,
      name: "Hamburguesas",
      products: [
        {
          id: 0,
          name: "Hamburguesa a",
          image: "https://meloneros.com/comidas-medellin/images/557b693fd327b4.jpg",
          description: "Carne, pan, ripio y ensalada",
          price: 20000,
          ingredients: [
            {
              id: "0f0",
              quantity:0
            },
          ],
        },
      ],
    },
    {
      id: 2,
      number: 2,
      name: "Perros",
      products: [
        {
          id: 0,
          name: "Perr a",
          image: "https://meloneros.com/comidas-medellin/images/receta-perro-con-agridulce-zenu.jpg",
          description: "",
          price: 13500,
          ingredients: [
            {
              id: "0f0",
              quantity:0
            },
          ],
        },
      ],
    },
    {
      id: 3,
      number: 3,
      name: "Bebidas",
      products: [
        {
          id: 0,
          name: "",
          image: "",
          description: "",
          price: 0,
          ingredients: [
            {
              id: "0f0",
              quantity:0
            },
          ],
        },
      ],
    },
  ],
};
export default BusinessModel;
