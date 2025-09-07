export default class Doctors extends HTMLElement {
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
      ${this.getDoctors()}
    `
  }

  getHeader = () => {
    const title = this.owner ? 'Specialists' : 'Specialists';
    return /* html */`
      <div class="head">
        <h3 class="title">${title}</h3>
      </div>
    `;
  }

  getDoctors = () => {
    return /* html */`
      <div class="doctors">
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/men/1.jpg" owner="${this.getAttribute('owner')}" kind="consultation" reviews="3289" average-review="4.7" name="John Kasima Okello" speciality="Pediatrician" rate="1800"></specialist-wrapper>
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/women/2.jpg" owner="${this.getAttribute('owner')}" kind="consultation" reviews="894" average-review="4.1" name="Wanjiru Mwangi" speciality="General Practitioner" rate="1200"></specialist-wrapper>
        <specialist-wrapper verified="false" image="https://randomuser.me/api/portraits/women/29.jpg" owner="${this.getAttribute('owner')}" kind="vaccination" reviews="1200" average-review="4.8" name="Amina Abdalla" speciality="Immunizations & Vaccination" rate="800"></specialist-wrapper>
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/men/30.jpg" owner="${this.getAttribute('owner')}" kind="medication" reviews="56" average-review="4.2" name="Josephat Otieno" speciality="Medication Review & Management" rate="1500"></specialist-wrapper>
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/women/31.jpg" owner="${this.getAttribute('owner')}" kind="delivery" reviews="79" average-review="3.9" name="Mercy Akinyi" speciality="Home Delivery Coordination" rate="700"></specialist-wrapper>
        <specialist-wrapper verified="false" image="https://randomuser.me/api/portraits/men/32.jpg" owner="${this.getAttribute('owner')}" kind="information" reviews="432" average-review="4.0" name="Peter Njoroge" speciality="Drug Information Specialist" rate="1400"></specialist-wrapper>
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/women/33.jpg" owner="${this.getAttribute('owner')}" kind="emergency" reviews="100" average-review="4.5" name="Grace Wanjiku" speciality="Emergency Medicine" rate="2500"></specialist-wrapper>
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/men/17.jpg" owner="${this.getAttribute('owner')}" kind="insurance" reviews="6" average-review="5.0" name="James Kamau" speciality="Insurance Verification" rate="900"></specialist-wrapper>
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/men/71.jpg" owner="${this.getAttribute('owner')}" kind="telehealth" reviews="200" average-review="4.9" name="Fatuma Hassan" speciality="Telehealth Consultation" rate="1600"></specialist-wrapper>
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/women/37.jpg" owner="${this.getAttribute('owner')}" kind="consultation" reviews="678" average-review="4.6" name="Samuel Ochieng" speciality="Prescription Consultation" rate="1300"></specialist-wrapper>
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/men/38.jpg" owner="${this.getAttribute('owner')}" kind="screening" reviews="894" average-review="3.7" name="Esther Nduta" speciality="Health Screening" rate="750"></specialist-wrapper>
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/men/9.jpg" owner="${this.getAttribute('owner')}" kind="vaccination" reviews="120" average-review="4.2" name="Daniel Mburu" speciality="Vaccination & Travel Health" rate="850"></specialist-wrapper>
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/men/50.jpg" owner="${this.getAttribute('owner')}" kind="medication" reviews="34" average-review="4.0" name="Esther Wamae" speciality="Chronic Care & Medication" rate="1700"></specialist-wrapper>
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/women/61.jpg" owner="${this.getAttribute('owner')}" kind="delivery" reviews="79" average-review="3.5" name="Peter Ouma" speciality="Logistics & Delivery" rate="650"></specialist-wrapper>
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/men/12.jpg" owner="${this.getAttribute('owner')}" kind="information" reviews="432" average-review="4.0" name="Esther Njeri" speciality="Pharmacology & Drug Info" rate="1500"></specialist-wrapper>
        <specialist-wrapper verified="false" image="https://randomuser.me/api/portraits/men/13.jpg" owner="${this.getAttribute('owner')}" kind="emergency" reviews="100" average-review="4.5" name="Paul Kimani" speciality="Urgent Care" rate="2400"></specialist-wrapper>
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/women/14.jpg" owner="${this.getAttribute('owner')}" kind="insurance" reviews="6" average-review="5.0" name="Susan Wairimu" speciality="Prior Authorization" rate="950"></specialist-wrapper>
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/men/15.jpg" owner="${this.getAttribute('owner')}" kind="telehealth" reviews="200" average-review="4.9" name="Kevin Mutiso" speciality="Virtual Consultations" rate="1100"></specialist-wrapper>
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/men/41.jpg" owner="${this.getAttribute('owner')}" kind="consultation" reviews="48" average-review="4.1" name="Moses Kilonzo" speciality="Orthopedics" rate="2000"></specialist-wrapper>
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/women/42.jpg" owner="${this.getAttribute('owner')}" kind="consultation" reviews="72" average-review="4.3" name="Lydia Mwende" speciality="Obstetrics & Gynecology" rate="2200"></specialist-wrapper>
        <specialist-wrapper verified="false" image="https://randomuser.me/api/portraits/men/43.jpg" owner="${this.getAttribute('owner')}" kind="screening" reviews="33" average-review="3.9" name="Nicholas Ouma" speciality="Cardiac Screening" rate="1400"></specialist-wrapper>
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/women/44.jpg" owner="${this.getAttribute('owner')}" kind="medication" reviews="56" average-review="4.0" name="Ruth Atieno" speciality="Chronic Disease Management" rate="1600"></specialist-wrapper>
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/men/45.jpg" owner="${this.getAttribute('owner')}" kind="information" reviews="12" average-review="4.5" name="Abdul Karim" speciality="Clinical Pharmacology" rate="1800"></specialist-wrapper>
        <specialist-wrapper verified="true" image="https://randomuser.me/api/portraits/women/46.jpg" owner="${this.getAttribute('owner')}" kind="emergency" reviews="90" average-review="4.6" name="Nduta Chepchumba" speciality="Trauma & Emergency Care" rate="2600"></specialist-wrapper>
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

        div.doctors {
          padding: 15px 0;
          max-width: 100%;
          display: block;
          columns: 300px auto;
          column-gap: 10px;
          row-gap: 20px;
          margin: 0;
        }

        div.doctors > * {
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