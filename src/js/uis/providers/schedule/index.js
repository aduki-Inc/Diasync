import Week from "./week.js";
import Book from "./book.js";

// register the product
export default function schedule() {
  customElements.define('week-schedule', Week, { extends: 'div' });
  customElements.define('book-schedule', Book, { extends: 'div' });
}