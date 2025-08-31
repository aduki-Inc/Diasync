import Bookings from "./bookings.js";
import Services from "./sevices.js";
import Doctors from "./doctors.js";
import Reviews from "./reviews.js";

// register the product
export default function feed() {
  customElements.define('bookings-feed', Bookings);
  customElements.define('services-feed', Services);
  customElements.define('doctors-feed', Doctors);
  customElements.define('reviews-feed', Reviews);
}