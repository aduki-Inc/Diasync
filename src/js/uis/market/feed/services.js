export default class Services extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.utils = window.app.utils;

    this.render();
    // active tab
    this.active_tab = null;
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
        <div class="sticky">
          ${this.getSearch()}
          ${this.getTab()}
        </div>
        ${this.getServices()}
        ${this.getPagination({ current: 13, total: 24 })}
      </div>
    `;
  }

  getHead = () => {
    return /* html */`
      <div class="head">
        <h3 class="title">${this.getAttribute("name")}</h3>
        <div class="desc">
          ${this.innerHTML}
        </div>
      </div>
    `;
  }

  getTab = () => {
    return /* html */`
      <ul class="tabs">
        <li class="tab">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M12.5 3H11.5C7.02166 3 4.78249 3 3.39124 4.39124C2 5.78249 2 8.02166 2 12.5C2 16.9783 2 19.2175 3.39124 20.6088C4.78249 22 7.02166 22 11.5 22C15.9783 22 18.2175 22 19.6088 20.6088C21 19.2175 21 16.9783 21 12.5V11.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M22 5.5C22 7.433 20.433 9 18.5 9C16.567 9 15 7.433 15 5.5C15 3.567 16.567 2 18.5 2C20.433 2 22 3.567 22 5.5Z" stroke="currentColor" stroke-width="1.8" />
            <path d="M7 11H11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7 16H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">All</span>
        </li>
        <li class="tab active">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M3.06164 15.1933L3.42688 13.1219C3.85856 10.6736 4.0744 9.44952 4.92914 8.72476C5.78389 8 7.01171 8 9.46734 8H14.5327C16.9883 8 18.2161 8 19.0709 8.72476C19.9256 9.44952 20.1414 10.6736 20.5731 13.1219L20.9384 15.1933C21.5357 18.5811 21.8344 20.275 20.9147 21.3875C19.995 22.5 18.2959 22.5 14.8979 22.5H9.1021C5.70406 22.5 4.00504 22.5 3.08533 21.3875C2.16562 20.275 2.4643 18.5811 3.06164 15.1933Z" stroke="currentColor" stroke-width="1.5" />
            <path d="M7.5 8L7.66782 5.98618C7.85558 3.73306 9.73907 2 12 2C14.2609 2 16.1444 3.73306 16.3322 5.98618L16.5 8" stroke="currentColor" stroke-width="1.5" />
            <path d="M15 11C14.87 12.4131 13.5657 13.5 12 13.5C10.4343 13.5 9.13002 12.4131 9 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <span class="text">What's New</span>
        </li>
        <li class="tab">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M7.69171 19.6161C8.28274 19.6161 8.57825 19.6161 8.84747 19.716C8.88486 19.7298 8.92172 19.7451 8.95797 19.7617C9.21897 19.8815 9.42793 20.0904 9.84585 20.5083C10.8078 21.4702 11.2887 21.9512 11.8805 21.9955C11.96 22.0015 12.04 22.0015 12.1195 21.9955C12.7113 21.9512 13.1923 21.4702 14.1541 20.5083C14.5721 20.0904 14.781 19.8815 15.042 19.7617C15.0783 19.7451 15.1151 19.7298 15.1525 19.716C15.4218 19.6161 15.7173 19.6161 16.3083 19.6161H16.4173C17.9252 19.6161 18.6792 19.6161 19.1476 19.1476C19.6161 18.6792 19.6161 17.9252 19.6161 16.4173V16.3083C19.6161 15.7173 19.6161 15.4218 19.716 15.1525C19.7298 15.1151 19.7451 15.0783 19.7617 15.042C19.8815 14.781 20.0904 14.5721 20.5083 14.1541C21.4702 13.1923 21.9512 12.7113 21.9955 12.1195C22.0015 12.04 22.0015 11.96 21.9955 11.8805C21.9512 11.2887 21.4702 10.8078 20.5083 9.84585C20.0904 9.42793 19.8815 9.21897 19.7617 8.95797C19.7451 8.92172 19.7298 8.88486 19.716 8.84747C19.6161 8.57825 19.6161 8.28274 19.6161 7.69171V7.58269C19.6161 6.07479 19.6161 5.32083 19.1476 4.85239C18.6792 4.38394 17.9252 4.38394 16.4173 4.38394H16.3083C15.7173 4.38394 15.4218 4.38394 15.1525 4.28405C15.1151 4.27018 15.0783 4.25491 15.042 4.23828C14.781 4.11855 14.5721 3.90959 14.1541 3.49167C13.1923 2.52977 12.7113 2.04882 12.1195 2.00447C12.04 1.99851 11.96 1.99851 11.8805 2.00447C11.2887 2.04882 10.8078 2.52977 9.84585 3.49167C9.42793 3.90959 9.21897 4.11855 8.95797 4.23828C8.92172 4.25491 8.88486 4.27018 8.84747 4.28405C8.57825 4.38394 8.28274 4.38394 7.69171 4.38394H7.58269C6.07479 4.38394 5.32083 4.38394 4.85239 4.85239C4.38394 5.32083 4.38394 6.07479 4.38394 7.58269V7.69171C4.38394 8.28274 4.38394 8.57825 4.28405 8.84747C4.27018 8.88486 4.25491 8.92172 4.23828 8.95797C4.11855 9.21897 3.90959 9.42793 3.49167 9.84585C2.52977 10.8078 2.04882 11.2887 2.00447 11.8805C1.99851 11.96 1.99851 12.04 2.00447 12.1195C2.04882 12.7113 2.52977 13.1923 3.49167 14.1541C3.90959 14.5721 4.11855 14.781 4.23828 15.042C4.25491 15.0783 4.27018 15.1151 4.28405 15.1525C4.38394 15.4218 4.38394 15.7173 4.38394 16.3083V16.4173C4.38394 17.9252 4.38394 18.6792 4.85239 19.1476C5.32083 19.6161 6.07479 19.6161 7.58269 19.6161H7.69171Z" stroke="currentColor" stroke-width="1.5" />
            <path d="M15 9L9 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15 15H14.9892M9.01076 9H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">Offers</span>
        </li>
      </ul>
    `;
  }

  getSearch = () => {
    return /* html */`
      <form action="" method="get" class="search">
        <div class="contents">
          <input type="text" name="q" id="query" placeholder="Search for products..." />
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11.7666" cy="11.7667" r="8.98856" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"  stroke-linejoin="round" />
            <path d="M18.0183 18.4853L21.5423 22.0001" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <button type="submit">Search</button>
        </div>
      </form>
    `;
  }

  getServices = () => {
    return /* html */`
      <div class="services">
        <div is="service-wrapper" image="/src/img/products/drug27.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="consultation" reviews="32894" average-review="4.7" name="Prescription Consultation" description="Expert consultation with licensed pharmacists for medication guidance and drug interactions." price="0" last="0"></div>
        <div is="service-wrapper" image="/src/img/products/drug28.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="screening" reviews="894" average-review="3.7" name="Health Screening" description="Blood pressure monitoring, diabetes screening, and basic health assessments." price="25" last="13"></div>
        <div is="service-wrapper" image="/src/img/products/drug29.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="vaccination" reviews="1200" average-review="4.8" name="Vaccination Services" description="Flu shots, COVID-19 vaccines, and other immunizations administered by certified professionals." price="450" last="700"></div>
        <div is="service-wrapper" image="/src/img/products/drug30.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="medication" reviews="0" average-review="0" name="Medication Synchronization" description="Coordinate all your prescriptions to be ready on the same day for convenient pickup." price="4673" last="9678"></div>
        <div is="service-wrapper" image="/src/img/products/drug31.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="delivery" reviews="79" average-review="3.5" name="Home Delivery" description="Free prescription delivery service within 5-mile radius, same-day delivery available." price="236" last="138"></div>
        <div is="service-wrapper" image="/src/img/products/drug32.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="information" reviews="432" average-review="4.0" name="Drug Information" description="Comprehensive medication information, side effects, and drug interaction database access." price="3766" last="9670"></div>
        <div is="service-wrapper" image="/src/img/products/drug33.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="emergency" reviews="100" average-review="4.5" name="24/7 Emergency Support" description="Round-the-clock emergency prescription services and urgent medication needs." price="400" last="328"></div>
        <div is="service-wrapper" image="/src/img/products/drug34.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="insurance" reviews="6" average-review="5.0" name="Insurance Verification" description="Quick insurance verification and prior authorization assistance for prescriptions." price="0" last="0"></div>
        <div is="service-wrapper" image="/src/img/products/drug35.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="telehealth" reviews="200" average-review="4.9" name="Telehealth Consultation" description="Virtual consultations with healthcare professionals from the comfort of your home." price="3620" last="5050"></div>
        <div is="service-wrapper" image="/src/img/products/drug37.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="consultation" reviews="32894" average-review="4.7" name="Prescription Consultation" description="Expert consultation with licensed pharmacists for medication guidance and drug interactions." price="0" last="0"></div>
        <div is="service-wrapper" image="/src/img/products/drug38.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="screening" reviews="894" average-review="3.7" name="Health Screening" description="Blood pressure monitoring, diabetes screening, and basic health assessments." price="25" last="13"></div>
        <div is="service-wrapper" image="/src/img/products/drug39.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="vaccination" reviews="1200" average-review="4.8" name="Vaccination Services" description="Flu shots, COVID-19 vaccines, and other immunizations administered by certified professionals." price="4570" last="7000"></div>
        <div is="service-wrapper" image="/src/img/products/drug50.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="medication" reviews="0" average-review="0" name="Medication Synchronization" description="Coordinate all your prescriptions to be ready on the same day for convenient pickup." price="600" last="9678"></div>
        <div is="service-wrapper" image="/src/img/products/drug61.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="delivery" reviews="79" average-review="3.5" name="Home Delivery" description="Free prescription delivery service within 5-mile radius, same-day delivery available." price="2360" last="1380"></div>
        <div is="service-wrapper" image="/src/img/products/drug12.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="information" reviews="432" average-review="4.0" name="Drug Information" description="Comprehensive medication information, side effects, and drug interaction database access." price="0" last="0"></div>
        <div is="service-wrapper" image="/src/img/products/drug13.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="emergency" reviews="100" average-review="4.5" name="24/7 Emergency Support" description="Round-the-clock emergency prescription services and urgent medication needs." price="4000" last="3200"></div>
        <div is="service-wrapper" image="/src/img/products/drug14.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="insurance" reviews="6" average-review="5.0" name="Insurance Verification" description="Quick insurance verification and prior authorization assistance for prescriptions." price="0" last="0"></div>
        <div is="service-wrapper" image="/src/img/products/drug15.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="telehealth" reviews="200" average-review="4.9" name="Telehealth Consultation" description="Virtual consultations with healthcare professionals from the comfort of your home." price="300" last="500"></div>
        <div is="service-wrapper" image="/src/img/products/drug27.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="consultation" reviews="32894" average-review="4.7" name="Prescription Consultation" description="Expert consultation with licensed pharmacists for medication guidance and drug interactions." price="0" last="0"></div>
        <div is="service-wrapper" image="/src/img/products/drug28.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="screening" reviews="894" average-review="3.7" name="Health Screening" description="Blood pressure monitoring, diabetes screening, and basic health assessments." price="25" last="13"></div>
        <div is="service-wrapper" image="/src/img/products/drug29.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="vaccination" reviews="1200" average-review="4.8" name="Vaccination Services" description="Flu shots, COVID-19 vaccines, and other immunizations administered by certified professionals." price="450" last="700"></div>
        <div is="service-wrapper" image="/src/img/products/drug30.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="medication" reviews="0" average-review="0" name="Medication Synchronization" description="Coordinate all your prescriptions to be ready on the same day for convenient pickup." price="4673" last="9678"></div>
        <div is="service-wrapper" image="/src/img/products/drug31.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="delivery" reviews="79" average-review="3.5" name="Home Delivery" description="Free prescription delivery service within 5-mile radius, same-day delivery available." price="236" last="138"></div>
        <div is="service-wrapper" image="/src/img/products/drug32.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="information" reviews="432" average-review="4.0" name="Drug Information" description="Comprehensive medication information, side effects, and drug interaction database access." price="3766" last="9670"></div>
        <div is="service-wrapper" image="/src/img/products/drug33.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="emergency" reviews="100" average-review="4.5" name="24/7 Emergency Support" description="Round-the-clock emergency prescription services and urgent medication needs." price="400" last="328"></div>
        <div is="service-wrapper" image="/src/img/products/drug34.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="insurance" reviews="6" average-review="5.0" name="Insurance Verification" description="Quick insurance verification and prior authorization assistance for prescriptions." price="0" last="0"></div>
        <div is="service-wrapper" image="/src/img/products/drug35.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="telehealth" reviews="200" average-review="4.9" name="Telehealth Consultation" description="Virtual consultations with healthcare professionals from the comfort of your home." price="3620" last="5050"></div>
        <div is="service-wrapper" image="/src/img/products/drug37.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="consultation" reviews="32894" average-review="4.7" name="Prescription Consultation" description="Expert consultation with licensed pharmacists for medication guidance and drug interactions." price="0" last="0"></div>
        <div is="service-wrapper" image="/src/img/products/drug38.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="screening" reviews="894" average-review="3.7" name="Health Screening" description="Blood pressure monitoring, diabetes screening, and basic health assessments." price="25" last="13"></div>
        <div is="service-wrapper" image="/src/img/products/drug39.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="vaccination" reviews="1200" average-review="4.8" name="Vaccination Services" description="Flu shots, COVID-19 vaccines, and other immunizations administered by certified professionals." price="4570" last="7000"></div>
        <div is="service-wrapper" image="/src/img/products/drug50.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="medication" reviews="0" average-review="0" name="Medication Synchronization" description="Coordinate all your prescriptions to be ready on the same day for convenient pickup." price="600" last="9678"></div>
        <div is="service-wrapper" image="/src/img/products/drug61.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="delivery" reviews="79" average-review="3.5" name="Home Delivery" description="Free prescription delivery service within 5-mile radius, same-day delivery available." price="2360" last="1380"></div>
        <div is="service-wrapper" image="/src/img/products/drug12.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="information" reviews="432" average-review="4.0" name="Drug Information" description="Comprehensive medication information, side effects, and drug interaction database access." price="0" last="0"></div>
        <div is="service-wrapper" image="/src/img/products/drug13.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="emergency" reviews="100" average-review="4.5" name="24/7 Emergency Support" description="Round-the-clock emergency prescription services and urgent medication needs." price="4000" last="3200"></div>
        <div is="service-wrapper" image="/src/img/products/drug14.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="insurance" reviews="6" average-review="5.0" name="Insurance Verification" description="Quick insurance verification and prior authorization assistance for prescriptions." price="0" last="0"></div>
      </div>
    `;
  }

  getPagination = data => {
    const { current, total } = data;

    // if total is 1, return empty string
    if (total < 2) return "";

    const prev = this.createPrevNavigation(current);
    const currentPage = /*html*/`<button class="page current ${current > 99 ? "large" : ""}">${current}</button>`;
    const next = this.createNextNavigation(current, total);

    return /* html */`
      <div class="pagination">
        ${prev}
        ${currentPage}
        ${next}
      </div>
    `;
  }

  createPrevNavigation = current => {
    // if both current and total are not numbers, return empty string
    if (isNaN(current)) return "";

    /* if current page is 1, return empty string */
    if (current === 1) return "";

    /* if current page is less than 6, return 1 to 4 */
    if (current < 6) {
      let prev = "";
      for (let i = 1; i < current; i++) {
        prev += /* html */`<button class="page prev ${i > 99 ? "large" : ""}">${i}</button>`;
      }
      return /* html */`
        <div class="previous">
          ${prev}
        </div>
      `;
    }

    // anything greater than 6, return the last 3 pages and start page: 1
    if (current >= 6) {
      // loop to create the previous pages
      let prev = /* html */`<button class="page prev start">1</button>`;
      for (let i = current - 3; i < current; i++) {
        prev += /* html */`<button class="page prev ${i > 99 ? "large" : ""}">${i}</button>`;
      }

      return /* html */`
        <div class="previous">
          ${prev}
        </div>
      `;
    }
  }

  createNextNavigation = (current, total) => {
    // if both current and total are not numbers, return empty string
    if (isNaN(current) || isNaN(total)) return "";

    /* if current page is the last page, return empty string */
    if (current === total) return "";

    /* if current page is less than 6, and total is less than 6, return all pages */
    if (current < 6 && total < 6) {
      let next = "";
      for (let i = current + 1; i <= total; i++) {
        next += /* html */`<button class="page next ${i > 99 ? "large" : ""}">${i}</button>`;
      }

      // return the next pages
      return /* html */`
        <div class="nexts">
          ${next}
        </div>
      `;
    }

    /* if current page is less than 6, return after current: three after */
    if (current < 6 && (total - current) > 3) {
      let next = "";
      for (let i = current + 1; i <= current + 3; i++) {
        next += /* html */`<button class="page next ${i > 99 ? "large" : ""}">${i}</button>`;
      }

      // add last page
      next += /* html */`<button class="page next end ${total > 99 ? "large" : ""}">${total}</button>`;

      // return the next pages
      return /* html */`
        <div class="nexts">
          ${next}
        </div>
      `;
    }

    // if page is 6 or greater, and is less than the total by 3,2,1: return the last 3 pages
    if (current >= 6 && (total - current) <= 3) {
      let next = "";
      for (let i = current + 1; i <= total; i++) {
        next += /* html */`<button class="page next">${i}</button>`;
      }

      // return the next pages
      return /* html */`
        <div class="nexts">
          ${next}
        </div>
      `;
    }

    // if current page is 6 or greater, and is less the total by a value more than 3, return the next 3 pages and the last page
    if (current >= 6 && (total - current) > 3) {
      let next = "";
      for (let i = current + 1; i < current + 4; i++) {
        next += /* html */`<button class="page next ${i > 99 ? "large" : ""}">${i}</button>`;
      }

      // add the last page
      next += /* html */`<button class="page next end ${total > 99 ? "large" : ""}">${total}</button>`;

      // return the next pages
      return /* html */`
        <div class="nexts">
          ${next}
        </div>
      `;
    }
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
          padding: 20px 0 0;
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

        div.sticky {
          display: flex;
          flex-flow: column;
          gap: 5px;
          margin: 0;
          width: 100%;
          z-index: 2;
          position: sticky;
          top: 0px;
          padding: 10px 0 0 0;
          background: var(--background);
        }

        form.search {
          padding: 10px 0 0 0;
          background: var(--background);
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          width: 100%;
        }

        form.search > svg {
          position: absolute;
          left: -12px;
          top: calc(50% - 15px);
          color: var(--text-color);
          cursor: pointer;
          width: 40px;
          height: 40px;
        }

        form.search > svg:hover {
          color: var(--accent-color);
        }

        form.search > .contents {
          padding: 0;
          display: flex;
          flex-flow: row;
          align-items: center;
          flex-wrap: nowrap;
          gap: 0;
          margin: 0;
          width: 100%;
          position: relative;
        }

        form.search > .contents > input {
          border: var(--input-border);
          background-color: var(--background) !important;
          display: flex;
          flex-flow: row;
          align-items: center;
          font-family: var(--font-text),sans-serif;
          color: var(--text-color);
          font-size: 1rem;
          padding: 8px 10px 8px 35px;
          gap: 0;
          width: 100%;
          border-radius: 12px;
        }

        form.search > .contents > input:-webkit-autofill,
        form.search > .contents > input:-webkit-autofill:hover,
        form.search > .contents > input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px var(--background) inset;
          -webkit-text-fill-color: var(--text-color) !important;
          transition: background-color 5000s ease-in-out 0s;
          color: var(--text-color) !important;
        }

        form.search > .contents > input:-webkit-autofill {
          filter: none;
          color: var(--text-color) !important;
        }

        form.search > .contents > svg {
          position: absolute;
          height: 18px;
          color: var(--gray-color);
          width: 18px;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
        }

        form.search > .contents > button {
          position: absolute;
          right: 10px;
          top: calc(50% - 13px);
          border: none;
          cursor: pointer;
          color: var(--white-color);
          font-family: var(--font-text), sans-serif;
          background: var(--accent-linear);
          height: 26px;
          width: max-content;
          padding: 0 10px;
          font-size: 0.9rem;
          font-weight: 400;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          border-radius: 10px;
        }

        ul.tabs {
          border-bottom: var(--border);
          display: flex;
          flex-flow: row;
          gap: 15px;
          padding: 10px 0 10px;
          margin: 0;
          width: 100%;
          list-style: none;
          overflow-x: auto;
          overflow-y: hidden;
          white-space: nowrap;
          scrollbar-width: 0;
          -ms-overflow-style: none;
          z-index: 2;
          background: var(--background);
        }

        ul.tabs::-webkit-scrollbar {
          display: none;
          visibility: hidden;
        }

        ul.tabs > li.tab {
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 5px;
          padding: 5px 0;
          border-radius: 12px;
          /*background: var(--gray-background);*/
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: 0.3s;
        }

        ul.tabs > li.tab > span.count,
        ul.tabs > li.tab > svg {
          display: none;
        }

        ul.tabs > li.tab.active {
          background: var(--tab-background);
          padding: 5px 10px;
          color: var(--text-color);
        }

        ul.tabs > li.tab.active > span.count,
        ul.tabs > li.tab.active > svg,
        ul.tabs > li.tab:not(.active):hover > span.count,
        ul.tabs > li.tab:not(.active):hover > svg {
          display: flex;
        }

        /* style hover tab: but don't touch tab with active class */
        ul.tabs > li.tab:not(.active):hover {
          background: var(--tab-background);
          padding: 5px 10px;
          color: var(--text-color);
        }

        ul.tabs > li.tab > svg {
          width: 19px;
          height: 19px;
        }

        ul.tabs > li.tab > .text {
          font-size: 1rem;
          padding: 0 5px 0 0;
          font-weight: 500;
        }

        ul.tabs > li.tab > .count {
          font-size: 0.85rem;
          display: none;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-weight: 500;
          background: var(--accent-linear);
          font-family: var(--font-text), sans-serif;
          color: var(--white-color);
          padding: 1px 7px 2px;
          border-radius: 10px;
        }

        .services {
          padding: 15px 0;
          max-width: 100%;
          display: block;
          columns: 300px auto;
          column-gap: 10px;
          row-gap: 20px;
          margin: 0;
        }

        .services > * {
          break-inside: avoid;
          margin-bottom: 10px;
          display: block;
        }

        .pagination {
          z-index: 0;
          display: flex;
          flex-flow: row;
          gap: 10px;
          justify-content: center;
          padding: 15px 0 20px;
          margin: 0;
          width: 100%;
        }

        .pagination > .previous {
          display: flex;
          flex-flow: row;
          gap: 5px;
          align-items: center;
        }

        .pagination > .nexts {
          display: flex;
          flex-flow: row;
          gap: 5px;
          align-items: center;
        }

        .pagination button {
          font-size: 0.9rem;
          outline: none;
          border: none;
          background: none;
          font-family: var(--font-text), sans-serif;
        }

        .pagination > button.current,
        .pagination > .nexts > .page,
        .pagination > .previous > .page {
          padding: 0;
          height: 30px;
          width: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50px;
          color: var(--text-color);
          border: var(--action-border);
          cursor: pointer;
          transition: 0.3s;
        }

        .pagination > .nexts > button.large,
        .pagination > .previous > button.large,
        .pagination > button.large {
          padding: 0;
          height: 30px;
          width: max-content;
          padding: 0 10px;
        }

        .pagination > button.current {
          color: var(--white-color);
          background: var(--accent-linear);
          cursor: default;
        }

        .pagination > .previous > .prev:hover,
        .pagination > .nexts > .next:hover {
          background: var(--tab-background);
          border: none;
        }

        .pagination > .previous > .start {
          margin-right: 10px;
          border: none;
          background: var(--tab-background);
        }

        .pagination > .nexts > .end {
          margin-left: 10px;
          border: none;
          background: var(--tab-background);
        }

        .pagination > .previous > .page.current,
        .pagination > .nexts > .page.current {
          background: var(--accent-linear);
          color: var(--white-color);
        }

				@media screen and (max-width:660px) {
					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

					a ,
          button,
          ul.tabs > li.tab {
						cursor: default !important;
          }

          div.sticky {
            position: sticky;
            top: 0;
          }

          ul.tabs {
            padding: 10px 0;
          }

          .products {
            padding: 20px 0;
            column-gap: 10px;
            row-gap: 10px;
          }

          .pagination {
            padding: 5px 0 25px;
          }
				}
	    </style>
    `;
  }
}