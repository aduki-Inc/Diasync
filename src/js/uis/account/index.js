import feeds from "./feed/index.js";
import wrappers from "./wrappers/index.js";
import forms from "./forms/index.js";

// register account systems
export default function account() {
  wrappers();
  feeds();
  forms();
}