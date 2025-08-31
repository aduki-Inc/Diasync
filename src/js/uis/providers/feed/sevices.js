export default class Services extends HTMLElement {
  constructor() {
    super();

    // lets create our shadow root
    this.shadowObj = this.attachShadow({ mode: 'open' });
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.selected = true;
    this.activeSection = 'products';
    this.mql = window.matchMedia("(max-width: 700px)");
    this.owner = this.getAttribute('owner') === 'true';
    this.render();
  }

  render = () => this.shadowObj.innerHTML = this.getTemplate();

  connectedCallback() {
    // add event
  }

  disconnectedCallback() {
    // remove event
  }

  getTemplate() {
    return /* html */`
      ${this.getBody()}
      ${this.getStyles()}
    `
  }

  getBody = () => {
    return /* html */`
      ${this.getHeader()}
      ${this.getServices()}
    `
  }

  getHeader = () => {
    const title = this.owner ? 'Your Services' : 'Provider Services';
    return /* html */`
      <div class="head">
        <h3 class="title">${title}</h3>
      </div>
    `
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
      </div>
    `;
  }

  getStyles() {
    return /* css */`
      <style>
        * {
          box-sizing: border-box !important;
        }

        :host {
          padding: 0;
          padding: 5px 0 0 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        div.head {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        div.head > h3.title {
          display: flex;
          align-items: center;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          font-size: 1.2rem;
          font-weight: 600;
          line-height: 1;
          margin: 0;
          padding: 0;
        }

        /* Tabs Styles */
        ul.tabs {
          list-style: none;
          display: flex;
          flex-flow: row nowrap;
          gap: 8px;
          padding: 0;
          position: relative;
          overflow-x: scroll;
          scrollbar-width: none;
          padding: 8px 10px;
          margin: 18px 0 0;
          border-radius: 10px;
          background: var(--tabs-background);
        }

        ul.tabs::-webkit-scrollbar {
          visibility: hidden;
          display: none;
        }

        ul.tabs > li.tab {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          gap: 8px;
          padding: 5px 10px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.3;
          white-space: nowrap;
          border-radius: 8px;
          transition: color 0.3s ease-in-out;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          -moz-backface-visibility: hidden;
          -ms-backface-visibility: hidden;
          position: relative;
        }

        ul.tabs > li.tab > span.icon {
          display: flex;
          justify-content: center;
          align-items: center;
          color: inherit;
        }

        ul.tabs > li.tab > span.icon > svg {
          width: 20px;
          height: 20px;
          color: inherit;
          transition: color 0.3s ease-in-out;
        }

        ul.tabs > li.tab.reviews > span.icon > svg {
          width: 18px;
          height: 18px;
        }

        ul.tabs > li.tab.services > span.icon > svg {
          width: 19px;
          height: 19px;
        }

        ul.tabs > li.tab.active,
        ul.tabs > li.tab:hover {
          color: var(--accent-color);
          background: var(--gray-background);
          font-weight: 600;
        }

        ul.tabs > li.tab:hover {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: background 0.3s ease-in-out;
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

        div.no-bookings {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.4;
          margin: 15px 0;
          padding: 20px;
          width: 100%;
          text-align: center;
          border: var(--border);
          border-radius: 12px;
          background: var(--unselctable-background);
        }

        div.month-separator {
          display: flex;
          align-items: center;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          font-size: 1.2rem;
          font-weight: 500;
          line-height: 1;
          margin: 0;
          padding: 0;
        }
      </style>
    `
  }
}