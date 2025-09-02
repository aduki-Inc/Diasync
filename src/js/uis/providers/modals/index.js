import Booking from "./booking.js"

export default function modals() {
  // Register popups
  customElements.define("booking-modal", Booking);
}