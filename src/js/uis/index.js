import home from "./home/index.js";
import market from "./market/index.js";
import account from "./account/index.js";
import popups from "./popups/index.js";
import chats from "./chats/index.js"
import actions from "./actions/index.js";
import sections from "./sections/index.js";
import providers from "./providers/index.js";

export default function uis(text) {
  home();
  market();
  account();
  popups();
  chats();
  actions();
  sections();
  providers();
  console.log(text);
}