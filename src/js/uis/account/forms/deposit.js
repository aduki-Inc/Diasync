import depositForms from "./deposit/index.js";
export default class DepositForm extends HTMLElement {
  constructor() {
    super();
    this.registerForms();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.utils = window.app.utils;
    this.currency = "USD";
    this.usdAmount = 0;
    this.ammount = 0;
    this.render();
  }

  registerForms() {
    depositForms();
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
      <div class="content">
        ${this.getAmountForm()}
      </div>
    `;
  }

  getMethodForm = () => {
    return /* html */`
      <method-form></method-form>
    `;
  }

  getAmountForm = () => {
    return /* html */`
      <amount-form currency="USD" amount="0"></amount-form>
    `;
  }

  getMpesaForm = () => {
    return /* html */`
      <mpesa-form number="${this.getAttribute("user-phone")}" amount="6925" currency="KES" usd-amount="45" eac="5.23"></mpesa-form>
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
          padding: 15px 0 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          height: max-content;
          align-items: start;
          justify-content: space-between;
          gap: 0;
          width: 100%;
        }

        .content {
          display: flex;
          flex-flow: column;
          gap: 2px;
          padding: 0;
          align-items: start;
          justify-content: space-between;
          transition: 0.3s;
          overflow: hidden;
        }

        .content > .head {
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 100%;
          padding: 0;
        }

        .content > .head > .title {
          font-size: 1.5rem;
          font-weight: 500;
          padding: 0;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          margin: 0;
          line-height: 1.4;
        }

        .content > .head > .desc {
          margin: 0;
          font-size: 1rem;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
        }

        .content > .head > .desc * {
          margin: 0;
          padding: 0;
          line-height: 1.4;
          font-size: 1rem;
          color: var(--gray-color);
          font-family: inherit;
        }

        .content > .head > .desc  p {
          margin: 5px 0 0;
        }

        .content > .head > .desc  a {
          color: var(--anchor-color);
        }

				@media screen and (max-width:660px) {
					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

					a {
						cursor: default !important;
          }
				}
	    </style>
    `;
  }
}