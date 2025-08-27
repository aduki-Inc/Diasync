import Account from "./account.js";
import Home from "./home.js";

// register all wrappers
export default function actions() {
  customElements.define("account-actions", Account);
  customElements.define("home-actions", Home);
}