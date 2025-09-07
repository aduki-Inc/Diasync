import Provider from "./provider.js";
import Booking from "./booking.js";
import Specialist from "./specialist.js";

// export register
export default function wrappers() {
  customElements.define('provider-detail', Provider);
  customElements.define('booking-wrapper', Booking);
  customElements.define('specialist-wrapper', Specialist);
}
30