import pages from "./pages/index.js";
import popups from "./popups/index.js";
import chats from "./chats/index.js"

export default function uis(text) {
  pages();
  popups();
  chats();
  console.log(text);
}