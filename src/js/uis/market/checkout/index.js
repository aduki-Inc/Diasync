import PickupContainer from "./pickup.js";

// export register function
export default function checkout() {
  // register custom elements
  customElements.define("pickup-container", PickupContainer);
}