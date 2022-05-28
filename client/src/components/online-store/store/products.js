import { useState, useEffect } from "react";

function Products(props) {
  const [category, setCategory] = useState(1);

  const infoProduct = (id) => {};
  const getObjects = (array) => {
    array.map((arr) => arr);
  };
  return (
    <div className="products">
      {props.categories.map((category) => {
        if (props.selectedCategory == category.id) {
          return category.products.map((product) => {
            return (
              <div className="content-panel-wrapper">
                <div
                  className="content-panel"
                  onClick={(id) => infoProduct(product.id)}
                >
                  <div id="producto-bg">
                    <img src={product.image} />
                  </div>
                  <div className="producto-text">
                    <p className="producto-title">
                      {product.name} <br /> {product.price}{" "}
                    </p>
                  </div>
                </div>
              </div>
            );
          });
        }
      })}
    </div>
  );
}

export default Products;
