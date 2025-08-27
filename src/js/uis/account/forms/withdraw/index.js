import MethodForm from "./method.js";
import MpesaForm from "./mpesa.js";
import AmountForm from "./amount.js";
import AgentForm from "./agent.js";


export default function withdrawForms() {
  customElements.define("withdraw-method", MethodForm, { extends: "div" });
  customElements.define("withdraw-mpesa", MpesaForm, { extends: "div"});
  customElements.define("withdraw-amount", AmountForm, { extends: "div"});
  customElements.define("withdraw-agent", AgentForm, { extends: "div"});
}