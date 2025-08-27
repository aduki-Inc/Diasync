import TransactionsFeed from "./transactions.js";

// export register function feeds
export default function feeds() {
  customElements.define("transactions-feed", TransactionsFeed);
}