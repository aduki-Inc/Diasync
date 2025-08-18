import ProductsFeed from "./products.js";

// register the feed
export default  function feed () {
  customElements.define('products-feed', ProductsFeed);
}