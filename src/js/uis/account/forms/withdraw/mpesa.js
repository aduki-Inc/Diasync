export default class MpesaForm extends HTMLDivElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.eac = this.number.parse(this.getAttribute("eac"));
    this.amount = this.number.parse(this.getAttribute("amount"));
    this.balance = this.number.parse(this.getAttribute("balance"));
    this.currency = this.getAttribute("currency");
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  // noinspection JSUnusedGlobalSymbols
  connectedCallback() {
    const form = this.shadowObj.querySelector("form");
    this.inputHandler(form);
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    return /* html */`
      <form class="form" id="depositForm" method="post">
        <div class="head">
          ${this.getHead()}
          <!--${this.getHeadSuccess({ currency: this.currency, amount: this.amount, eac: this.eac })}-->
        </div>
        ${this.getForm()}
        ${this.getMessage()}
        ${this.getButtons()}
      </form>
    `;
  }

  getHead = () => {
    return /* html */`
      <h3 class="title">Mpesa Withdrawal</h3>
      <p class="description">
        <span class="text">You are about to withdraw <b>${this.currency} ${this.number.balanceWithCommas(this.amount)}</b> from your Holding account.</span>
        <span class="eac">The equivalent amount that will be deducted from your Holding account is <b>${this.number.balanceWithCommas(this.eac)} EAC</b>.</span>
      </p>
    `;
  }

  getHeadSuccess = (data) => {
    return /* html */`
      <h3 class="title">Withdrawal Successful</h3>
      <p class="description">
        <span class="text">You have successfully withdrawn <b>${data.currency} ${this.number.balanceWithCommas(data.amount)}</b> from your Holding account.</span>
        <span class="eac">The equivalent amount that has been deducted from your account is <b>${this.number.balanceWithCommas(data.eac)} EAC</b>.</span>
      </p>
      <p class="description">
        <span class="text">The amount will be sent to your Mpesa account shortly.</span>
      </p>
    `;
  }

  getButtons = () => {
    return /*html*/`
      <div class="buttons">
        <button type="button" class="button prev">
          ${this.getButtonPrev()}
        </button>
        <button type="submit" class="button next">
          ${this.getButtonNext()}
        </button>
      </div>
    `
  }

  getButtonPrev = () => {
    return /*html*/`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#currentColor" fill="none">
        <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span class="text">Back</span>
    `;
  }

  getButtonNext = () => {
    return /*html*/`
      <span class="text">Next</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
        <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  }

  getForm = () => {
    return /* html */ `
      <div class="input-amount pin">
        <span class="label">Enter your Wallet PIN</span>
        <div class="input">
          <div class="one">
            <input type="text" name="first" id="first" maxlength="1" required>
            <input type="text" name="second" id="second" maxlength="1" required>
            <input type="text" name="third" id="third" maxlength="1" required>
            <input type="text" name="fourth" id="fourth" maxlength="1" required>
            <input type="text" name="fifth" id="fifth" maxlength="1" required>
            <input type="text" name="sixth" id="sixth" maxlength="1" required>
          </div>
        </div>
      </div>
    `;
  };

  inputHandler = form => {
    form.addEventListener("input", e => {
      const target = e.target;
      if (target.tagName === "INPUT") {
        // prevent non-numeric characters except *
        target.value = target.value.replace(/[^0-9*]/g, "");
        // Store the actual value in a data attribute
        const value = target.value.slice(0, 1); // Ensure only one character
        target.dataset.value = value; // Save actual value

        // Replace the visible value with an asterisk
        target.value = value ? "*" : "";

        // Move to the next input if filled
        if (value) {
          target.classList.add("full");
          const next = target.nextElementSibling;
          if (next && next.tagName === "INPUT") {
            next.focus();
          }
        }
      }

      // Handle delete key
      if (e.inputType === "deleteContentBackward") {
        // clear the value
        target.value = "";
        target.dataset.value = "";
        target.classList.remove("full");

        const prev = target.previousElementSibling;
        if (prev) {
          prev.focus();
        }
      }
    });
  };

  getMessage = () => {
    return /* html */`
      <div class="consent">
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#currentColor" fill="none">
            <path d="M15 9L12 12M12 12L9 15M12 12L15 15M12 12L9 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47714 17.5228 1.99998 12 1.99998" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M2.5 8.49998C2.86239 7.67055 3.3189 6.89164 3.85601 6.17676M6.17681 3.85597C6.89168 3.31886 7.67058 2.86237 8.5 2.49998" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">There was an error processing your withdrawal request, please try again.</span>
        </p>
      </div>
    `;
  }

  getStyles() {
    return /* css */`
	    <style>
	      *,
	      *:after,
	      *:before {
	        box-sizing: border-box !important;
	        font-family: inherit;
	        -webkit-box-sizing: border-box !important;
	      }

	      *:focus {
	        outline: inherit !important;
	      }

	      *::-webkit-scrollbar {
	        width: 3px;
	      }

	      *::-webkit-scrollbar-track {
	        background: var(--scroll-bar-background);
	      }

	      *::-webkit-scrollbar-thumb {
	        width: 3px;
	        background: var(--scroll-bar-linear);
	        border-radius: 50px;
	      }

	      h1,
	      h2,
	      h3,
	      h4,
	      h5,
	      h6 {
	        font-family: inherit;
	      }

	      a {
	        text-decoration: none;
	      }

	      :host {
          font-size: 16px;
          padding: 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          height: max-content;
          align-items: start;
          justify-content: space-between;
          gap: 0;
          width: 100%;
        }

        .form {
          /* border-top: var(--border); */
          display: flex;
          flex-flow: column;
          gap: 15px;
          width: 100%;
          padding: 0;
        }
        
        .form > .head {
          display: flex;
          flex-flow: column;
          align-content: center;
          align-items: center;
          gap: 0;
          width: 100%;
          padding: 0;
        }

        .form > .head.success {
          margin: 50px 0 0;
        }
        
        .form > .head > .title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          margin: 25px 0 0;
          line-height: 1.4;
        }
        
        .form > .head > .description {
          display: inline-block;
          margin: 0;
          font-size: 1rem;
          padding: 5px 3px;
          line-height: 1.4;
          gap: 5px;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
        }
        
        .form > .head > .description > .text b {
          font-weight: 600;
          color: var(--anchor-color);
          font-family: var(--font-text), sans-serif;
        }

        .form > .head > .description > .eac > b {
          font-weight: 600;
          color: var(--accent-color);
          font-family: var(--font-text), sans-serif;
        }

        .form > .input-amount {
          border: var(--border);
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 10px 0 18px;
          border-radius: 12px;
        }

        .form > .input-amount > .label {
          font-size: 1rem;
          font-weight: 500;
          padding: 3px 10px;
          color: var(--gray-color);
          width: 100%;
          text-align: center;
          font-family: var(--font-main), sans-serif;
        }

        .form > .input-amount > .input {
          display: flex;
          flex-flow: row;
          gap: 5px;
          width: 100%;
          align-items: center;
          justify-content: space-between;
        }

        .form > .input-amount > .input > .one {
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
        }

        .form > .input-amount > .input > .one > input[type="text"] {
          width: 45px;
          height: 45px;
          padding: 12px 10px;
          border: var(--border);
          border-radius: 12px;
          font-size: 1.35rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          text-align: center;
          outline: none;
        }

        .form > .input-amount > .input > .one > input[type="text"].full {
          width: 45px;
          height: 45px;
          padding: 12px 10px;
          border: var(--border-focus);
          border-radius: 12px;
          font-size: 1.35rem;
          font-weight: 600;
          color: var(--accent-color);
          font-family: var(--font-main), sans-serif;
          text-align: center;
          outline: none;
        }

        /* Remove arrows from number input */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* Remove arrows from number input for Firefox */
        input[type="number"] {
          -moz-appearance: textfield;
        }


        .form > .input-amount > .input > .one > .warning {
          display: flex;
          font-size: 0.9rem;
          font-weight: 500;
          gap: 5px;
          color: var(--gray-color);
          font-family: var(--font-main), sans serif;
        }

        .form > .input-amount.pay > .input > .one > .warning {
          font-size: 0.85rem;
        }

        .form > .input-amount.pay > .input > .one > .warning {
          display: flex;
        }

        .form > .input-amount > .input > .one > .warning.failed {
          color: var(--warn-color);
        }

        .form > .input-amount > .input > .one > .warning.success {
          color: var(--alt-color);
        }

        .form > .input-amount > .input > .one > .warning > span {
          font-weight: 600;
          color: var(--accent-color);
        }

        .form > .consent {
          display: flex;
          flex-flow: row;
          gap: 5px;
          width: 100%;
          color: var(--warn-color);
          padding: 0;
        }
        
        .form > .consent > p {
          margin: 5px 0 0;
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: start;
          gap: 10px;
          padding: 10px;
          font-size: 1rem;
          border-radius: 12px;
          font-weight: 400;
          color: var(--warn-color);
          font-family: var(--font-main), sans-serif;
        }

        .form > .consent > p {
          border: var(--input-border-error);
          color: var(--warn-color);
        }
        
        .form > .consent > p > svg {
          width: 24px;
          height: 24px;
          min-width: 24px;
          min-height: 24px;
          margin: 0;
          color: var(--warn-color);
        }

        .buttons {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin: 10px 0;
        }

        .buttons.success {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .buttons.disabled {
          display: none;
          visibility: hidden;
        }

        .buttons > .button {
          border: none;
          position: relative;
          background: var(--accent-linear);
          color: var(--white-color);
          font-family: var(--font-main), sans-serif;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          flex-flow: row;
          align-items: center;
          text-transform: capitalize;
          justify-content: center;
          padding: 8px 15px 8px;
          height: 40px;
          min-width: 100px;
          width: 100px;
          position: relative;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
        }

        .buttons.success > .button.next {
          background: var(--accent-linear);
          color: var(--white-color);
          font-weight: 600;
          width: 150px;
        }

        .buttons.success > .button.next:hover {
          color: var(--white-color);
        }

        .buttons > .button.prev {
          border: none;
          background: var(--gray-background);
          color: var(--text-color);
        }

        .buttons.success > .button.prev {
          display: none;
        }

        .buttons > .button svg {
          width: 20px;
          height: 20px;
          color: inherit;
          margin: 0 0 -1px 0;
        }

        .buttons > .button.prev.disabled,
        .buttons > .button.next.disabled {
          pointer-events: none;
          opacity: 0.5;
          cursor: not-allowed !important;
        }

				@media screen and (max-width:660px) {
					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

					a,
          .payment-option {
						cursor: default !important;
          }
          
				}
	    </style>
    `;
  }
}