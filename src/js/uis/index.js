import home from "./home/index.js";
import market from "./market/index.js";
import popups from "./popups/index.js";
import chats from "./chats/index.js"
import sections from "./sections/index.js";

export default function uis(text) {
  home();
  market();
  popups();
  chats();
  sections();
  console.log(text);
}