import Week from "./week.js";

// register the product
export default function schedule() {
  customElements.define('week-schedule', Week, { extends: 'div' });
}