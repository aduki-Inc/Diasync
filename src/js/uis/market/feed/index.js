import ProductsFeed from "./products.js";
import Services from "./services.js";
import Bookings from "./bookings.js";
import Specialists from "./specialists.js";

// register the feed
export default function feed() {
  customElements.define('products-feed', ProductsFeed);
  customElements.define('services-container', Services);
  customElements.define('bookings-container', Bookings);
  customElements.define('specialists-container', Specialists);
}