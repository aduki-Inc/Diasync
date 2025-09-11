export default class Highlights extends HTMLElement {
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
      ${this.getActions()}
      ${this.getContent(this.owner)}
    `
  }

  getContent = owner => {
    if (owner) {
      return /* html */`
        ${this.getStats()}
        ${this.getBookings()}
      `
    } else {
      return /* html */`
        ${this.getSchedule()}
      `
    }
  }

  getHeader = () => {
    return /* html */`
      <div class="header">
        <h2 class="name">Jane Clinic & Dental Care</h2>
        <div class="location">
          <span class="address">1245 Kileleshwa Drive</span>
          <span class="city">Kileleshwa, Nairobi 00100</span>
        </div>
        <div class="description">
          <p>Your trusted neighborhood clinic and dental care center, staffed by experienced medical and dental professionals who provide a broad range of services from routine checkups and preventive dentistry to minor procedures and chronic condition management. </p>
        </div>
      </div>
    `
  }

  getStats = () => {
    const title = this.owner ? 'Your Stats' : 'Provider Stats';
    return /* html */`
      <div class="top-stats">
        <div class="head">
          <h3 class="title">${title}</h3>
        </div>
        <div class="stats">
          <div class="stat">
            <span class="experience">
              <span class="number">${this.number.withCommas(10)}+</span>
              <span class="label">Years</span>
            </span>
            <span class="label">Experience</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M18.9905 19H19M18.9905 19C18.3678 19.6175 17.2393 19.4637 16.4479 19.4637C15.4765 19.4637 15.0087 19.6537 14.3154 20.347C13.7251 20.9374 12.9337 22 12 22C11.0663 22 10.2749 20.9374 9.68457 20.347C8.99128 19.6537 8.52349 19.4637 7.55206 19.4637C6.76068 19.4637 5.63218 19.6175 5.00949 19C4.38181 18.3776 4.53628 17.2444 4.53628 16.4479C4.53628 15.4414 4.31616 14.9786 3.59938 14.2618C2.53314 13.1956 2.00002 12.6624 2 12C2.00001 11.3375 2.53312 10.8044 3.59935 9.73817C4.2392 9.09832 4.53628 8.46428 4.53628 7.55206C4.53628 6.76065 4.38249 5.63214 5 5.00944C5.62243 4.38178 6.7556 4.53626 7.55208 4.53626C8.46427 4.53626 9.09832 4.2392 9.73815 3.59937C10.8044 2.53312 11.3375 2 12 2C12.6625 2 13.1956 2.53312 14.2618 3.59937C14.9015 4.23907 15.5355 4.53626 16.4479 4.53626C17.2393 4.53626 18.3679 4.38247 18.9906 5C19.6182 5.62243 19.4637 6.75559 19.4637 7.55206C19.4637 8.55858 19.6839 9.02137 20.4006 9.73817C21.4669 10.8044 22 11.3375 22 12C22 12.6624 21.4669 13.1956 20.4006 14.2618C19.6838 14.9786 19.4637 15.4414 19.4637 16.4479C19.4637 17.2444 19.6182 18.3776 18.9905 19Z" stroke="currentColor" stroke-width="1.8"></path>
              <path d="M9 12.8929C9 12.8929 10.2 13.5447 10.8 14.5C10.8 14.5 12.6 10.75 15 9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <div class="stat patients">
            <span class="number">${this.number.withCommas(2590)}+</span>
            <span class="label">Patients</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M13 11C13 8.79086 11.2091 7 9 7C6.79086 7 5 8.79086 5 11C5 13.2091 6.79086 15 9 15C11.2091 15 13 13.2091 13 11Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M11.0386 7.55773C11.0131 7.37547 11 7.18927 11 7C11 4.79086 12.7909 3 15 3C17.2091 3 19 4.79086 19 7C19 9.20914 17.2091 11 15 11C14.2554 11 13.5584 10.7966 12.9614 10.4423" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M15 21C15 17.6863 12.3137 15 9 15C5.68629 15 3 17.6863 3 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M21 17C21 13.6863 18.3137 11 15 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <div class="stat">
            <span class="number">${this.number.withCommas(61)}</span>
            <span class="label">Services</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M19.4173 15.7133C23.368 10.7038 22.3007 5.73508 19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801L11.9998 4.84158M19.4173 15.7133C18.469 16.9156 17.2317 18.1204 15.6605 19.2834C14.1143 20.4278 13.3412 21 12 21C10.6588 21 9.88572 20.4278 8.33953 19.2834C0.22172 13.2749 1.01807 6.15293 4.53744 3.99415C7.21909 2.34923 9.55962 3.01211 10.9656 4.06801L11.9998 4.84158M19.4173 15.7133L13.8921 9.44479C13.6659 9.1882 13.2873 9.13296 12.9972 9.31424L10.8111 10.6806C10.0418 11.1614 9.04334 11.0532 8.3949 10.4187C7.53837 9.58062 7.62479 8.17769 8.5777 7.45106L11.9998 4.84158" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div class="stat">
            <span class="number">${this.number.withCommas(15680)}</span>
            <span class="label">Reviews</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M13 11C13 8.79086 11.2091 7 9 7C6.79086 7 5 8.79086 5 11C5 13.2091 6.79086 15 9 15C11.2091 15 13 13.2091 13 11Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M11.0386 7.55773C11.0131 7.37547 11 7.18927 11 7C11 4.79086 12.7909 3 15 3C17.2091 3 19 4.79086 19 7C19 9.20914 17.2091 11 15 11C14.2554 11 13.5584 10.7966 12.9614 10.4423" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M15 21C15 17.6863 12.3137 15 9 15C5.68629 15 3 17.6863 3 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M21 17C21 13.6863 18.3137 11 15 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <div class="stat">
            <span class="number">4.7</span>
            <span class="label">Rating</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    `
  }

  getActions = () => {
    return /* html */`
      <provider-actions kind="${this.getAttribute('kind')}" owner="${this.getAttribute('owner')}" name="Jane Clinic & Dental Care"></provider-actions>
    `
  }

  getBookings = () => {
    return /* html */`
      <bookings-feed url="/bookings/example" kind="${this.getAttribute('kind')}" owner="${this.getAttribute('owner')}" name="Jane Clinic & Dental Care"></bookings-feed>
    `
  }

  getSchedule = () => {
    return /* html */`
      <book-schedule kind="${this.getAttribute('kind')}" owner="${this.getAttribute('owner')}" provider-name="Jane Clinic & Dental Care"></book-schedule>
    `
  }

  getStyles() {
    return /* css */`
      <style>
        * {
          box-sizing: border-box !important;
        }

        :host {
          padding: 0;
          width: 100%;
          max-width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        /* Header Styles */
        div.header {
          width: 100%;
          padding: 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        div.header > .name {
          font-size: 1.6rem;
          font-weight: 600;
          line-height: 1.3;
          font-family: var(--font-main), sans-serif;
          color: var(--title-color);
          margin: 0;
        }

        div.header > div.location {
          display: flex;
          flex-flow: column;
          gap: 2px;
          margin: 0;
        }

        div.header > div.location > .address {
          font-size: 1rem;
          font-weight: 400;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.3;
        }

        div.header > div.location > .city {
          font-size: 1rem;
          font-weight: 500;
          color: var(--accent-color);
          font-family: var(--font-read), sans-serif;
          line-height: 1.3;
        }

        div.header > div.description {
          display: block;
          margin: 5px 0;
          padding: 0;
          color: var(--text-color);
        }

        div.header > div.description > p {
          font-size: 1rem;
          font-weight: 400;
          margin: 7px 0;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.4;
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

        div.top-stats {
          display: flex;
          flex-flow: column;
          gap: 0;
          margin: 0 0 8px;
          padding: 15px 0 0 0;
          border-top: var(--border);
          border-bottom: var(--border);
        }

        div.stats {
          display: flex;
          flex-flow: row nowrap;
          gap: 15px;
          margin: 0;
          padding: 15px 0;
          overflow-x: auto;
          scrollbar-width: 0;
          -ms-overflow-style: none;  /* IE and Edge */
          &::-webkit-scrollbar {
            display: none;  /* Safari and Chrome */
            width: 0;
            visibility: hidden;
          }
        }

        div.stats > div.stat {
          display: flex;
          flex-flow: column;
          align-items: start;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          /* add glass morphism effect */
          background: var(--gray-background);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 12px 12px;
          min-width: 120px;
          max-width: max-content;
          height: 70px;
          margin: 0;
          position: relative;
          box-shadow: var(--box-shadow);
        }

        div.stats > div.stat > svg {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 20px;
          height: 20px;
          opacity: 0.8;
          color: var(--text-color);
        }

        div.stats > div.stat > .experience {
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 5px;
          padding-right: 30px;
        }

        div.stats > div.stat > .experience > .number {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          color: var(--title-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.3;
        }

        div.stats > div.stat > .experience > .label {
          font-size: 0.9rem;
          font-weight: 400;
          margin: 0;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          line-height: 1.3;
        }

        div.stats > div.stat > .number {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.3;
        }

        div.stats > div.stat > .label {
          font-size: 0.9rem;
          font-weight: 400;
          margin: 0;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          line-height: 1.3;
        }
      </style>
    `
  }
}