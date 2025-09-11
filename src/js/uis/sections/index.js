import Sidebar from "./sidebar.js";
import Header from "./header.js";
import TopHeader from "./top.js";

export default function sections() {
  customElements.define("sidebar-section", Sidebar);
  customElements.define("header-section", Header);
  customElements.define("top-section", TopHeader);
}