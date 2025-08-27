import Account from "./account.js";
import Transaction from "./transaction.js";

// register all wrappers
export default function wrappers() {
  customElements.define("wallet-account", Account);
  customElements.define("transaction-item", Transaction, { extends: "div" });
}