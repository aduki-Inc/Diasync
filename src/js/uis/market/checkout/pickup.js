export default class PickupContainer extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.active_tab = null;
    this.countiesData = {
      "Baringo": ["Baringo Central", "Baringo North", "Baringo South", "Eldama Ravine", "Mogotio", "Tiaty"],
      "Bomet": ["Bomet Central", "Bomet East", "Chepalungu", "Sotik"],
      "Bungoma": ["Bumula", "Bungoma East", "Bungoma North", "Bungoma South", "Bungoma West", "Cheptais", "Kanduyi", "Kimilili", "Mount Elgon", "Sirisia", "Tongaren"],
      "Busia": ["Budalang'i", "Bunyala", "Butula", "Nambale", "Samia"],
      "Elgeyo-Marakwet": ["Keiyo North", "Keiyo South", "Marakwet East", "Marakwet West"],
      "Embu": ["Manyatta", "Mbeere North", "Mbeere South", "Runyenjes"],
      "Garissa": ["Balambala", "Dadaab", "Fafi", "Garissa Township", "Hulugho", "Ijara"],
      "Homa Bay": ["Homa Bay Town", "Kasipul", "Kabondo Kasipul", "Karachuonyo", "Ndhiwa", "Rangwe", "Suba"],
      "Isiolo": ["Isiolo North", "Isiolo South"],
      "Kajiado": ["Kajiado Central", "Kajiado East", "Kajiado North", "Kajiado West"],
      "Kakamega": ["Butere", "Kakamega Central", "Kakamega East", "Kakamega North", "Kakamega South", "Lugari", "Malava", "Matungu", "Mumias East", "Mumias West"],
      "Kericho": ["Ainamoi", "Belgut", "Bureti", "Kipkelion East", "Kipkelion West"],
      "Kiambu": ["Gatundu North", "Gatundu South", "Juja", "Kabete", "Kiambaa", "Kiambu Town", "Kikuyu", "Lari", "Limuru", "Ruiru", "Thika"],
      "Kilifi": ["Ganze", "Kaloleni", "Kilifi North", "Kilifi South", "Magarini", "Malindi", "Rabai"],
      "Kirinyaga": ["Gichugu", "Kirinyaga Central", "Kirinyaga East", "Kirinyaga West", "Mwea"],
      "Kisii": ["Bobasi", "Bomachoge Borabu", "Bonchari", "Kitutu Chache North", "Kitutu Chache South", "Nyamache", "South Mugirango"],
      "Kisumu": ["Kisumu Central", "Kisumu East", "Kisumu West", "Seme", "Nyando", "Muhoroni", "Nyakach"],
      "Kitui": ["Kitui Central", "Kitui East", "Kitui Rural", "Kitui South", "Kitui West", "Mwingi Central", "Mwingi North", "Mwingi West"],
      "Kwale": ["Kinango", "Lunga Lunga", "Matuga"],
      "Laikipia": ["Laikipia East", "Laikipia North", "Laikipia West"],
      "Lamu": ["Lamu East", "Lamu West"],
      "Machakos": ["Athi River", "Kangundo", "Kathiani", "Machakos", "Masinga", "Matungulu", "Mavoko", "Mwala", "Yatta"],
      "Makueni": ["Kaiti", "Kibwezi East", "Kibwezi West", "Kilome", "Makueni", "Mbooni"],
      "Mandera": ["Banisa", "Lafey", "Mandera East", "Mandera North", "Mandera South", "Mandera West"],
      "Marsabit": ["Laisamis", "Marsabit Central", "Moyale", "North Horr", "Saku"],
      "Meru": ["Buuri", "Igembe Central", "Igembe North", "Igembe South", "Imenti Central", "Imenti North", "Imenti South", "Meru Central", "Meru South", "Tharaka"],
      "Migori": ["Kuria East", "Kuria West", "Migori", "Nyatike", "Rongo", "Suna East", "Suna West"],
      "Mombasa": ["Changamwe", "Jomvu", "Kisauni", "Likoni", "Mvita", "Nyali"],
      "Murang'a": ["Gatanga", "Kahuro", "Kandara", "Kangema", "Kigumo", "Kiharu", "Mathioya", "Murang'a South"],
      "Nairobi": ["Dagoretti", "Embakasi", "Kamukunji", "Kasarani", "Lang'ata", "Makadara", "Mathare", "Nairobi West"],
      "Nakuru": ["Gilgil", "Kuresoi North", "Kuresoi South", "Molo", "Naivasha", "Nakuru East", "Nakuru North", "Nakuru West", "Njoro", "Rongai", "Subukia"],
      "Nandi": ["Aldai", "Chesumei", "Emgwen", "Mosop", "Nandi Central", "Tinderet"],
      "Narok": ["Narok East", "Narok North", "Narok South", "Narok West", "Trans Mara East", "Trans Mara West"],
      "Nyamira": ["Borabu", "Manga", "Masaba North", "Masaba South", "Nyamira North", "Nyamira South"],
      "Nyandarua": ["Kipipiri", "Ndaragwa", "Ol Kalou"],
      "Nyeri": ["Kieni East", "Kieni West", "Mathira East", "Mathira West", "Mukurweini", "Nyeri South", "Tetu"],
      "Samburu": ["Samburu Central", "Samburu East", "Samburu North"],
      "Siaya": ["Alego Usonga", "Gem", "Rarieda", "Siaya", "Ugenya", "Ugunja"],
      "Taita-Taveta": ["Mwatate", "Taveta", "Voi"],
      "Tana River": ["Bura", "Garsen"],
      "Tharaka-Nithi": ["Chuka", "Igambang'ombe", "Maara", "Tharaka"],
      "Trans Nzoia": ["Cherang'any", "Endebess", "Kwanza", "Saboti", "Sirisia"],
      "Turkana": ["Loima", "Turkana Central", "Turkana East", "Turkana North", "Turkana South"],
      "Uasin Gishu": ["Ainabkoi", "Kapseret", "Kesses", "Moiben", "Soy", "Turbo"],
      "Vihiga": ["Emuhaya", "Hamisi", "Luanda", "Sabatia", "Vihiga"],
      "Wajir": ["Eldas", "Tarbaj", "Wajir East", "Wajir North", "Wajir South", "Wajir West"],
      "West Pokot": ["Kacheliba", "Pokot Central", "Pokot North", "Pokot South"],
    };

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // wire county -> town change after rendering
    const countySelect = this.shadowObj.querySelector('#county');
    const citySelect = this.shadowObj.querySelector('#city');
    if (countySelect && citySelect) {
      countySelect.addEventListener('change', e => {
        const county = e.target.value;
        this.populateTowns(county, citySelect);
      });
    }

    const stationsContainer = this.shadowObj.querySelector(".stations");
    if (stationsContainer) this.updateSelected(stationsContainer);
  }

  updateSelected = stationsContainer => {
    const stations = stationsContainer.querySelectorAll("input[type=radio]");

    // update background of selected station: on change to checked
    stations.forEach(s => {
      // removed other stations background unless it is checked
      s.closest(".station").style.background = s.checked ? "var(--selected-background)" : "var(--item-background)";

      // add event listener for change
      s.addEventListener('change', e => {
        const station = s.closest(".station");
        if (station) {
          // remove all other stations background
          stations.forEach(s => {
            if (s.closest(".station") !== station) {
              s.closest(".station").style.background = "var(--item-background)";
            }
          });

          station.style.background = e.target.checked ? "var(--selected-background)" : "var(--item-background)";
        }
      });
    });
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
        <div class="content county">
          <label for="county">County</label>
          <select name="county" id="county" class="county">
            <option value="" disabled selected>Select County</option>
            ${this.populateCounties(this.countiesData)}
          </select>
        </div>
        <div class="content city">
          <label for="city">Town / Sub-county</label>
          <select name="city" id="city" class="city">
            <option value="" disabled selected>Select Town</option>
          </select>
        </div>
      </form>
    `;
  }

  populateCounties = counties => {
    if (!counties) return "";

    let html = "";
    for (const county in counties) {
      html += /* html */`<option value="${county}">${county}</option>`;
    }

    return html;
  }

  populateTowns = (county, citySelect) => {
    const towns = this.countiesData[county] || [];
    let html = '<option value="" disabled selected>Select Town</option>';
    towns.forEach(t => {
      html += /* html */`<option value="${t}">${t}</option>`;
    });

    if (citySelect && citySelect.tagName) {
      citySelect.innerHTML = html;
    } else {
      const cityEl = this.shadowObj.querySelector('#city');
      if (cityEl) cityEl.innerHTML = html;
    }
  }

  getStations = () => {
    // radio buttons
    return /* html */ `
      <div class="stations">
        <div class="station">
          <div class="input">
            <input type="radio" name="station" id="station-1" value="station-1" checked>
            <span class="name">Nairobi Central Station</span>
          </div>
          <label for="station-1">
            <p class="address">45 Kimathi Street, Nairobi, Kenya</p>
            <p class="desc">Located in the heart of Nairobi, this station offers easy access to all major transport lines.</p>
            ${this.getShiping(1.42)}
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
            <span class="name">Cape Town Pickup Point</span>
          </div>
          <label for="station-2">
            <p class="address">12 Bree Street, Cape Town, South Africa</p>
            <p class="desc">Perfect for tourists and locals, this station is conveniently located near the V&A Waterfront.</p>
            ${this.getShiping(7.25)}
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
            <span class="name">Accra Mall Station</span>
          </div>
          <label for="station-3">
            <p class="address">25 Liberation Road, Accra, Ghana</p>
            <p class="desc">Conveniently located next to the Accra Mall, offering plenty of parking and easy access.</p>
            ${this.getShiping(13.25)}
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
            <span class="name">Lagos Island Depot</span>
          </div>
          <label for="station-4">
            <p class="address">17 Marina Road, Lagos, Nigeria</p>
            <p class="desc">This station is central to Lagos Island, with great connectivity to commercial hubs.</p>
            ${this.getShiping(96.48)}
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
            <span class="name">Addis Ababa Central</span>
          </div>
          <label for="station-5">
            <p class="address">10 Churchill Avenue, Addis Ababa, Ethiopia</p>
            <p class="desc">Ideal for travelers, this station is just a stone’s throw from Meskel Square.</p>
            ${this.getShiping(456.48)}
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
            <span class="name">Dar es Salaam Hub</span>
          </div>
          <label for="station-6">
            <p class="address">8 Julius Nyerere Road, Dar es Salaam, Tanzania</p>
            <p class="desc">Strategically placed near the ferry terminal, this station is perfect for inter-city travel.</p>
            ${this.getShiping(56.48)}
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

  getShiping = price => {
    return /* html */`
      <div class="fees">
        <span class="fee local">
          <span class="price">
            <span class="currency">Ksh</span>
            <span class="amount">${this.number.balanceWithCommas(price)}</span>
          </span>
        </span>
      </div>
    `;
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
          gap: 10px;
          width: 100%;
        }

        .head {
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 0;
          width: 100%;
          border-bottom: var(--action-border);
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
          display: flex;
          flex-flow: column;
          gap: 10px;
        }

        .station {
          padding: 0;
          width: 100%;
          /* border-top: var(--border); */
          background: var(--item-background);
          display: flex;
          flex-flow: column;
          gap: 0;
          align-items: start;
          justify-content: flex-start;
        }

        .station > .input {
          display: flex;
          flex-flow: row;
          width: 100%;
          gap: 5px;
          padding: 10px 10px;
          align-items: center;
          border-bottom: var(--border);
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

        .station > .input > span.name {
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
          color: var(--title-color);
          font-weight: 500;
          font-size: 1.1rem;
          margin: 0;
          padding: 0;
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
          padding: 10px 10px;
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
          padding: 0;
        }

        .station > label > .fees > span.fee {
          display: flex;
          flex-flow: column;
          gap: 0;
          align-items: flex-start;
          justify-content: flex-start;
          padding: 10px 0;
        }

        .station > label > .fees > span.fee > span.text {
          font-size: 1.3rem;
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
          font-size: 1.35rem;
          font-family: var(--font-main), sans-serif;
          color: var(--accent-color);
          font-weight: 600;
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
          font-weight: 600;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .station > label > span.contact {
          width: 100%;
          padding: 0 0 10px;
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
          border: none;
          background: var(--gray-background);
          text-decoration: none;
          font-weight: 400;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 7px 15px;
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
          border-top: var(--action-border);
          margin: 0 0 20px;
          width: 100%;
          padding: 20px 0 10px 0;
          display: flex;
          flex-flow: row;
          gap: 50px;
          justify-content: flex-end;
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
          padding: 13px 20px 13px 15px;
          font-weight: 500;
          width: 230px;
          color: var(--text-color);
          cursor: pointer;
        }

        .footer > .action.prev {
          background: var(--gray-background);
          /* border: var(--border); */
        }

        .footer > .action.prev svg path {
          fill: var(--text-color);
        }

        .footer > .action.next {
          color: var(--white-color);
          background: var(--action-background);
          /* border: var(--action-border); */
        }

        .footer > .action.next svg path {
          fill: var(--white-color);
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