import pages from "./pages/index.js";
import popups from "./popups/index.js";
import chats from "./chats/index.js"
import Sidebar from "./sidebar.js";

export default function uis(text) {
  pages();
  popups();
  chats();
  customElements.define("sidebar-section", Sidebar);
  console.log(text);
}