import Provider from "./provider.js";
import Booking from "./booking.js";

// export register
export default function wrappers() {
  customElements.define('provider-detail', Provider);
  customElements.define('booking-wrapper', Booking, { extends: 'div' });
}