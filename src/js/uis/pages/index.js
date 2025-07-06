import Overview from "./overview.js";
import Metrics from "./metrics.js";
import Performance from "./perform.js";
import Apply from "./apply.js";
import Chama from "./chama.js";
import Contributions from "./cntbs.js";
import Loans from "./loans.js";
import Repayments from "./repay.js";
import SheetThemes from "./theme.js";

// register all
export default function all() {
  customElements.define("stats-overview", Overview);
  customElements.define("stats-metrics", Metrics);
  customElements.define("stats-performance", Performance);
  customElements.define("stats-apply", Apply);
  customElements.define("stats-chama", Chama);
  customElements.define("stats-contributions", Contributions);
  customElements.define("stats-loans", Loans);
  customElements.define("stats-repayments", Repayments);
  customElements.define("sheet-themes", SheetThemes);
}
