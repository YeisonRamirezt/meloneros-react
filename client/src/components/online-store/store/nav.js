import { FaMoneyBillAlt, FaShoppingCart } from "react-icons/fa"
function Nav() {
  const showCart = () => {};
  return (
    <div className="nav">
      <FaMoneyBillAlt className="icon-money"/>
      <span>Paga En Efectivo</span>
      <div id="cart-icon-toggle">
        <div id="quantity_oncart">{0}</div>
        <div className="button_menu_circle">
          <div className="openmodalResponsive" onclick={() => showCart()}>
            <FaShoppingCart id="cart-icon-id"/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
