import feed from "./feed/index.js";
import products from "./product/index.js";
import cart from "./cart/index.js";
import checkout from "./checkout/index.js";
import store from "./store/index.js";


// export market systems
export default function market() {
  feed();
  products();
  cart();
  checkout();
  store();
}