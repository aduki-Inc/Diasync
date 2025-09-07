export default class AmountForm extends HTMLElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.eac = this.number.parse(this.getAttribute("eac"));
    this.amount = 0.002;
    this.balance = this.number.parse(this.getAttribute("balance"));
    this.currency = 'USD';
    this.kes = 1;
    this.usd = 0.01;
    this.eacToUsd = 5;
    this.minAmount = this.getMin(this.getAttribute('kind'));
    this.maxAmount = this.getMax(this.getAttribute('kind'));
    this.charges = {
      A: {
        min: 0.002,
        max: 0.20,
        charge: {
          amount: 0.002,
          percent: 0.2
        }
      },
      B: {
        min: 0.21,
        max: 0.80,
        charge: {
          amount: 0.02,
          percent: 0.2
        }
      },
      C: {
        min: 0.81,
        max: 1.50,
        charge: {
          amount: 0.03,
          percent: 0.2
        }
      },
      D: {
        min: 1.51,
        max: 7.50,
        charge: {
          amount: 0.04,
          percent: 0.2
        }
      },
      E: {
        min: 7.51,
        max: 15.00,
        charge: {
          amount: 0.05,
          percent: 0.2
        }
      },
      F: {
        min: 15.01,
        max: 77.00,
        charge: {
          amount: 0.06,
          percent: 0.2
        }
      },
      G: {
        min: 77.01,
        max: 155.00,
        charge: {
          amount: 0.13,
          percent: 0.2
        }
      },
      H: {
        min: 155.01,
        max: 775.00,
        charge: {
          amount: 0.16,
          percent: 0.2
        }
      },
      I: {
        min: 775.01,
        max: 1500.00,
        charge: {
          amount: 0.24,
          percent: 0.2
        }
      }
    }
    this.render();
  }

  getMax = kind => {
    if (kind === 'mpesa') return 200;
    if (kind === 'paypal') return 1500;
    if (kind === 'agent') return 200;
  }

  getMin = kind => {
    if (kind === 'mpesa') return 0.002;
    if (kind === 'paypal') return 0.01;
    if (kind === 'agent') return 0.01;
  }

  getMinAndKind = kind => {
    if (kind === 'mpesa') return { min: 0.002, kind: 'mpesa' };
    if (kind === 'paypal') return { min: 0.01, kind: 'paypal' };
    if (kind === 'agent') return { min: 0.01, kind: 'agent' };
  }

  validateAmountInUSD(amount, fromCurrency) {
    // Convert to USD first
    const usdAmount = fromCurrency === "USD" ? amount : this.convertToUsd(amount, fromCurrency);
    if (usdAmount > 1000) return { valid: false, reason: "Exceeds max of 1000 USD" };
    if (usdAmount < 0.01) return { valid: false, reason: "Below min of 0.01 USD" };
    return { valid: true, amount: usdAmount };
  }

  getCharge = amt => {
    const charge = Object.keys(this.charges).find(key => {
      const { min, max } = this.charges[key];
      return amt >= min && amt <= max;
    });

    // calculate charge: amount + percent of amount
    const { charge: { amount: fixed, percent } } = this.charges[charge];

    let rate = (amt * percent) / 100;

    let result = (fixed + rate).toFixed(4);
    return parseFloat(result);
  }

  ensureValidInput(input) {
    // Ensures input is a number and defaults to 0 if invalid
    const value = parseFloat(input);
    return isNaN(value) ? 0 : value;
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  // Updated conversion methods
  convertToEAC = (amount, fromCurrency) => {
    return new Promise(async (resolve, reject) => {
      try {
        // First convert to USD if not already USD
        let usdAmount = fromCurrency === 'USD'
          ? amount
          : (await this.convertToUsd(amount, fromCurrency)).usd;

        // Convert USD to EAC
        const eacAmount = (parseFloat(usdAmount) / this.eacToUsd).toFixed(4);

        resolve({
          usd: usdAmount,
          eac: eacAmount,
          rate: this.eacToUsd
        });
      } catch (error) {
        console.error('Conversion error:', error);
        reject(error);
      }
    });
  }

  convertFromEAC = (eacAmount, toCurrency) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Convert EAC to USD first
        const usdAmount = this.number.parse((eacAmount) * this.eacToUsd).toFixed(2);

        // If converting to USD, we're done
        if (toCurrency === 'USD') {
          resolve({
            usd: usdAmount,
            eac: eacAmount,
            rate: this.eacToUsd,
            currency: usdAmount,
            currencyCode: 'USD'
          });
          return;
        }

        // Convert USD to target currency
        const convertedAmount = await this.convertUSDtoCurrency(parseFloat(usdAmount), toCurrency);

        resolve({
          usd: usdAmount,
          eac: eacAmount,
          currency: convertedAmount.currency,
          currencyCode: toCurrency
        });
      } catch (error) {
        console.error('Conversion error:', error);
        reject(error);
      }
    });
  }

  // Modified existing method to accept currency parameter
  convertUSDtoCurrency = async (amount = 5, targetCurrency = this.currency) => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();

      const rate = data.rates[targetCurrency];
      const currency = amount * rate;

      return {
        usd: amount,
        currency: currency.toFixed(2),
        rate: rate.toFixed(2),
        timestamp: new Date(data.time_last_updated * 1000).toLocaleString()
      };
    } catch (error) {
      console.error(error);
      // Fallback to fixed rate if API fails
      return {
        usd: amount,
        currency: amount,
        rate: 1,
        timestamp: new Date().toLocaleString()
      };
    }
  }

  convertToUsd = async (amount = 5, fromCurrency = 'USD') => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();

      const rate = data.rates[fromCurrency];
      const usd = amount / rate;

      return {
        usd: usd.toFixed(2),
        currency: amount,
        rate: rate.toFixed(2),
        timestamp: new Date(data.time_last_updated * 1000).toLocaleString()
      };
    } catch (error) {
      console.error(error);
      // Fallback to fixed rate if API fails
      return {
        usd: amount,
        currency: amount,
        rate: 1,
        timestamp: new Date().toLocaleString()
      };
    }
  }

  fetchUsd = async (ammount) => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      return {
        usd: (ammount / data.rates[this.currency]).toFixed(2),
        currency: ammount,
        rate: data.rates[this.currency],
        timestamp: new Date(data.time_last_updated * 1000).toLocaleString()
      }
    } catch (error) {
      console.error('Failed to fetch USD rate:', error);
      return {
        usd: ammount,
        currency: ammount,
        rate: 1,
        timestamp: new Date().toLocaleString()
      }
    }
  }

  // noinspection JSUnusedGlobalSymbols
  connectedCallback() {
    const form = this.shadowObj.querySelector("form");
    this.inputListener(form);
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
        ${this.getButtons()}
      </form>
    `;
  }

  getHead = () => {
    return /* html */`
      <h3 class="title">Withdrawal Amount</h3>
      <p class="description">
        <span class="text">
          Ensure that the amount is within the allowed range of <b>${this.minAmount}</b> to <b>${this.maxAmount} EAC</b>.
        </span>
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
      <div class="input-amount amount">
        <span class="label">Enter the amount to withdraw</span>
        <div class="input">
          <div class="one">
            <input type="number" inputmode="numeric" pattern="[0-9]*" EAC" max="${this.maxAmount}" min="${this.minAmount}" step="0.0001" required placeholder="${this.minAmount} EAC">
            <span class="warning">You can withdraw between <span>${this.minAmount}</span> and <span>${this.maxAmount}</span> EAC</span>
          </div>
        </div>
      </div>
      <div class="input-amount recieve">
        <span class="label">You will recieve(${this.getAttribute('kind') === 'mpesa' || this.getAttribute('kind') === 'agent' ? 'KES' : 'USD'})</span>
        <div class="input">
          <div class="one">
            <input type="number" inputmode="numeric" pattern="[0-9]*" placeholder="${this.getAttribute('kind') === 'mpesa' || this.getAttribute('kind') === 'agent' ? '1 KES' : '$0.01'}" required step="0.01">
            <span class="warning">You will recieve ${this.getAttribute('kind') === 'mpesa' || this.getAttribute('kind') === 'agent' ? '1 KES' : '$0.01'}</span>
          </div>
        </div>
      </div>
    `;
  };


  inputListener = async form => {
    const input = form.querySelector("input[type='number']");
    const inputRecieve = form.querySelector(".input-amount.recieve > .input > .one > input");
    const warn = form.querySelector(".warning");
    const recieve = form.querySelector(".input-amount.recieve > .input > .one > .warning");
    const kind = this.getAttribute('kind');

    input.addEventListener("input", async e => {
      let value = this.number.parse(e.target.value);

      if (value < this.minAmount || value > this.maxAmount) {
        warn.classList.add("failed");
        warn.classList.remove("success");
        warn.innerHTML = `You can withdraw between <span>${this.minAmount}</span> and <span>${this.maxAmount}</span> EAC`;
        recieve.classList.add("failed");
        recieve.classList.remove("success");
        recieve.innerHTML = 'Cannot withdraw entered amount';
        return;
      }


      // get charge
      const charge = this.getCharge(value);

      // IF charge + value > balance
      if (value + charge > this.balance) {
        warn.classList.add("failed");
        warn.classList.remove("success");
        warn.innerHTML = `You have insufficient funds to withdraw <span>${this.number.balanceWithCommas(value)} EAC</span> and charges of <span>${this.number.balanceWithCommas(charge)} EAC</span>`;
        recieve.classList.add("failed");
        recieve.classList.remove("success");
        recieve.innerHTML = 'Cannot withdraw entered amount';
        return;
      }

      // convert to USD
      const { usd } = await this.convertFromEAC(value, 'USD');
      const { usd: chargeUsd } = await this.convertFromEAC(charge, 'USD');

      // convert to USD then to KES
      if (kind === 'mpesa' || kind === 'agent') {
        // conevert to KES
        const { currency } = await this.convertUSDtoCurrency(usd, 'KES');
        const { currency: chargeCurrency } = await this.convertUSDtoCurrency(chargeUsd, 'KES');

        console.log('USD:', usd, 'Charge:', chargeUsd, 'KES:', currency, 'Charge KES:', chargeCurrency);

        inputRecieve.value = currency;

        warn.classList.remove("failed");
        warn.classList.add("success");
        warn.innerHTML = `You will withdraw <span>${this.number.balanceWithCommas(value)} EAC</span> and <span>${this.number.balanceWithCommas(charge)} EAC</span> will be deducted as charges`;
        recieve.classList.remove("failed");
        recieve.classList.add("success");
        recieve.innerHTML = `You will recieve <span>${this.number.balanceWithCommas(currency)} KES</span> and <span>${this.number.balanceWithCommas(chargeCurrency)} KES</span> will be deducted as charges`;
      } else {
        inputRecieve.value = usd;
        warn.classList.remove("failed");
        warn.classList.add("success");
        warn.innerHTML = `You will withdraw <span>${this.number.balanceWithCommas(value)} EAC</span> and <span>${this.number.balanceWithCommas(charge)} EAC</span> will be deducted as charges`;
        recieve.classList.remove("failed");
        recieve.classList.add("success");
        recieve.innerHTML = `You will recieve <span>$${this.number.balanceWithCommas(usd)}</span> and <span>$${this.number.balanceWithCommas(chargeUsd)}</span> will be deducted as charges`;
      }
    })


    inputRecieve.addEventListener("input", async e => {
      let value = this.number.parse(e.target.value);

      if (kind === 'mpesa' || kind === 'agent') {
        // convert to USD
        const { eac } = await this.convertToEAC(value, 'KES');

        // check if value is within range
        if (eac < this.minAmount || eac > this.maxAmount) {
          warn.classList.add("failed");
          warn.classList.remove("success");
          warn.innerHTML = `You can withdraw between <span>${this.minAmount}</span> and <span>${this.maxAmount}</span> EAC`;
          recieve.classList.add("failed");
          recieve.classList.remove("success");
          recieve.innerHTML = 'Cannot withdraw entered amount';
          return;
        }

        const charge = this.getCharge(eac);

        // if charge + value > balance
        if (eac + charge > this.balance) {
          warn.classList.add("failed");
          warn.classList.remove("success");
          warn.innerHTML = `You have insufficient funds to withdraw <span>${this.number.balanceWithCommas(eac)} EAC</span> and charges of <span>${this.number.balanceWithCommas(charge)} EAC</span>`;
          recieve.classList.add("failed");
          recieve.classList.remove("success");
          recieve.innerHTML = 'Cannot withdraw entered amount';
          return
        }

        const { usd: chargeUsd } = await this.convertFromEAC(charge, 'USD');
        const { currency: chargeCurrency } = await this.convertUSDtoCurrency(chargeUsd, 'KES');

        input.value = eac;

        warn.classList.remove("failed");
        warn.classList.add("success");
        warn.innerHTML = `You will withdraw <span>${this.number.balanceWithCommas(eac)} EAC</span> and <span>${this.number.balanceWithCommas(this.getCharge(eac))} EAC</span> will be deducted as charges`;
        recieve.classList.remove("failed");
        recieve.classList.add("success");
        recieve.innerHTML = `You will recieve <span>${this.number.balanceWithCommas(value)} KES</span> and <span>${this.number.balanceWithCommas(chargeCurrency)} KES</span> will be deducted as charges`;
      } else {
        // convert to EAC
        const { eac } = await this.convertToEAC(value, 'USD');

        // check if value is within range
        if (eac < this.minAmount || eac > this.maxAmount) {
          warn.classList.add("failed");
          warn.classList.remove("success");
          warn.innerHTML = `You can withdraw between <span>${this.minAmount}</span> and <span>${this.maxAmount}</span> EAC`;
          recieve.classList.add("failed");
          recieve.classList.remove("success");
          recieve.innerHTML = 'Cannot withdraw entered amount';
          return;
        }

        // get charge
        const charge = this.getCharge(eac);

        const { usd: chargeUsd } = await this.convertToUsd(charge, 'USD');

        // if charge + value > balance
        if (eac + charge > this.balance) {
          warn.classList.add("failed");
          warn.classList.remove("success");
          warn.innerHTML = `You have insufficient funds to withdraw <span>${this.number.balanceWithCommas(eac)} EAC</span> and charges of <span>${this.number.balanceWithCommas(charge)} EAC</span>`;
          recieve.classList.add("failed");
          recieve.classList.remove("success");
          recieve.innerHTML = 'Cannot withdraw entered amount';
          return
        }

        input.value = eac;

        warn.classList.remove("failed");
        warn.classList.add("success");
        warn.innerHTML = `You will withdraw <span>${this.number.balanceWithCommas(eac)} EAC</span> and <span>${this.number.balanceWithCommas(this.getCharge(eac))} EAC</span> will be deducted as charges`;
        recieve.classList.remove("failed");
        recieve.classList.add("success");
        recieve.innerHTML = `You will recieve <span>$${this.number.balanceWithCommas(value)}</span> and <span>$${this.number.balanceWithCommas(chargeUsd)}</span> will be deducted as charges`;
      }
    })
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
          padding: 0 0 30px;
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
        
        .form > .head > .title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          margin: 15px 0 0;
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
          gap: 5px;
          width: 100%;
          padding: 10px;
          border-radius: 12px;
        }

        .form > .input-amount > .label {
          font-size: 1rem;
          font-weight: 500;
          padding: 3px 10px 12px;
          color: var(--gray-color);
          width: 100%;
          font-family: var(--font-main), sans-serif;
        }

        .form > .input-amount > .input {
          display: flex;
          flex-flow: row;
          padding: 0;
          gap: 5px;
          width: 100%;
          align-items: center;
          justify-content: space-between;
        }

        .form > .input-amount > .input > .one {
          display: flex;
          flex-flow: column;
          padding: 0;
          align-items: center;
          justify-content: center;
          gap: 20px;
          width: 100%;
        }

        .form > .input-amount > .input > .one > input[type="number"] {
          width: 100%;
          padding: 10px;
          border: var(--input-border);
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
          font-size: 1.35rem;
          font-weight: 600;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
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
          display: inline-block;
          width: 100%;
          text-align: start;
          font-size: 0.9rem;
          font-weight: 500;
          padding: 3px 0;
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