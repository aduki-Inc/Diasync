import Provider from "./provider.js";
import Booking from "./booking.js";
import Doctor from "./doctor.js";

// export register
export default function wrappers() {
  customElements.define('provider-detail', Provider);
  customElements.define('booking-wrapper', Booking, { extends: 'div' });
  customElements.define('doctor-wrapper', Doctor, { extends: 'div' });
}