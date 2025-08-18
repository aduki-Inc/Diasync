import CartContainer from "./container.js";
import CartItem from "./item.js";
import CheckoutContainer from "./checkout.js";

// export register function
export default function cart() {
  // register custom elements
  customElements.define("cart-container", CartContainer);
  customElements.define("checkout-container", CheckoutContainer);
  customElements.define("cart-item", CartItem, { extends: "div" });
}