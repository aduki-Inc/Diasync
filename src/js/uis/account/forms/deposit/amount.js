export default class AmountForm extends HTMLDivElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.countries = [
      // North America
      { name: "USD", country: "United States", flag: "🇺🇸" },
      { name: "CAD", country: "Canada", flag: "🇨🇦" },
      { name: "MXN", country: "Mexico", flag: "🇲🇽" },
      { name: "GTQ", country: "Guatemala", flag: "🇬🇹" },
      { name: "BZD", country: "Belize", flag: "🇧🇿" },
      { name: "HNL", country: "Honduras", flag: "🇭🇳" },
      { name: "NIO", country: "Nicaragua", flag: "🇳🇮" },
      { name: "CRC", country: "Costa Rica", flag: "🇨🇷" },
      { name: "PAB", country: "Panama", flag: "🇵🇦" },

      // Caribbean
      { name: "CUP", country: "Cuba", flag: "🇨🇺" },
      { name: "HTG", country: "Haiti", flag: "🇭🇹" },
      { name: "DOP", country: "Dominican Republic", flag: "🇩🇴" },
      { name: "JMD", country: "Jamaica", flag: "🇯🇲" },
      { name: "TTD", country: "Trinidad and Tobago", flag: "🇹🇹" },
      { name: "BBD", country: "Barbados", flag: "🇧🇧" },
      { name: "BSD", country: "Bahamas", flag: "🇧🇸" },
      { name: "XCD", country: "Eastern Caribbean", flag: "🏴‍☠️" },
      { name: "AWG", country: "Aruba", flag: "🇦🇼" },
      { name: "ANG", country: "Curaçao and Sint Maarten", flag: "🇨🇼" },
      { name: "KYD", country: "Cayman Islands", flag: "🇰🇾" },

      // South America
      { name: "BRL", country: "Brazil", flag: "🇧🇷" },
      { name: "ARS", country: "Argentina", flag: "🇦🇷" },
      { name: "CLP", country: "Chile", flag: "🇨🇱" },
      { name: "COP", country: "Colombia", flag: "🇨🇴" },
      { name: "PEN", country: "Peru", flag: "🇵🇪" },
      { name: "VES", country: "Venezuela", flag: "🇻🇪" },
      { name: "BOB", country: "Bolivia", flag: "🇧🇴" },
      { name: "UYU", country: "Uruguay", flag: "🇺🇾" },
      { name: "PYG", country: "Paraguay", flag: "🇵🇾" },
      { name: "GYD", country: "Guyana", flag: "🇬🇾" },
      { name: "SRD", country: "Suriname", flag: "🇸🇷" },
      { name: "FKP", country: "Falkland Islands", flag: "🇫🇰" },

      // Europe
      { name: "EUR", country: "European Union", flag: "🇪🇺" },
      { name: "GBP", country: "United Kingdom", flag: "🇬🇧" },
      { name: "CHF", country: "Switzerland", flag: "🇨🇭" },
      { name: "RUB", country: "Russia", flag: "🇷🇺" },
      { name: "NOK", country: "Norway", flag: "🇳🇴" },
      { name: "SEK", country: "Sweden", flag: "🇸🇪" },
      { name: "DKK", country: "Denmark", flag: "🇩🇰" },
      { name: "PLN", country: "Poland", flag: "🇵🇱" },
      { name: "CZK", country: "Czech Republic", flag: "🇨🇿" },
      { name: "RON", country: "Romania", flag: "🇷🇴" },
      { name: "HUF", country: "Hungary", flag: "🇭🇺" },
      { name: "BGN", country: "Bulgaria", flag: "🇧🇬" },
      { name: "HRK", country: "Croatia", flag: "🇭🇷" },
      { name: "RSD", country: "Serbia", flag: "🇷🇸" },
      { name: "ALL", country: "Albania", flag: "🇦🇱" },
      { name: "MKD", country: "North Macedonia", flag: "🇲🇰" },
      { name: "BAM", country: "Bosnia and Herzegovina", flag: "🇧🇦" },
      { name: "UAH", country: "Ukraine", flag: "🇺🇦" },
      { name: "MDL", country: "Moldova", flag: "🇲🇩" },
      { name: "BYN", country: "Belarus", flag: "🇧🇾" },
      { name: "ISK", country: "Iceland", flag: "🇮🇸" },

      // Asia
      { name: "JPY", country: "Japan", flag: "🇯🇵" },
      { name: "CNY", country: "China", flag: "🇨🇳" },
      { name: "HKD", country: "Hong Kong", flag: "🇭🇰" },
      { name: "TWD", country: "Taiwan", flag: "🇹🇼" },
      { name: "KRW", country: "South Korea", flag: "🇰🇷" },
      { name: "INR", country: "India", flag: "🇮🇳" },
      { name: "SGD", country: "Singapore", flag: "🇸🇬" },
      { name: "IDR", country: "Indonesia", flag: "🇮🇩" },
      { name: "MYR", country: "Malaysia", flag: "🇲🇾" },
      { name: "PHP", country: "Philippines", flag: "🇵🇭" },
      { name: "THB", country: "Thailand", flag: "🇹🇭" },
      { name: "VND", country: "Vietnam", flag: "🇻🇳" },
      { name: "KHR", country: "Cambodia", flag: "🇰🇭" },
      { name: "MMK", country: "Myanmar", flag: "🇲🇲" },
      { name: "LAK", country: "Laos", flag: "🇱🇦" },
      { name: "BND", country: "Brunei", flag: "🇧🇳" },
      { name: "TLS", country: "East Timor", flag: "🇹🇱" },
      { name: "MOP", country: "Macau", flag: "🇲🇴" },
      { name: "MVR", country: "Maldives", flag: "🇲🇻" },
      { name: "LKR", country: "Sri Lanka", flag: "🇱🇰" },
      { name: "BTN", country: "Bhutan", flag: "🇧🇹" },
      { name: "NPR", country: "Nepal", flag: "🇳🇵" },
      { name: "BDT", country: "Bangladesh", flag: "🇧🇩" },
      { name: "PKR", country: "Pakistan", flag: "🇵🇰" },
      { name: "AFN", country: "Afghanistan", flag: "🇦🇫" },

      // Middle East
      { name: "ILS", country: "Israel", flag: "🇮🇱" },
      { name: "SAR", country: "Saudi Arabia", flag: "🇸🇦" },
      { name: "AED", country: "United Arab Emirates", flag: "🇦🇪" },
      { name: "QAR", country: "Qatar", flag: "🇶🇦" },
      { name: "OMR", country: "Oman", flag: "🇴🇲" },
      { name: "BHD", country: "Bahrain", flag: "🇧🇭" },
      { name: "KWD", country: "Kuwait", flag: "🇰🇼" },
      { name: "IRR", country: "Iran", flag: "🇮🇷" },
      { name: "IQD", country: "Iraq", flag: "🇮🇶" },
      { name: "YER", country: "Yemen", flag: "🇾🇪" },
      { name: "SYP", country: "Syria", flag: "🇸🇾" },
      { name: "JOD", country: "Jordan", flag: "🇯🇴" },
      { name: "LBP", country: "Lebanon", flag: "🇱🇧" },

      // Central Asia
      { name: "KZT", country: "Kazakhstan", flag: "🇰🇿" },
      { name: "UZS", country: "Uzbekistan", flag: "🇺🇿" },
      { name: "TMT", country: "Turkmenistan", flag: "🇹🇲" },
      { name: "KGS", country: "Kyrgyzstan", flag: "🇰🇬" },
      { name: "TJS", country: "Tajikistan", flag: "🇹🇯" },

      // Africa
      { name: "ZAR", country: "South Africa", flag: "🇿🇦" },
      { name: "NGN", country: "Nigeria", flag: "🇳🇬" },
      { name: "EGP", country: "Egypt", flag: "🇪🇬" },
      { name: "KES", country: "Kenya", flag: "🇰🇪" },
      { name: "GHS", country: "Ghana", flag: "🇬🇭" },
      { name: "MAD", country: "Morocco", flag: "🇲🇦" },
      { name: "TND", country: "Tunisia", flag: "🇹🇳" },
      { name: "ETB", country: "Ethiopia", flag: "🇪🇹" },
      { name: "DZD", country: "Algeria", flag: "🇩🇿" },
      { name: "UGX", country: "Uganda", flag: "🇺🇬" },
      { name: "TZS", country: "Tanzania", flag: "🇹🇿" },
      { name: "RWF", country: "Rwanda", flag: "🇷🇼" },
      { name: "BIF", country: "Burundi", flag: "🇧🇮" },
      { name: "SOS", country: "Somalia", flag: "🇸🇴" },
      { name: "SDG", country: "Sudan", flag: "🇸🇩" },
      { name: "LYD", country: "Libya", flag: "🇱🇾" },
      { name: "XOF", country: "West African CFA", flag: "🌍" },
      { name: "XAF", country: "Central African CFA", flag: "🌍" },
      { name: "MUR", country: "Mauritius", flag: "🇲🇺" },
      { name: "SCR", country: "Seychelles", flag: "🇸🇨" },
      { name: "GMD", country: "Gambia", flag: "🇬🇲" },
      { name: "CVE", country: "Cape Verde", flag: "🇨🇻" },
      { name: "SLL", country: "Sierra Leone", flag: "🇸🇱" },
      { name: "LRD", country: "Liberia", flag: "🇱🇷" },
      { name: "GNF", country: "Guinea", flag: "🇬🇳" },
      { name: "CDF", country: "Democratic Republic of the Congo", flag: "🇨🇩" },
      { name: "AOA", country: "Angola", flag: "🇦🇴" },
      { name: "ZMW", country: "Zambia", flag: "🇿🇲" },
      { name: "MWK", country: "Malawi", flag: "🇲🇼" },
      { name: "MZN", country: "Mozambique", flag: "🇲🇿" },
      { name: "BWP", country: "Botswana", flag: "🇧🇼" },
      { name: "NAD", country: "Namibia", flag: "🇳🇦" },
      { name: "LSL", country: "Lesotho", flag: "🇱🇸" },
      { name: "SZL", country: "Eswatini", flag: "🇸🇿" },
      { name: "MGA", country: "Madagascar", flag: "🇲🇬" },
      { name: "KMF", country: "Comoros", flag: "🇰🇲" },
      { name: "DJF", country: "Djibouti", flag: "🇩🇯" },
      { name: "ERN", country: "Eritrea", flag: "🇪🇷" },
      { name: "SSP", country: "South Sudan", flag: "🇸🇸" },
      { name: "STN", country: "São Tomé and Príncipe", flag: "🇸🇹" },

      // Oceania
      { name: "AUD", country: "Australia", flag: "🇦🇺" },
      { name: "NZD", country: "New Zealand", flag: "🇳🇿" },
      { name: "PGK", country: "Papua New Guinea", flag: "🇵🇬" },
      { name: "SBD", country: "Solomon Islands", flag: "🇸🇧" },
      { name: "VUV", country: "Vanuatu", flag: "🇻🇺" },
      { name: "FJD", country: "Fiji", flag: "🇫🇯" },
      { name: "WST", country: "Samoa", flag: "🇼🇸" },
      { name: "TOP", country: "Tonga", flag: "🇹🇴" },
      { name: "XPF", country: "CFP Franc (French territories)", flag: "🇵🇫" },
      { name: "KID", country: "Kiribati", flag: "🇰🇮" },
      { name: "NRU", country: "Nauru", flag: "🇳🇷" },
      { name: "TVD", country: "Tuvalu", flag: "🇹🇻" }
    ].sort((a, b) => a.country.localeCompare(b.country));
    this.rate = 1.0;
    this.currency = "USD";
    this.last = "USD";
    this.minmum = 0.01;
    this.maximum = 1000;
    this.eacToUsd = 5;
    this.render();
  }

  validateAmountInUSD(amount, fromCurrency) {
    // Convert to USD first
    const usdAmount = fromCurrency === "USD" ? amount : this.convertToUsd(amount, fromCurrency);
    if (usdAmount > 1000) return { valid: false, reason: "Exceeds max of 1000 USD" };
    if (usdAmount < 0.01) return { valid: false, reason: "Below min of 0.01 USD" };
    return { valid: true, amount: usdAmount };
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
    this.activateCurrencyDropdown(form);
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
        <div class="actions">
          ${this.getActions()}
        </div>
      </form>
    `;
  }

  getHead = () => {
    return /* html */`
      <h3 class="title">Deposit Amount</h3>
      <p class="description">This action will credit your Holding account.</p>
    `;
  }

  getActions = () => {
    return /* html */`
      <button class="action" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
          <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="text">Back</span>
      </button>
      <button class="action buy" type="button">
        <span class="text">Continue</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
          <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    `;
  }

  getForm = () => {
    return /* html*/`
      <div class="input-amount pay">
        <span class="label">Enter amount you want to deposit</span>
        <div class="input">
          <div class="currencies">
            <span class="label">Currency</span>
            <span class="currency">
              <span class="text">USD</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <div class="dropdown">
              <input type="search" class="no-spinner" name="currency" placeholder="Search country" />
              <div class="currency-list">
                ${this.countriesCurrencies()}
              </div>
            </div>
          </div>
          <div class="one">
            <input type="text" step="0.01" class="no-spinner" name="pay" placeholder="${this.number.balanceWithCommas(this.minmum)} ${this.currency}" />
            <span class="warning">You pay <span>0 ${this.currency}</span></span>
          </div>
        </div>
      </div>
      <div class="input-amount receive">
        <span class="label">You receive</span>
        <div class="input">
          <div class="one">
            <input type="text" step="0.0001" class="no-spinner" name="receive" placeholder="50 EAC" />
            <span class="warning">You will recieve <span>0 EAC</span></span>
          </div>
        </div>
      </div>
    `
  }

  countriesCurrencies = () => {
    return this.countries.map(country => {
      return /* html */`
        <div class="currency-item">
          <span class="flag">${country.flag}</span>
          <div class="currency-info">
            <span class="currency-name">${country.name}</span>
            <span class="currency-country">${country.country}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Improved dropdown and currency selection methods
  activateCurrencyDropdown = form => {
    const dropdown = form.querySelector(".input-amount.pay .dropdown");
    const currencyToggle = form.querySelector(".input-amount.pay .currencies .currency");
    const searchInput = dropdown.querySelector("input[type=search]");
    const currencyList = dropdown.querySelector(".currency-list");
    const currencyDisplay = form.querySelector(".currencies .text");
    const currencyItems = dropdown.querySelectorAll(".currency-item");

    // Toggle dropdown
    currencyToggle.addEventListener("click", () => {
      dropdown.style.display = 'flex';
      searchInput.value = ''; // Clear search on open
      this.resetCurrencyList(currencyItems);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!dropdown.contains(event.target) && !currencyToggle.contains(event.target)) {
        // dropdown.style.display = 'none';
      }
    });

    // Search functionality
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      currencyItems.forEach(item => {
        const currencyName = item.querySelector(".currency-name").textContent.toLowerCase();
        const countryName = item.querySelector(".currency-country").textContent.toLowerCase();

        item.style.display = (currencyName.includes(searchTerm) || countryName.includes(searchTerm))
          ? 'flex'
          : 'none';
      });
    });

    // Select currency
    currencyItems.forEach(item => {
      item.addEventListener("click", async () => {
        const currencyName = item.querySelector(".currency-name").textContent;
        const flag = item.querySelector(".flag").textContent;

        // Update display
        currencyDisplay.textContent = currencyName;
        this.last = this.currency;
        this.currency = currencyName;

        // Close dropdown
        dropdown.style.display = 'none';

        this.upadateInputPlaceholder(form, currencyName);

        // Trigger conversion if there's a value in pay input
        const payInput = form.querySelector("input[name=pay]");
        if (payInput.value) {
          await this.updateConversion(payInput.value, currencyName);
        }
      });
    });
  }

  // Helper method to update input placeholder
  upadateInputPlaceholder = async (form, currency) => {
    const payInput = form.querySelector("input[name=pay]");
    const receiveInput = form.querySelector("input[name=receive]");
    const pay = form.querySelector(".input-amount.pay .warning");
    const receive = form.querySelector(".input-amount.receive .warning");

    const payValue = this.number.parse(payInput.value);

    // value to new currency
    const conversion = this.last === 'USD' ? await this.fetchUsd(payValue) : await this.convertToUsd(payValue, this.last);
    const convertedAmount = await this.convertUSDtoCurrency(conversion.usd, currency);
    const convertedMin = await this.convertUSDtoCurrency(this.minmum, currency);

    // Update placeholders
    if (isNaN(payValue) || payValue <= 0) {
      payInput.placeholder = `${this.number.balanceWithCommas(convertedMin.currency)} ${currency}`;
      receiveInput.placeholder = `50 EAC`;
      return;
    }

    // Update inputs values
    receiveInput.value = convertedAmount.currency;

    payInput.value = convertedAmount.currency;
    pay.innerHTML = `You pay <span>${this.number.balanceWithCommas(convertedAmount.currency)} ${currency}</span>`;
  }

  // Helper method to reset currency list visibility
  resetCurrencyList = (currencyItems) => {
    currencyItems.forEach(item => {
      item.style.display = 'flex';
    });
  }

  // New method to update conversion dynamically
  updateConversion = async (amount, currency) => {
    try {
      // Convert to EAC
      const conversion = await this.convertToEAC(parseFloat(amount), currency);

      // Update receive input
      const receiveInput = this.shadowObj.querySelector("input[name=receive]");
      const receiveWarning = this.shadowObj.querySelector(".input-amount.receive .warning");

      receiveInput.value = conversion.eac;
      receiveWarning.innerHTML = `You will receive <span>${this.number.balanceWithCommas(conversion.eac)} EAC</span>`;
    } catch (error) {
      console.error('Conversion update failed:', error);
    }
  }

  getConset = () => {
    return /* html */`
      <p>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
          <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" stroke-width="1.8" />
          <path d="M8 12.5L10.5 15L16 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>By <b>Continuing</b> to deposit you indicate that you agree to our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms of Service</a></span>
      </p>
    `;
  }

  inputListener = form => {
    const pay = form.querySelector("input[name=pay]");
    const receive = form.querySelector("input[name=receive]");
    const buy = form.querySelector(".actions > button.buy");
    const warn = form.querySelector(".input-amount.pay .warning");
    const receiveWarning = form.querySelector(".input-amount.receive .warning");

    const sanitizeInput = (input) => {
      return input
        .replace(/[^\d.]/g, '')
        .replace(/^\./, '')
        .replace(/(\..*)\./g, '$1')
        .replace(/^0+(?=\d)/, '')
        .replace(/(\.\d{4})\d+/g, '$1');
    };

    const validateAmount = async (amount, currency, isReceiveInput = false) => {
      try {
        // Convert to USD for limit checking
        const usdConversion = currency === 'USD'
          ? await this.fetchUsd(amount)
          : await this.convertToUsd(amount, currency);

        const usdAmount = parseFloat(usdConversion.usd);

        // CONVERT limits to currency
        const minmum = currency === 'USD' ? '0.01' : await this.convertUSDtoCurrency(this.minmum, currency);
        const maximum = currency === 'USD' ? '1000' : await this.convertUSDtoCurrency(this.maximum, currency);

        if (usdAmount < this.minmum || usdAmount > this.maximum) {
          return {
            valid: false,
            usdAmount,
            message: `Deposit must be between ${currency === 'USD' ? '$0.01' : minmum.currency} and ${currency === 'USD' ? '$1,000' : this.number.balanceWithCommas(maximum.currency)} ${currency}`,
            receiveMsg: `Deposit must be between 0.002 and 200 EAC`
          };
        }

        return {
          valid: true,
          usdAmount
        };
      } catch (error) {
        console.error('Validation error:', error);
        return {
          valid: false,
          message: 'Conversion error. Please try again.'
        };
      }
    };

    const handlePayInput = async () => {
      pay.value = sanitizeInput(pay.value);

      const total = parseFloat(pay.value);

      if (isNaN(total) || total <= 0) {
        resetInputs();
        return;
      }

      try {
        // Validate amount
        const validation = await validateAmount(total, this.currency);

        if (!validation.valid) {
          showError(warn, validation.message, validation.usdAmount, false);
          showError(receiveWarning, validation.receiveMsg, total, true);
          return;
        }

        // Convert input currency to EAC
        const conversion = await this.convertToEAC(total, this.currency);

        updateSuccessUI(total, conversion.eac);
      } catch (error) {
        console.error('Conversion error:', error);
        resetInputs(true);
      }
    };

    const handleReceiveInput = async () => {
      receive.value = sanitizeInput(receive.value);

      const total = this.number.parse(receive.value);

      if (isNaN(total) || total <= 0) {
        resetInputs();
        return;
      }

      try {
        // Convert EAC to selected currency
        const conversion = await this.convertFromEAC(total, this.currency);

        // Validate converted amount
        const validation = await validateAmount(conversion.currency, this.currency, true);

        if (!validation.valid) {
          showError(receiveWarning, validation.receiveMsg, total, true);
          showError(warn, validation.message, conversion.usd, false);
          return;
        }

        updateSuccessUI(conversion.currency, total, true);
      } catch (error) {
        console.error('Conversion error:', error);
        resetInputs(true);
      }
    };

    const resetInputs = (isError = false) => {
      showError(warn, isError
        ? 'Conversion error. Please try again.'
        : 'Please enter a valid amount.', false);

      showError(receiveWarning, isError
        ? 'Conversion error. Please try again.'
        : 'Please enter a valid amount.', true);
    };

    const showError = (element, message, isReceiveInput = false) => {
      element.classList.remove("success");
      element.classList.add("failed");
      element.innerHTML = message;
      element.style.display = "inline-block";
    };

    const updateSuccessUI = async (payAmount, receiveAmount, isReceiveInput = false) => {
      warn.classList.remove("failed");
      warn.classList.add("success");
      warn.innerHTML = `You will pay <span>${this.number.balanceWithCommas(payAmount)} ${this.currency}</span>`;
      warn.style.display = "inline-block";

      receiveWarning.classList.remove("failed");
      receiveWarning.classList.add("success");
      receiveWarning.innerHTML = `You will receive <span>${this.number.balanceWithCommas(receiveAmount)} EAC</span>`;
      receiveWarning.style.display = "inline-block";

      if (!isReceiveInput) {
        receive.value = this.number.balanceWithCommas(receiveAmount);
      } else {
        pay.value = this.number.balanceWithCommas(payAmount);
      }
    };

    pay.addEventListener("input", handlePayInput);
    receive.addEventListener("input", handleReceiveInput);
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

        .form > .input-amount {
          border: var(--border);
          display: flex;
          flex-flow: column;
          gap: 10px;
          width: 100%;
          padding: 10px;
          border-radius: 12px;
        }

        .form > .input-amount > .label {
          font-size: 1rem;
          font-weight: 500;
          color: var(--gray-color);
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
          flex-flow: column;
          gap: 10px;
          width: calc(100% - 50px);
        }

        .form > .input-amount.pay > .input > .one {
          height: 100px;
          display: flex;
          flex-flow: column;
          gap: 10px;
          padding: 0 0 2px;
          align-items: start;
          justify-content: space-between
        }

        .form > .input-amount > .input > .one > input {
          width: 100%;
          padding: 10px 0;
          border: none;
          outline: none;
          font-size: 1.35rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-text), sans-serif;
        }

        .form > .input-amount.pay > .input > .one > input {
          font-size: 1.15rem;
        }

        .form > .input-amount > .input > .one > input {
          border: var(--border);
          padding: 15px 10px;
          border-radius: 12px;
        }

        .form > .input-amount > .input > .one > input:-webkit-autofill,
        .form > .input-amount > .input > .one > input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 30px var(--background) inset !important;
        }

        .form > .input-amount.receive > .input > .one {
          display: flex;
          flex-flow: column;
          gap: 10px;
          width: 100%;
        }

        .form > .input-amount.receive > .input > .one > input {
          width: 100%;
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

        .form > .input-amount.pay {
          position: relative;
          height: 160px;
          display: flex;
          gap: 0;
          padding: 10px 10px 15px;
          flex-flow: column;
          align-items: start;
          justify-content: space-between; 
        }

        .form > .input-amount.pay > .input  {
          display: flex;
          flex-flow: row;
          gap: 10px;
          width: 100%;
          align-items: center;
          justify-content: space-between;
        }

        .form > .input-amount.pay > .input > .currencies {
          width: max-content;
          display: flex;
          flex-flow: column;
          gap: 10px;
          height: 100px;
          padding: 10px;
          border: var(--border);
          border-radius: 12px;
        }

        .form > .input-amount.pay > .input > .currencies > .label {
          font-size: 1rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
        }

        .form > .input-amount.pay > .input > .currencies > .currency {
          display: flex;
          flex-flow: row;
          gap: 8px;
          align-items: center;
          justify-content: center;
          border: var(--border);
          padding: 7px 10px;
          border-radius: 12px;
          cursor: pointer;
          width: max-content;
        }

        .form > .input-amount.pay > .input > .currencies > .currency > .text {
          font-size: 1rem;
          font-weight: 500;
          color: var(--gray-color);
        }

        .form > .input-amount.pay > .input > .currencies > .currency > svg {
          width: 24px;
          height: 24px;
          color: var(--gray-color);
        }

        .form > .input-amount.pay > .input > .currencies > .dropdown {
          position: absolute;
          z-index: 1;
          top: calc(100% - 10px);
          left: 0;
          width: 350px;
          min-width: 350px;
          display: none;
          flex-flow: column;
          gap: 5px;
          padding: 0;
          max-height: 300px;
          border-radius: 12px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--accent-color) var(--scroll-bar-background);
          border: var(--border);
          background: var(--background);
        }

        .form > .input-amount.pay > .input > .currencies > .dropdown.open {
          display: flex;
        }

        .form > .input-amount.pay > .input > .currencies > .dropdown > input {
          width: 100%;
          padding: 12px 10px;
          border: none;
          outline: none;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-read), sans-serif;
          background: var(--background);
          border-bottom: var(--border);
          position: sticky;
          top: 0;
          z-index: 1;
        }

        .form > .input-amount.pay > .input > .currencies > .dropdown > .currency-list {
          display: flex;
          flex-flow: column;
          gap: 5px;
          padding: 0;
          width: 100%;
          padding: 10px;
        }

        .form > .input-amount.pay > .input > .currencies > .dropdown > .currency-list > .currency-item {
          display: flex;
          flex-flow: row;
          gap: 5px;
          padding: 10px;
          cursor: pointer;
          border-radius: 5px;
          transition: 0.3s;
        }

        .form > .input-amount.pay > .input > .currencies > .dropdown > .currency-list > .currency-item:hover {
          background: var(--revenue-background);
        }

        .form > .input-amount.pay > .input > .currencies > .dropdown > .currency-list > .currency-item > .flag  {
          font-size: 1.2rem;
          font-weight: 500;
        }

        .form > .input-amount.pay > .input > .currencies > .dropdown > .currency-list > .currency-item > .currency-info  {
          display: flex;
          flex-flow: row;
          gap: 5px;
          align-items: center;
          justify-content: flex-start;
        }

        .form > .input-amount.pay > .input > .currencies > .dropdown > .currency-list > .currency-item > .currency-info > .currency-name {
          font-family: var(--font-read), sans-serif;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-color);
        }

        .form > .input-amount.pay > .input > .currencies > .dropdown > .currency-list > .currency-item > .currency-info > .currency-country {
          font-family: var(--font-text), sans-serif;
          font-size: 0.9rem;
          color: var(--gray-color);
          /**add ellipsis for long country names */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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

        .form > .actions {
          display: flex;
          flex-flow: row;
          padding: 10px 0;
          gap: 10px;
          width: 100%;
          justify-content: space-between;
          align-items: center;
        }

        .form > .actions > button.action {
          width: calc(50% - 10px);
          padding: 12px 0;
          display: flex;
          flex-flow: row;
          gap: 10px;
          align-items: center;
          justify-content: center;
          border: none;
          outline: none;
          cursor: pointer;
          background: var(--gray-background);
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-text), sans-serif;
          border-radius: 15px;
        }

        .form > .actions > button.action > svg {
          display: inline-block;
          margin: 2px 0 0 0;
          width: 20px;
          height: 20px;
        }

        .form > .actions > button.action.buy {
          background: var(--accent-linear);
          color: var(--white-color);
        }

        .form > .actions > button.action.buy.disabled {
          background: var(--gray-background);
          color: var(--gray-color);
          border: none;
          opacity: 0.8;
          pointer-events: none;
        }

				@media screen and (max-width:660px) {
					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

					a,
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