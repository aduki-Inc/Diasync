export default class MpesaForm extends HTMLElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.rate = 1.0;
    this.currency = "KES";
    this.amount = this.number.parse(this.getAttribute("amount"));
    this.eac = this.number.parse(this.getAttribute("eac"));
    this.number = this.getAttribute("number");
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  // noinspection JSUnusedGlobalSymbols
  connectedCallback() {
    const form = this.shadowObj.querySelector("form");
    this.inputValidators(form);
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
      <form class="form" id="mpesa" method="post">
        <div class="head success">
          ${this.getHeadSuccess({ currency: this.currency, amount: this.amount, eac: this.eac })}
        </div>
        ${this.getForm()}
        <div class="consent">
          ${this.getMessage("paid", this.eac)}
        </div>
        ${this.getButtons()}
      </form>
    `;
  }

  getHead = () => {
    return /* html */`
      <h3 class="title">Mpesa Deposit</h3>
      <p class="description">
        <span class="text">You are about to deposit <b> ${this.currency} ${this.number.balanceWithCommas(this.amount)}</b> to your Holding account.</span>
        <span class="eac">The equivalent amount that will be credited into your account is <b>${this.number.balanceWithCommas(this.eac)} EAC</b>.</span>
      </p>
    `;
  }

  getHeadSuccess = (data) => {
    return /* html */`
      <h3 class="title">Deposit Successful</h3>
      <p class="description">
        <span class="text">You have successfully deposited <b> ${data.currency} ${this.number.balanceWithCommas(data.amount)}</b> to your Holding account.</span>
        <span class="eac">The equivalent amount that has been credited into your account is <b>${this.number.balanceWithCommas(data.eac)} EAC</b>.</span>
      </p>
    `;
  }

  getButtons = () => {
    return /*html*/`
      <div class="buttons success">
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
    let phone = this.getAttribute("number");

    // if numeber starts with +254 or 254 remove it: if it does not start with 254 phone be ''
    if (phone.startsWith("254") || phone.startsWith("+254")) {
      phone = phone.replace("+254", "").replace("254", "");
    } else {
      phone = "";
    }

    return /* html*/`
      <div class="input-amount pay">
        <span class="label">Enter your Mpesa number</span>
        <div class="input">
          <span class="phone">
            <span class="extension">+254</span>
            <input type="text" step="0.01" class="no-spinner" name="number" placeholder="e.g 713253018" value="${phone}" required>
          </span>
          <span class="warning">Enter valid Mpesa number</span>
        </div>
      </div>
    `
  }

  getMessage = (text, amount = 0.0) => {
    if (text === "initiated") {
      return /* html */`
        <p class="success">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" stroke-width="1.8" />
            <path d="M8 12.5L10.5 15L16 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">Mpesa payment initiated, you'll receive a prompt on your phone shortly, enter your pin to complete the payment.</span>
        </p>
      `;
    } else if (text === "paid") {
      return /* html */`
        <div class="paid">
          <h2 class="ammount">+ ${this.number.balanceWithCommas(amount)} EAC</h2>
          <p class="paid">
            <span class="title">Payment Successful</span>
            <span class="text">Mpesa payment successful, you can continue to your account.</span>
          </p>
        </div>
      `;
    } else if (text === "failed") {
      return /* html */`
        <p class="failed">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#currentColor" fill="none">
            <path d="M15 9L12 12M12 12L9 15M12 12L15 15M12 12L9 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47714 17.5228 1.99998 12 1.99998" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M2.5 8.49998C2.86239 7.67055 3.3189 6.89164 3.85601 6.17676M6.17681 3.85597C6.89168 3.31886 7.67058 2.86237 8.5 2.49998" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">There was an error processing your payment, please try again.</span>
        </p>
      `;
    } else if (text === "cancelled") {
      return /* html */`
        <p class="failed">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#currentColor" fill="none">
            <path d="M15 9L12 12M12 12L9 15M12 12L15 15M12 12L9 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47714 17.5228 1.99998 12 1.99998" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M2.5 8.49998C2.86239 7.67055 3.3189 6.89164 3.85601 6.17676M6.17681 3.85597C6.89168 3.31886 7.67058 2.86237 8.5 2.49998" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">Seems like you cancelled the payment, please try again.</span>
        </p>
      `;
    }
  }

  inputValidators = form => {
    const phoneContainer = form.querySelector(".phone");
    const phone = form.querySelector("input[name=number]");
    const warning = form.querySelector(".warning");

    let error = false;

    phone.addEventListener("input", e => {
      const value = e.target.value;

      // check if the number is valid: contains only numbers
      if (!/^\d+$/.test(value)) {
        warning.classList.add("failed");
        warning.classList.remove("success");
        warning.innerHTML = "The phone number must contain only numbers";
        warning.style.display = "flex";
        error = true;
        return;
      }

      // check if the number is valid: starts with 7 or 1
      if (!(value.startsWith("7") || value.startsWith("1"))) {
        warning.classList.add("failed");
        warning.classList.remove("success");
        warning.innerHTML = "The phone number must start with 7 or 1";
        warning.style.display = "flex";
        error = true;
        return;
      }

      if (value.length === 0 || value.length < 9 || value.length > 9) {
        warning.classList.add("failed");
        warning.classList.remove("success");
        warning.innerHTML = "The phone number must be 9 digits";
        warning.style.display = "flex";
        error = true;
        return;
      }

      error = false;
      warning.classList.add("success");
      warning.classList.remove("failed");
      warning.innerHTML = "The number is valid";
      warning.style.display = "flex";
    });

    // add fucus event to the phone input
    phone.addEventListener("focus", () => {
      if (error) {
        phoneContainer.classList.add("failed");
        phoneContainer.classList.remove("success");
      } else {
        phoneContainer.classList.add("success");
        phoneContainer.classList.remove("failed");
      }
    });
  };

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
          display: none;
          flex-flow: column;
          gap: 10px;
          width: 100%;
          padding: 10px;
          border-radius: 12px;
        }

        .form > .input-amount > .label {
          font-size: 1rem;
          display: flex;
          padding: 2px;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
        }

        .form > .input-amount > .input {
          display: flex;
          flex-flow: column;
          gap: 10px;
          width: 100%;
          padding: 0 0 6px;
          align-items: start;
          justify-content: center;
        }

        .form > .input-amount > .input > .phone {
          display: flex;
          flex-flow: row;
          gap: 0;
          width: 100%;
        }

        .form > .input-amount > .input > .phone > .extension {
          display: flex;
          flex-flow: row;
          border: var(--border);
          gap: 0;
          width: 70px;
          padding: 10px;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          font-weight: 500;
          border-radius: 12px;
          font-size: 1.2rem;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border-right: none;
        }

        .form > .input-amount > .input > .phone.failed > .extension {
          border: var(--input-border-error);
          color: var(--warn-color);
          border-right: none;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        .form > .input-amount > .input > .phone.success > .extension {
          color: var(--anchor-color);
          border: var(--input-border-focus);
          border-right: none;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        .form > .input-amount > .input > .phone > input {
          width: calc(100% - 70px);
          padding: 10px;
          border: none;
          outline: none;
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--text-color);
          border: var(--border);
          font-family: var(--font-main), sans-serif;
          border-radius: 12px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }

        .form > .input-amount > .input > .phone.failed > input {
          color: var(--warn-color);
          border: var(--input-border-error);
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }

        .form > .input-amount > .input > .phone > input:focus {
          color: var(--anchor-color);
          border: var(--input-border-focus);
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }

        .form > .input-amount > .input > .phone > input:-webkit-autofill,
        .form > .input-amount > .input > .phone > input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 30px var(--background) inset !important;
        }

        .form > .input-amount > .input > .warning {
          display: none;
          font-size: 0.9rem;
          font-weight: 500;
          padding: 5px 3px 0;
          gap: 5px;
          color: var(--gray-color);
          font-family: var(--font-main), sans serif;
        }

        .form > .input-amount > .input > .warning.failed {
          color: var(--warn-color);
        }

        .form > .input-amount > .input > .warning.success {
          color: var(--alt-color);
        }

        .form > .input-amount > .input > .warning > span {
          font-weight: 600;
          color: var(--accent-color);
        }

        .form > .consent {
          display: none;
          flex-flow: row;
          gap: 5px;
          width: 100%;
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
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
        }

        .form > .consent > p.success {
          border: var(--input-border-focus);
          color: var(--accent-color);
        }

        .form > .consent > p.failed {
          border: var(--input-border-error);
          color: var(--warn-color);
        }

        .form > .consent > p.paid {
          border: var(--anchor-border);
          color: var(--anchor-color);
        }

        .form > .consent > div.paid {
          border: var(--anchor-border);
          color: var(--text-color);
          display: flex;
          padding: 20px;
          width: 100%;
          flex-flow: column;
          gap: 0;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .form > .consent > div.paid > h2.ammount {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--accent-color);
          font-family: var(--font-text), sans-serif;
          margin: 0;
        }

        .form > .consent > div.paid > p.paid {
          display: flex;
          flex-flow: column;
          gap: 5px;
          align-items: center;
          text-align: center;
          justify-content: center;
        }

        .form > .consent > div.paid > p.paid > span.title {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-color);
          font-family: var(--font-text), sans-serif;
          margin: 0;
        }
        
        .form > .consent p svg {
          width: 24px;
          height: 24px;
          min-width: 24px;
          min-height: 24px;
          margin: 0;
          color: inherit;
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