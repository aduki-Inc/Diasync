import Bookings from "../feed/bookings.js";

// register the product
export default function feed() {
  customElements.define('bookings-feed', Bookings);
}