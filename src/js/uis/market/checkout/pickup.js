export default class PickupContainer extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.utils = window.app.utils;
    // active tab
    this.active_tab = null;
    this.countries = {
      "AF": "Afghanistan",
      "AL": "Albania",
      "DZ": "Algeria",
      "AD": "Andorra",
      "AO": "Angola",
      "AG": "Antigua and Barbuda",
      "AR": "Argentina",
      "AM": "Armenia",
      "AU": "Australia",
      "AT": "Austria",
      "AZ": "Azerbaijan",
      "BS": "Bahamas",
      "BH": "Bahrain",
      "BD": "Bangladesh",
      "BB": "Barbados",
      "BY": "Belarus",
      "BE": "Belgium",
      "BZ": "Belize",
      "BJ": "Benin",
      "BT": "Bhutan",
      "BO": "Bolivia",
      "BA": "Bosnia and Herzegovina",
      "BW": "Botswana",
      "BR": "Brazil",
      "BN": "Brunei",
      "BG": "Bulgaria",
      "BF": "Burkina Faso",
      "BI": "Burundi",
      "CV": "Cabo Verde",
      "KH": "Cambodia",
      "CM": "Cameroon",
      "CA": "Canada",
      "CF": "Central African Republic",
      "TD": "Chad",
      "CL": "Chile",
      "CN": "China",
      "CO": "Colombia",
      "KM": "Comoros",
      "CG": "Congo (Congo-Brazzaville)",
      "CD": "Congo (Congo-Kinshasa/DRC)",
      "CR": "Costa Rica",
      "HR": "Croatia",
      "CU": "Cuba",
      "CY": "Cyprus",
      "CZ": "Czech Republic (Czechia)",
      "DK": "Denmark",
      "DJ": "Djibouti",
      "DM": "Dominica",
      "DO": "Dominican Republic",
      "EC": "Ecuador",
      "EG": "Egypt",
      "SV": "El Salvador",
      "GQ": "Equatorial Guinea",
      "ER": "Eritrea",
      "EE": "Estonia",
      "SZ": "Eswatini (Swaziland)",
      "ET": "Ethiopia",
      "FJ": "Fiji",
      "FI": "Finland",
      "FR": "France",
      "GA": "Gabon",
      "GM": "Gambia",
      "GE": "Georgia",
      "DE": "Germany",
      "GH": "Ghana",
      "GR": "Greece",
      "GD": "Grenada",
      "GT": "Guatemala",
      "GN": "Guinea",
      "GW": "Guinea-Bissau",
      "GY": "Guyana",
      "HT": "Haiti",
      "HN": "Honduras",
      "HU": "Hungary",
      "IS": "Iceland",
      "IN": "India",
      "ID": "Indonesia",
      "IR": "Iran",
      "IQ": "Iraq",
      "IE": "Ireland",
      "IL": "Israel",
      "IT": "Italy",
      "JM": "Jamaica",
      "JP": "Japan",
      "JO": "Jordan",
      "KZ": "Kazakhstan",
      "KE": "Kenya",
      "KI": "Kiribati",
      "KP": "Korea (North)",
      "KR": "Korea (South)",
      "KW": "Kuwait",
      "KG": "Kyrgyzstan",
      "LA": "Laos",
      "LV": "Latvia",
      "LB": "Lebanon",
      "LS": "Lesotho",
      "LR": "Liberia",
      "LY": "Libya",
      "LI": "Liechtenstein",
      "LT": "Lithuania",
      "LU": "Luxembourg",
      "MG": "Madagascar",
      "MW": "Malawi",
      "MY": "Malaysia",
      "MV": "Maldives",
      "ML": "Mali",
      "MT": "Malta",
      "MH": "Marshall Islands",
      "MR": "Mauritania",
      "MU": "Mauritius",
      "MX": "Mexico",
      "FM": "Micronesia",
      "MD": "Moldova",
      "MC": "Monaco",
      "MN": "Mongolia",
      "ME": "Montenegro",
      "MA": "Morocco",
      "MZ": "Mozambique",
      "MM": "Myanmar (Burma)",
      "NA": "Namibia",
      "NR": "Nauru",
      "NP": "Nepal",
      "NL": "Netherlands",
      "NZ": "New Zealand",
      "NI": "Nicaragua",
      "NE": "Niger",
      "NG": "Nigeria",
      "MK": "North Macedonia",
      "NO": "Norway",
      "OM": "Oman",
      "PK": "Pakistan",
      "PW": "Palau",
      "PS": "Palestine (limited recognition)",
      "PA": "Panama",
      "PG": "Papua New Guinea",
      "PY": "Paraguay",
      "PE": "Peru",
      "PH": "Philippines",
      "PL": "Poland",
      "PT": "Portugal",
      "QA": "Qatar",
      "RO": "Romania",
      "RU": "Russia",
      "RW": "Rwanda",
      "KN": "Saint Kitts and Nevis",
      "LC": "Saint Lucia",
      "VC": "Saint Vincent and the Grenadines",
      "WS": "Samoa",
      "SM": "San Marino",
      "ST": "Sao Tome and Principe",
      "SA": "Saudi Arabia",
      "SN": "Senegal",
      "RS": "Serbia",
      "SC": "Seychelles",
      "SL": "Sierra Leone",
      "SG": "Singapore",
      "SK": "Slovakia",
      "SI": "Slovenia",
      "SB": "Solomon Islands",
      "SO": "Somalia",
      "ZA": "South Africa",
      "SS": "South Sudan",
      "ES": "Spain",
      "LK": "Sri Lanka",
      "SD": "Sudan",
      "SR": "Suriname",
      "SE": "Sweden",
      "CH": "Switzerland",
      "SY": "Syria",
      "TJ": "Tajikistan",
      "TZ": "Tanzania",
      "TH": "Thailand",
      "TL": "Timor-Leste",
      "TG": "Togo",
      "TO": "Tonga",
      "TT": "Trinidad and Tobago",
      "TN": "Tunisia",
      "TR": "Turkey",
      "TM": "Turkmenistan",
      "TV": "Tuvalu",
      "UG": "Uganda",
      "UA": "Ukraine",
      "AE": "United Arab Emirates",
      "GB": "United Kingdom",
      "US": "United States",
      "UY": "Uruguay",
      "UZ": "Uzbekistan",
      "VU": "Vanuatu",
      "VA": "Vatican City",
      "VE": "Venezuela",
      "VN": "Vietnam",
      "YE": "Yemen",
      "ZM": "Zambia",
      "ZW": "Zimbabwe"
    }
    this.render(); 
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    const tabs = this.shadowObj.querySelector("ul.tabs");
    
    if (tabs) {
      this.activateTabController(tabs);
    }
  }

  activateTabController = tabs => {
    // get the active tab
    this.getOrSetActiveTab(tabs);

    // add click event listener to the tabs
    tabs.querySelectorAll("li").forEach(tab => {
      tab.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        // remove the active class from the active tab
        this.active_tab.classList.remove("active");

        // set the new active tab
        this.active_tab = tab;
        this.active_tab.classList.add("active");

        //TODO: hide the tab content
      });
    });
  }

  getOrSetActiveTab = tabs => {
    // get the active tab
    let activeTab = tabs.querySelector("li.active");

    if (!activeTab) {
      // if no active tab, set the first tab as active
      activeTab = tabs.querySelector("li");
      activeTab.classList.add("active");
      this.active_tab = activeTab;
    }

    // else set the active tab
    this.active_tab = activeTab;
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
      ${this.getInfo()}
    `;
  }

  getInfo = () => {
    return /* html */`
      <div class="content">
        ${this.getHead()}
        ${this.getSearch()}
        ${this.getStations()}
        ${this.getFooter()}
      </div>
    `;
  }

  getHead = () => {
    return /* html */`
      <div class="head">
        <h3 class="title">${this.getAttribute("name")}</h3>
        <div class="desc">
          <p>${this.getAttribute("desc")}</p>
        </div>
      </div>
    `;
  }

  getSearch = () => {
		return /* html */`
      <form action="" method="get" class="search">
        <div class="content country">
          <label for="country">Country</label>
          <select name="country" id="country" class="country">
            <option value="" disabled selected>Select Country</option>
            ${this.populateCountries(this.countries)}
          </select>
        </div>
        <div class="content city">
          <label for="city">Town / City</label>
          <select name="city" id="city" class="city">
            <option value="" disabled selected>Select City</option>
          </select>
        </div>
      </form>
    `;
	}

  populateCountries = countries => {
    if (!countries) return "";

    let html = "";
    for (const code in countries) {
      html += /* html */`<option value="${code}">${countries[code]}</option>`;
    }

    return html;
  }

  getStations = () => {
    // radio buttons
    return /* html */ `
      <div class="stations">
        <div class="station">
          <div class="input">
            <input type="radio" name="station" id="station-1" value="station-1">
            <span class="hex">PUPKEJD123X9</span>
          </div>
          <label for="station-1">
            <h4 class="name">Nairobi Central Station</h4>
            <p class="address">45 Kimathi Street, Nairobi, Kenya</p>
            <p class="desc">Located in the heart of Nairobi, this station offers easy access to all major transport lines.</p>
            ${this.getShiping({ global: { shipping: true, price: 1.32 }, local: { price: 3.68 } })}
            <span class="contact">
              <button class="chat">Message</button>
              <a href="tel:+254701234567" class="phone">Call</a>
              <a href="mailto:central@pickup.com" class="email">Email</a>
            </span>
          </label>
        </div>
        <div class="station">
          <div class="input">
            <input type="radio" name="station" id="station-2" value="station-2">
            <span class="hex">PUPGD768JH</span>
          </div>
          <label for="station-2">
            <h4 class="name">Cape Town Pickup Point</h4>
            <p class="address">12 Bree Street, Cape Town, South Africa</p>
            <p class="desc">Perfect for tourists and locals, this station is conveniently located near the V&A Waterfront.</p>
            ${this.getShiping({ global: { shipping: false }, local: { price: 3.68 } })}
            <span class="contact">
              <button class="chat">Message</button>
              <a href="tel:+27712345678" class="phone">Call</a>
              <a href="mailto:capetown@pickup.com" class="email">Email</a>
            </span>
          </label>
        </div>
        <div class="station">
          <div class="input">
            <input type="radio" name="station" id="station-3" value="station-3">
            <span class="hex">PUPEGIU876GH</span>
          </div>
          <label for="station-3">
            <h4 class="name">Accra Mall Station</h4>
            <p class="address">25 Liberation Road, Accra, Ghana</p>
            <p class="desc">Conveniently located next to the Accra Mall, offering plenty of parking and easy access.</p>
            ${this.getShiping({ global: { shipping: true, price: 1.72 }, local: { price: 3.68 } })}
            <span class="contact">
              <button class="chat">Message</button>
              <a href="tel:+233501234567" class="phone">Call</a>
              <a href="mailto:accra@pickup.com" class="email">Email</a>
            </span>
          </label>
        </div>
        <div class="station">
          <div class="input">
            <input type="radio" name="station" id="station-4" value="station-4">
            <span class="hex">PUPNGJW345TY</span>
          </div>
          <label for="station-4">
            <h4 class="name">Lagos Island Depot</h4>
            <p class="address">17 Marina Road, Lagos, Nigeria</p>
            <p class="desc">This station is central to Lagos Island, with great connectivity to commercial hubs.</p>
            ${this.getShiping({ global: { shipping: true, price: 1.92 }, local: { price: 3.68 } })}
            <span class="contact">
              <button class="chat">Message</button>
              <a href="tel:+2348023456789" class="phone">Call</a>
              <a href="mailto:lagos@pickup.com" class="email">Email</a>
            </span>
          </label>
        </div>
        <div class="station">
          <div class="input">
            <input type="radio" name="station" id="station-5" value="station-5">
            <span class="hex">PUPZX987PO</span>
          </div>
          <label for="station-5">
            <h4 class="name">Addis Ababa Central</h4>
            <p class="address">10 Churchill Avenue, Addis Ababa, Ethiopia</p>
            <p class="desc">Ideal for travelers, this station is just a stone’s throw from Meskel Square.</p>
            ${this.getShiping({ global: { shipping: true, price: 1.52 }, local: { price: 3.68 } })}
            <span class="contact">
              <button class="chat">Message</button>
              <a href="tel:+251911234567" class="phone">Call</a>
              <a href="mailto:addis@pickup.com" class="email">Email</a>
            </span>
          </label>
        </div>
        <div class="station">
          <div class="input">
            <input type="radio" name="station" id="station-6" value="station-6">
            <span class="hex">PUPTZU321QW</span>
          </div>
          <label for="station-6">
            <h4 class="name">Dar es Salaam Hub</h4>
            <p class="address">8 Julius Nyerere Road, Dar es Salaam, Tanzania</p>
            <p class="desc">Strategically placed near the ferry terminal, this station is perfect for inter-city travel.</p>
            ${this.getShiping({ global: { shipping: true, price: 1.42 }, local: { price: 3.68 } })}
            <span class="contact">
              <button class="chat">Message</button>
              <a href="tel:+255715123456" class="phone">Call</a>
              <a href="mailto:dar@pickup.com" class="email">Email</a>
            </span>
          </label>
        </div>
      </div>
    `;
  };

  getShiping = data => {
    if (data.global.shipping) {
      return /* html */`
        <div class="fees">
          <span class="fee local">
            <span class="text">Local</span>
            <span class="desc">Local stores</span>
            <span class="price">
              <span class="currency">乇</span>
              <span class="amount">${data.local.price}</span>
            </span>
          </span>
          <span class="fee global">
            <span class="text">Global</span>
            <span class="desc">Shipping per 1Kg</span>
            <span class="price">
              <span class="currency">乇</span>
              <span class="amount">${data.global.price}</span>
            </span>
          </span>
        </div>
      `;
    } else {
      return /* html */`
        <div class="fees">
          <span class="fee local">
            <span class="text">Local</span>
            <span class="desc">Local stores</span>
            <span class="price">
              <span class="currency">乇</span>
              <span class="amount">3.68</span>
            </span>
          </span>
          <span class="fee global disabled">
            <span class="text">Global</span>
            <span class="desc">We do not ship from stores outside the country</span>
          </span>
        </div>
      `;
    }
  }
  
  getFooter = () => {
    return /* html */`
      <div class="footer">
        <div class="action prev">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.4992 19.7504C15.3692 19.7504 15.2382 19.7174 15.1182 19.6464C14.3642 19.1994 7.75024 15.1914 7.75024 12.0004C7.75024 8.81043 14.3632 4.80143 15.1182 4.35443C15.4732 4.14343 15.9352 4.26143 16.1452 4.61843C16.3562 4.97543 16.2382 5.43543 15.8822 5.64643C13.3182 7.16543 9.25024 10.2334 9.25024 12.0004C9.25024 13.7704 13.3182 16.8374 15.8822 18.3544C16.2382 18.5654 16.3562 19.0254 16.1452 19.3824C16.0052 19.6184 15.7562 19.7504 15.4992 19.7504Z" fill="black"/>
          </svg>
          <span class="text">Cancel</span>
        </div>
        <div class="action next">
          <span class="text">Next</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.50076 19.7504C8.63076 19.7504 8.76176 19.7174 8.88176 19.6464C9.63576 19.1994 16.2498 15.1914 16.2498 12.0004C16.2498 8.81043 9.63676 4.80143 8.88176 4.35443C8.52676 4.14343 8.06476 4.26143 7.85476 4.61843C7.64375 4.97543 7.76176 5.43543 8.11776 5.64643C10.6818 7.16543 14.7498 10.2334 14.7498 12.0004C14.7498 13.7704 10.6818 16.8374 8.11776 18.3544C7.76176 18.5654 7.64375 19.0254 7.85476 19.3824C7.99476 19.6184 8.24376 19.7504 8.50076 19.7504Z" fill="black"/>
          </svg>
        </div>
      </div>
    `;
  }

  getLargeLoader = () => {
    return /*html*/`
      <div id="loader-wrapper" class="loader-wrapper">
        <div id="large-loader" class="loader large"></div>
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
          gap: 0;
          width: 100%;
        }

        #loader-wrapper.loader-wrapper {
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          gap: 0;
          width: 100%;
          min-height: 250px;
        }

        #large-loader.loader {
          margin: 0;
          align-self: center;
          justify-self: center;
          width: 80px;
          aspect-ratio: 4;
          --c:var(--accent-color) 90%,#0000;
          --c1:var(--accent-alt)  90%,#0000;
          --c2:var(--alt-color)  90%,#0000;
          background: 
            radial-gradient(circle closest-side at left  10px top 50%,var(--c)),
            radial-gradient(circle closest-side                     ,var(--c1)),
            radial-gradient(circle closest-side at right 10px top 50%,var(--c2));
          background-size: 100% 100%;
          background-repeat: no-repeat;
          animation: l5 1s infinite alternate;
        }

        @keyframes l5 {
          to { width: 20px; aspect-ratio: 1}
        }

        .content {
          padding: 10px 0 0;
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 100%;
        }

        .head {
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        .head > h3.title {
          display: flex;
          align-items: center;
          font-family: var(--font-text), sans-serif;
          color: var(--title-color);
          font-size: 1.35rem;
          font-weight: 500;
          line-height: 1.5;
          margin: 0;
          padding: 0 0;
        }

        .head > .desc {
          margin: 0;
          padding: 0;
          line-height: 1.3;
          color: var(--text-color);
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
        }

        .head > .desc * {
          margin: 0;
          padding: 0;
          line-height: inherit;
        }

        .head > .desc > p {
          margin: 5px 0 7px;
          padding: 0;
          line-height: 1.3;
          color: var(--text-color);
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
        }

        form.search {
          padding: 10px 0 0;
          background: var(--background);
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 15px;
          width: 100%;
        }

        form.search > .content {
          display: flex;
          flex-flow: column;
          gap: 5px;
          width: 100%;
          padding: 0;
        }

        form.search > .content > label {
          font-size: 1rem;
          font-family: var(--font-text), sans-serif;
          color: var(--text-color);
          margin: 0;
          padding: 0;
        }

        form.search > .content > select {
          padding: 8px 10px;
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          border: var(--input-border);
          background: var(--background);
          width: 100%;
          outline: none;
          border-radius: 10px;
        }

        form.search > .content > select:focus {
          border: var(--input-border-focus);
        }

        form.search > .content > select > option {
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
        }

        .stations {
          padding: 20px 0 5px;
          display: column;
          gap: 10px;
        }

        .station {
          padding: 10px 0;
          width: 100%;
          border-top: var(--border);
          display: flex;
          flex-flow: column;
          gap: 0;
          align-items: start;
          justify-content: flex-start;
        }

        .station > .input {
          display: flex;
          flex-flow: row;
          gap: 5px;
          padding: 0 0 5px;
          align-items: center;
          justify-content: center;
        }

        .station > .input > span.hex {
          padding: 0;
          font-size: 1rem;
          font-family: var(--font-mono), monospace;
          color: var(--gray-color);
          font-weight: 500;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        /* if the radio button is checked */
        .station > .input > input[type="radio"]:checked + span.hex {
          color: var(--accent-color);
        }

        .station > .input > input[type="radio"] {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: -1px 0 0 0;
          width: 15px;
          height: 15px;
          border: var(--action-border);
          accent-color: var(--accent-color);
        }

        .station > label {
          padding: 0;
          display: flex;
          flex-flow: column;
          width: 100%;
          gap: 5px;
          align-items: flex-start;
          justify-content: flex-start;
          border-radius: 0;
          cursor: pointer;
          transition: 0.3s;
        }

        .station > input[type="radio"]:checked + label {
          background: var(--tab-background);
          color: var(--white-color);
        }

        .station > label > h4.name {
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
          color: var(--title-color);
          font-weight: 500;
          font-size: 1.1rem;
          margin: 0;
          padding: 0;
        }

        .station > label > p.address {
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          font-weight: 500;
          margin: 0;
          padding: 0;
        }

        .station > label > p.desc {
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          margin: 0;
          padding: 0;
          line-height: 1.3;
        }

        .station > label > .fees {
          width: 100%;
          display: flex;
          flex-flow: row;
          gap: 20px;
          align-items: center;
          justify-content: flex-start;
          padding: 10px 0 0;
        }

        .station > label > .fees > span.fee {
          display: flex;
          flex-flow: column;
          gap: 0;
          height: 90px;
          width: calc(50% - 10px);
          align-items: flex-start;
          justify-content: flex-start;
          background: var(--gray-background);
          padding: 6px 10px;
          border-radius: 10px;
        }

        .station > label > .fees > span.fee > span.text {
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          font-weight: 500;
          margin: 0;
          padding: 0;
        }

        .station > label > .fees > span.fee.disabled > span.text {
          color: var(--gray-color);
        }

        .station > label > .fees > span.fee > span.desc {
          font-size: 0.9rem;
          font-family: var(--font-read), sans-serif;
          color: var(--text-color);
          margin: 0;
          padding: 0;
        }

        .station > label > .fees > span.fee > span.price {
          padding: 10px 0 0;
          display: flex;
          flex-flow: row;
          gap: 5px;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .station > label > .fees > span.fee > span.price > span.currency {
          font-size: 1.2rem;
          font-family: var(--font-main), sans-serif;
          color: var(--accent-color);
          font-weight: 800;
          margin: -2px 0 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .station > label > .fees > span.fee > span.price > span.amount {
          font-size: 1.35rem;
          font-family: var(--font-main), sans-serif;
          color: var(--accent-color);
          font-weight: 500;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .station > label > span.contact {
          width: 100%;
          padding: 10px 0 0;
          display: flex;
          flex-flow: row;
          gap: 20px;
          align-items: center;
          justify-content: flex-start;
        }

        .station > label > span.contact > button.chat,
        .station > label > span.contact > a.phone,
        .station > label > span.contact > a.email {
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          background: var(--background);
          border: var(--action-border);
          text-decoration: none;
          font-weight: 400;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 6px 15px;
          border-radius: 12px;
          transition: 0.3s;
        }

        .station > label > span.contact > button.chat:hover,
        .station > label > span.contact > a.phone:hover,
        .station > label > span.contact > a.email:hover {
          background: var(--accent-linear);
          color: var(--white-color);
        }

        .footer {
          border-top: var(--border);
          margin: 0 0 20px;
          width: 100%;
          padding: 20px 0 10px 0;
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          align-items: center;
          justify-self: end;
        }

        .footer > .action {
          display: flex;
          flex-flow: row;
          justify-content: center;
          align-items: center;
          gap: 5px;
          border-radius: 15px;
          font-family: var(--font-alt);
          line-height: 1.2;
          font-size: 1.1rem;
          font-weight: 500;
          width: 130px;
          color: var(--text-color);
          cursor: pointer;
        }

        .footer > .action.prev {
          padding: 8px 20px 8px 15px;
          background: var(--background);
          border: var(--border);
        }

        .footer > .action.prev svg path {
          fill: var(--text-color);
        }

        .footer > .action.next {
          padding: 8px 18px 8px 23px;
          color: var(--anchor-color);
          background: var(--background);
          border: var(--action-border);
        }

        .footer > .action.next svg path {
          fill: var(--anchor-color);
        }

        .footer > .action.disabled {
          background: var(--gray-background);
          pointer-events: none;
          user-select: none;
          opacity: .7;
        }

				@media screen and (max-width:660px) {
					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

          /* reset the cursor: pointer */
					a ,
          button,
          ul.tabs > li.tab,
          .pagination > button,
          .station > label,
          .station > label > span.contact > button.chat,
          .station > label > span.contact > a.phone,
          .station > label > span.contact > a.email {
						cursor: default !important;
          }
				}
	    </style>
    `;
  }
}