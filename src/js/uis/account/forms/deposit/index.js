import AmountForm from "./amount.js";
import MethodForm from "./method.js";
import MpesaForm from "./mpesa.js";

export default function depositForms() {
  customElements.define("amount-form", AmountForm, { extends: "div" });
  customElements.define("method-form", MethodForm, { extends: "div" });
  customElements.define("mpesa-form", MpesaForm, { extends: "div" });
}