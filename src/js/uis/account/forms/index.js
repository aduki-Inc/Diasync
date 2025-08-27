import StatementForm from "./statement.js";
import DepositForm from "./deposit.js";
import WithdrawForm from "./withdraw.js";

// export registera all forms
export default function forms() {
  customElements.define("statement-form", StatementForm);
  customElements.define("deposit-form", DepositForm);
  customElements.define("withdraw-form", WithdrawForm);
}