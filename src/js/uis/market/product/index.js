import ProductWrapper from "./wrapper.js";
import ProductDetail from "./detail.js";
import ReviewWrapper from "./review.js";
import ServiceWrapper from "./service.js";

// register the product
export default function products() {
  customElements.define('product-wrapper', ProductWrapper);
  customElements.define('product-review', ReviewWrapper);
  customElements.define('product-detail', ProductDetail);
  customElements.define('service-wrapper', ServiceWrapper);
}