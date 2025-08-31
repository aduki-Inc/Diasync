import pages from "./pages/index.js";
import wrappers from "./wrappers/index.js";
import schedule from "./schedule/index.js";
import provider from "./provider/index.js";
import feed from "./feed/index.js";

export default function providers() {
  pages();
  wrappers();
  schedule();
  provider();
  feed();
}