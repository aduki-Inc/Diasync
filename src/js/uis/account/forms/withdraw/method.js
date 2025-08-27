export default class MethodForm extends HTMLDivElement {
  constructor() {
		super();
		this.shadowObj = this.attachShadow({ mode: "open" });
		this.utils = window.app.utils;
		this.render();
	}
	
	render() {
		this.shadowObj.innerHTML = this.getTemplate();
	}

	// noinspection JSUnusedGlobalSymbols
	connectedCallback() {
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
        </div>
        ${this.getForm()}
        <div class="consent">
          ${this.getConset()}
        </div>
        ${this.getButtons()}
      </form>
    `;
	}

  getHead = () => {
    return /* html */`
      <h3 class="title">Withdrawal Method</h3>
      <p class="description">Select a payment method to withdraw your funds</p>
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
    return /* html */`
      <div class="payment-options">
        <!-- M-PESA Option -->
          <label class="payment-option">
            <input type="radio" name="payment" value="mpesa" class="payment-radio">
            <div class="payment-icon">
                <img src="/images/payments/mpesa.png" alt="M-PESA">
            </div>
            <div class="payment-details">
                <div class="payment-name">M-PESA</div>
                <div class="payment-description">Withdraw to M-PESA</div>
            </div>
          </label>

        <!-- PayPal Option -->
        <label class="payment-option">
            <input type="radio" name="payment" value="paypal" class="payment-radio">
            <div class="payment-icon">
                <img src="/images/payments/pp.png" alt="PayPal">
            </div>
            <div class="payment-details">
                <div class="payment-name">PayPal</div>
                <div class="payment-description">Withdraw to PayPal</div>
            </div>
        </label>
      </div>
    `;
  }
  
  getConset = () => {
    return /* html */`
      <p>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
          <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" stroke-width="1.8" />
          <path d="M8 12.5L10.5 15L16 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>By <b>Continuing</b> to withdraw you indicate that you agree to our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms of Service</a></span>
      </p>
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
          align-content: start;
          align-items: start;
          gap: 0;
          width: 100%;
          padding: 0;
        }
        
        .form > .head > .title {
          font-size: 1.35rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          margin: 0;
          line-height: 1.4;
        }
        
        .form > .head > .description {
          display: inline-block;
          margin: 0;
          font-size: 1rem;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
        }
        
        .form > .head > .description > b {
          font-weight: 600;
          color: var(--gray-color);
          font-family: var(--font-text), sans-serif;
        }

        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .payment-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          width: 100%;
          border: none;
          background: var(--holding-background);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .payment-option:hover {
          background: var(--revenue-background);
        }

        .payment-option.selected {
          border-color: var(--anchor-color);
          background-color: var(--revenue-background);
        }

        .payment-radio {
          width: 25px;
          height: 25px;
          cursor: pointer;
          padding: 2px;
        }

        .payment-radio:checked {
          accent-color: var(--accent-color);
        }

        .payment-icon {
          background-color: var(--gray-background);
          padding: 8px;
          border-radius: 50px;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .payment-icon > img {
          width: 100%;
          height: 100%;
          min-width: 50px;
          min-height: 50px;
          object-fit: cover;
        }

        .payment-details {
            flex: 1;
        }

        .payment-name {
          font-weight: 500;
          color: var(--text-color);
          line-height: 1.4;
          font-family: var(--font-main), sans-serif;
        }

        .payment-description {
          font-size: .9rem;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
        }

        .form > .consent {
          display: flex;
          flex-flow: row;
          gap: 5px;
          width: 100%;
          padding: 0;
        }
        
        .form > .consent > p {
          margin: 5px 0 0;
          display: flex;
          gap: 5px;
          font-size: 1rem;
          font-weight: 400;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
        }
        
        .form > .consent > p b {
          font-weight: 500;
          color: var(--text-color);
        }
        
        .form > .consent > p > svg {
          min-width: 18px;
          max-width: 18px;
          min-height: 18px;
          margin: 0 0;
          color: var(--accent-color);
        }
        
        .form > .consent > p a {
          color: var(--anchor-color);
        }
        
        .form > .consent > p a:hover {
          text-decoration: underline;
        }

        .form > .consent > p .cost {
          font-weight: 500;
          color: var(--accent-color);
          display: inline-block;
          font-family: var(--font-text), sans-serif;
          padding: 0 5px;
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
          .payment-radio,
          .payment-option {
						cursor: default !important;
          }
          
          .form > .consent > p {
            font-size: .8rem;
          }
          
          .form > .consent > p > svg {
            min-width: 14px;
            min-height: 14px;
            color: var(--accent-color);
          }
				}
	    </style>
    `;
	}
}