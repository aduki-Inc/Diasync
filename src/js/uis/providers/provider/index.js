import Highlights from "./highlights.js";

export default function provider() {
  customElements.define("provider-highlights", Highlights, { extends: "div" });
}