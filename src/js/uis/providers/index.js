
import wrappers from "./wrappers/index.js";
import provider from "./provider/index.js";
import pages from "./pages/index.js";
import schedule from "./schedule/index.js";
import feed from "./feed/index.js";
import modals from "./modals/index.js";

export default function providers() {
  wrappers();
  schedule();
  provider();
  pages();
  feed();
  modals();
}