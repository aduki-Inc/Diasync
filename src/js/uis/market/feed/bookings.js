export default class Bookings extends HTMLElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.app = window.app;
    this.mql = window.matchMedia("(max-width: 700px)");
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

    this.setHeader(this.mql);
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

  setHeader = mql => {
    if (mql.matches) {
      this.app.setHeader({
        sectionTitle: 'Bookings',
        description: 'Your bookings',
      });
    }
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
        ${this.getHead(this.mql)}
        <div class="sticky">
          ${this.getTabs(this.mql)}
        </div>
        ${this.getBookings()}
      </div>
    `;
  }

  getHead = mql => {
    if(mql && mql.matches) return '';
    return /* html */`
      <div class="head">
        <h3 class="title">${this.getAttribute("name")}</h3>
        <div class="desc">Your boookings</div>
      </div>
    `;
  }

  getTabs = mql => {
    if(mql && mql.matches) {
      return /* html */`
        <ul class="tabs">
          <li class="tab upcoming active">Upcoming</li>
          <li class="tab pending">Pending</li>
          <li class="tab cancelled">Cancelled</li>
          <li class="tab past">Past</li>
        </ul>
      `;
    } else {
      return /* html */`
        <ul class="tabs">
          <li class="tab all active">All</li>
          <li class="tab upcoming">Upcoming</li>
          <li class="tab pending">Pending</li>
          <li class="tab cancelled">Cancelled</li>
          <li class="tab past">Past</li>
          <li class="tab recurring">Recurring</li>
          <li class="tab rescheduled">Rescheduled</li>
        </ul>
      `
    }
  }

  getBookings = () => {
    return /* html */`
      <div class="bookings">
        <div is="booking-wrapper" date="2025-08-15 09:30:00+00:00" from="2025-08-15 09:30:00+00:00" to="2025-08-15 10:30:00+00:00" location="Kenyatta National Hospital, Nairobi" status="confirmed" specialist-name="Dr. Alice Mwangi" kind="consultation" reviews="32894" average-review="4.7" name="Prescription Review & Dosage" images="https://i.pravatar.cc/200?img=12,https://i.pravatar.cc/200?img=2,https://i.pravatar.cc/200?img=40" price="6350" last="0"></div>
        <div is="booking-wrapper" date="2025-08-17 09:45:00+00:00" from="2025-08-17 09:45:00+00:00" to="2025-08-17 12:58:00+00:00" location="Karen Hospital, Nairobi" status="pending" specialist-name="Dr. John Kamau" kind="screening" reviews="894" average-review="3.7" name="BP & Diabetes Screening" images="https://i.pravatar.cc/200?img=13,https://i.pravatar.cc/200?img=9" price="3725" last="13"></div>
        <div is="booking-wrapper" date="2025-08-20 10:30:00+00:00" from="2025-08-20 10:30:00+00:00" to="2025-08-20 12:40:00+00:00" location="Chiromo Medical Centre, Nairobi" status="confirmed" specialist-name="Nurse Grace Otieno" kind="vaccination" reviews="1200" average-review="4.8" name="Immunization and Health Check" price="4560" last="70"></div>
        <div is="booking-wrapper" date="2025-08-31 11:10:00+00:00" from="2025-08-31 11:10:00+00:00" to="2025-08-31 13:10:00+00:00" location="MP Shah Hospital, Nairobi" status="cancelled" specialist-name="Pharmacist Peter Njoroge" kind="medication" reviews="0" average-review="0" name="Body screening and health check" images="https://i.pravatar.cc/200?img=23,https://i.pravatar.cc/200?img=26,https://i.pravatar.cc/200?img=29" price="0" last="60"></div>
        <div class="month-separator">Sep, 2025</div>
        <div is="booking-wrapper" date="2025-09-04 09:30:00+00:00" from="2025-09-04 09:30:00+00:00" to="2025-09-04 12:48:00+00:00" location="Nairobi West Hospital" status="confirmed" specialist-name="Delivery Team" kind="delivery" reviews="79" average-review="3.5" name="Prescription Inquiry and Delivery" images="https://i.pravatar.cc/200?img=25,https://i.pravatar.cc/200?img=19,https://i.pravatar.cc/200?img=22,https://i.pravatar.cc/200?img=17" price="78236" last="138"></div>
        <div is="booking-wrapper" date="2025-09-04 10:30:00+00:00" from="2025-09-04 10:30:00+00:00" to="2025-09-04 11:30:00+00:00" location="Teams (Online)" status="confirmed" specialist-name="Dr. Fatuma Hassan" kind="information" reviews="432" average-review="4.0" name="Drug Info Session" images="https://i.pravatar.cc/200?img=8,https://i.pravatar.cc/200?img=16,https://i.pravatar.cc/200?img=36" price="0" last="0"></div>
        <div is="booking-wrapper" date="2025-09-15 11:30:00+00:00" from="2025-09-15 11:30:00+00:00" to="2025-09-15 13:02:00+00:00" location="Kenyatta National Hospital, Nairobi" status="confirmed" specialist-name="Emergency Team" kind="emergency" reviews="100" average-review="4.5" name="Emergency Support" price="4056" last="32"></div>
        <div is="booking-wrapper" date="2025-09-18 12:30:00+00:00" from="2025-09-18 12:30:00+00:00" to="2025-09-18 13:30:00+00:00" location="Nairobi Hospital" status="confirmed" specialist-name="Clara Wanjiru" kind="insurance" reviews="6" average-review="5.0" name="Insurance Check" images="https://i.pravatar.cc/200?img=45,https://i.pravatar.cc/200?img=25,https://i.pravatar.cc/200?img=15" price="0" last="0"></div>
        <div is="booking-wrapper" date="2025-09-18 13:30:00+00:00" from="2025-09-18 13:30:00+00:00" to="2025-09-18 15:20:00+00:00" location="Teams (Online)" status="confirmed" specialist-name="Dr. Samuel Otieno" kind="telehealth" reviews="200" average-review="4.9" name="Telehealth Consult" images="https://i.pravatar.cc/200?img=43,https://i.pravatar.cc/200?img=46" price="3760" last="50"></div>
        <div class="month-separator">Oct, 2025</div>

        <!-- October bookings (10 entries) -->
        <div is="booking-wrapper" date="2025-10-03 10:30:00+00:00" from="2025-10-03 10:30:00+00:00" to="2025-10-03 11:00:00+00:00" location="Karen Hospital, Nairobi" status="confirmed" specialist-name="Dr. John Kamau" kind="screening" reviews="450" average-review="4.1" name="BP & Diabetes Screening" images="https://i.pravatar.cc/200?img=13,https://i.pravatar.cc/200?img=9" price="2000" last="30"></div>
        <div is="booking-wrapper" date="2025-10-05 08:00:00+00:00" from="2025-10-05 08:00:00+00:00" to="2025-10-05 08:30:00+00:00" location="Teams (Online)" status="confirmed" specialist-name="Dr. Fatuma Hassan" kind="information" reviews="300" average-review="4.5" name="Medication Counselling" price="0" last="30"></div>
        <div is="booking-wrapper" date="2025-10-10 11:00:00+00:00" from="2025-10-10 11:00:00+00:00" to="2025-10-10 12:00:00+00:00" location="Nairobi Hospital" status="pending" specialist-name="Dr. Peter Njoroge" kind="screening" reviews="620" average-review="4.3" name="Comprehensive Checkup" images="https://i.pravatar.cc/200?img=30,https://i.pravatar.cc/200?img=31" price="3670" last="60"></div>
        <div is="booking-wrapper" date="2025-10-12 16:00:00+00:00" from="2025-10-12 16:00:00+00:00" to="2025-10-12 16:45:00+00:00" location="Teams (Online)" status="confirmed" specialist-name="Telehealth Team" kind="telehealth" reviews="150" average-review="4.6" name="Virtual Consult" images="https://i.pravatar.cc/200?img=33,https://i.pravatar.cc/200?img=34" price="2500" last="4500"></div>
        <div is="booking-wrapper" date="2025-10-15 13:30:00+00:00" from="2025-10-15 13:30:00+00:00" to="2025-10-15 14:00:00+00:00" location="Nairobi West Hospital" status="pending" specialist-name="Pharmacist Clara Wanjiru" kind="medication" reviews="90" average-review="4.0" name="Medication Review" price="0" last="30"></div>
        <div is="booking-wrapper" date="2025-10-20 09:00:00+00:00" from="2025-10-20 09:00:00+00:00" to="2025-10-20 10:20:00+00:00" location="Kenyatta National Hospital, Nairobi" status="confirmed" specialist-name="Dr. Alice Mwangi" kind="delivery" reviews="400" average-review="3.9" name="Prescription Delivery" images="https://i.pravatar.cc/200?img=35,https://i.pravatar.cc/200?img=36,https://i.pravatar.cc/200?img=37,https://i.pravatar.cc/200?img=38,https://i.pravatar.cc/200?img=39" price="12750" last="80"></div>
        <div is="booking-wrapper" date="2025-10-28 15:00:00+00:00" from="2025-10-28 15:00:00+00:00" to="2025-10-28 16:00:00+00:00" location="Karen Hospital, Nairobi" status="pending" specialist-name="Dr. John Kamau" kind="emergency" reviews="210" average-review="4.4" name="Urgent Consultation" images="https://i.pravatar.cc/200?img=41,https://i.pravatar.cc/200?img=42,https://i.pravatar.cc/200?img=43" price="6000" last="60"></div>
        <div class="month-separator">Nov, 2025</div>

        <!-- November bookings (6 entries) -->
        <div is="booking-wrapper" date="2025-11-03 09:00:00+00:00" from="2025-11-03 09:00:00+00:00" to="2025-11-03 09:45:00+00:00" location="Kenyatta National Hospital, Nairobi" status="confirmed" specialist-name="Dr. Mary Njeri" kind="consultation" reviews="320" average-review="4.5" name="Prescription Review" images="https://i.pravatar.cc/200?img=50,https://i.pravatar.cc/200?img=51" price="0" last="45"></div>
        <div is="booking-wrapper" date="2025-11-06 11:30:00+00:00" from="2025-11-06 11:30:00+00:00" to="2025-11-06 12:30:00+00:00" location="Nairobi Hospital" status="pending" specialist-name="Dr. James Kariuki" kind="screening" reviews="150" average-review="4.2" name="Routine Checkup" images="https://i.pravatar.cc/200?img=52,https://i.pravatar.cc/200?img=53,https://i.pravatar.cc/200?img=54" price="3867" last="60"></div>
        <div is="booking-wrapper" date="2025-11-10 14:00:00+00:00" from="2025-11-10 14:00:00+00:00" to="2025-11-10 14:30:00+00:00" location="Teams (Online)" status="confirmed" specialist-name="Dr. Fatuma Hassan" kind="information" reviews="90" average-review="4.6" name="Medication Counselling" price="0" last="30"></div>
        <div is="booking-wrapper" date="2025-11-14 08:30:00+00:00" from="2025-11-14 08:30:00+00:00" to="2025-11-14 09:30:00+00:00" location="MP Shah Hospital, Nairobi" status="pending" specialist-name="Nurse Esther Mwende" kind="vaccination" reviews="210" average-review="4.7" name="Flu Vaccination" images="https://i.pravatar.cc/200?img=55,https://i.pravatar.cc/200?img=56,https://i.pravatar.cc/200?img=57,https://i.pravatar.cc/200?img=58" price="2765" last="60"></div>
        <div is="booking-wrapper" date="2025-11-21 10:00:00+00:00" from="2025-11-21 10:00:00+00:00" to="2025-11-21 10:20:00+00:00" location="Chiromo Medical Centre, Nairobi" status="confirmed" specialist-name="Pharmacist Peter Njoroge" kind="medication" reviews="45" average-review="4.1" name="Prescription Refill" price="0" last="20"></div>
        <div is="booking-wrapper" date="2025-11-25 15:00:00+00:00" from="2025-11-25 15:00:00+00:00" to="2025-11-25 16:00:00+00:00" location="Karen Hospital, Nairobi" status="confirmed" specialist-name="Dr. Alice Mwangi" kind="telehealth" reviews="300" average-review="4.4" name="Telehealth Follow-up" images="https://i.pravatar.cc/200?img=59,https://i.pravatar.cc/200?img=60" price="2500" last="60"></div>
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
          padding: 0 0 5px;
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
          gap: 8px;
          margin: 0;
          width: 100%;
          z-index: 10;
          position: sticky;
          top: 0px;
          padding: 15px 0 0 0;
          background: var(--background);
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
          margin: 0;
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

        div.bookings {
          display: flex;
          flex-flow: column;
          gap: 16px;
          padding: 16px 0;
          width: 100%;
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

        @media screen and (max-width: 700px) {
          :host {
            border: none;
            width: 100%;
            max-width: 100%;
            min-width: 100%;
            max-height: unset;
            height: unset;
            min-height: unset;
            max-height: unset;
            padding: 0 0 65px;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: start;
          }

          .content {
            padding: 0;
            display: flex;
            flex-flow: column;
            gap: 0;
            width: 100%;
          }

          .head {
            display: flex;
            flex-flow: column;
            gap: 0;
            padding: 0 10px;
            width: 100%;
          }

          .head > h3.title {
            display: flex;
            align-items: center;
            font-family: var(--font-text), sans-serif;
            color: var(--title-color);
            font-size: 1.2rem;
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

          div.sticky {
            display: flex;
            flex-flow: column;
            gap: 8px;
            margin: 0;
            width: 100%;
            z-index: 10;
            position: relative;
            top: unset;
            padding: 10px 10px 0;
            background: unset;
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
            padding: 4px 0 8px;
            margin: 0;
            border-radius: 0;
            background: unset;
            border-bottom: var(--border);
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
            cursor: default !important;
            font-size: 0.9rem;
            font-weight: 500;
            color: var(--text-color);
            font-family: var(--font-read), sans-serif;
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

          ul.tabs > li.tab:hover.active,
          ul.tabs > li.tab.active {
            color: var(--accent-color);
            background: var(--gray-background);
            font-weight: 600;
          }

          ul.tabs > li.tab:hover {
            /* Undo all hover styles except for active */
            background: unset;
            color: var(--text-color);
            font-weight: 500;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            transition: none;
          }

          div.bookings {
            display: flex;
            flex-flow: column;
            gap: 0;
            padding: 0 10px;
            width: 100%;
          }

          div.month-separator {
            display: flex;
            align-items: center;
            font-family: var(--font-main), sans-serif;
            color: var(--text-color);
            font-size: 1.2rem;
            font-weight: 600;
            line-height: 1;
            margin: 0;
            padding: 10px 0;
            border-bottom: var(--border);
          }
        }
	    </style>
    `;
  }
}