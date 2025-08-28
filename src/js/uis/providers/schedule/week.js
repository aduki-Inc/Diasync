export default class Week extends HTMLDivElement {
  constructor() {
    super();
    this.app = window.app;
    this.shadowObj = this.attachShadow({ mode: 'open' });
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // initialize cart
  }

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `
  }

  getBody = () => {
    return /* html */`
      <section class="container">
        ${this.getDates()}
        ${this.getTimes()}
      </section>
    `
  }

  getTimes() {
    return /* html */`
      <div class="times">
        <div class="head">
          <h3 class="title">Choose Time</h3>
        </div>
        <div class="schedules">
          ${this.getPeriodes()}
          ${this.getPeriodTimes()}
        </div>
      </div>
    `
  }

  getPeriodes = () => {
    return /* html */`
      <ul class="periods">
        <li class="period morning">Morning</li>
        <li class="period afternoon selected">Afternoon</li>
        <li class="period evening">Evening</li>
        <li class="period night">Night</li>
      </ul>
    `
  }

  getPeriodTimes = () => {
    return /* html */`
      <ul class="period-times">
        <li class="time">1:00 PM</li>
        <li class="time selected">
          2:00 PM
          <div class="checkbox-round">
            <input type="checkbox" id="checkbox-18" checked>
            <label for="checkbox-18"></label>
          </div>
        </li>
        <li class="time evening">3:00 PM</li>
        <li class="time night">4:30 PM</li>
      </ul>
    `
  }

  getDates() {
    const date = new Date(Date.now());
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayHeaders = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const data = { date, day, dayHeaders }
    return /* html */`
      <div class="dates">
        <div class="head">
          <h3 class="title">Select Date</h3>
          <div class="months">
            <span class="nav prev">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-width="2.0" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
            <span class="selected">August</span>
            <span class="nav next active">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
        </div>
        <div class="week">
          ${this.getDays(data)}
        </div>
      </div>
    `
  }

  getDays = data => {
    const outerThis = this;
    return /* html */`
      <ul class="days">
        ${data.dayHeaders.map((value, index) => {
      return outerThis.getDay(value, data.date, index === data.day, index >= data.day)
    }).join('')}
			</ul>
    `;
  }

  getDay = (day, date, isToday, isSelctable) => {
    const current = new Date()
    const unSelectable = isSelctable === false ? 'unselctable' : '';
    const todayClass = isToday === true ? 'today' : '';
    return /* html */`
      <li class="day ${unSelectable} ${todayClass}">
        <span class="head">${day?.toUpperCase()}</span>
        <span class="date">${date.getDate()}</span>
			</li>
    `;
  }

  getButtons = () => {
    const { html, class: className } = this.getAddedToCartButton(this.getAttribute('in-cart'));
    const { html: wishHtml, class: wishClass } = this.getWishedButton(this.getAttribute('wished'));
    return /* html */`
      <div class="buttons">
        <button class="button add ${className}">${html}</button>
        <!--<button class="button wish ${wishClass}">${wishHtml}</button>-->
        <button class="button view">view</button>
			</div>
    `;
  }

  getStyles() {
    return /* css */`
      <style>
        * {
          box-sizing: border-box !important;
          /* disable user select */
          user-select: none;
          /* disable text selection */
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -o-user-select: none;
          -khtml-user-select: none;
        }

        :host {
          width: 100%;
          gap: 0;
          padding: 0;
          margin: 0;
        }

        section.container {
          display: flex;
          flex-flow: column;
          align-items: start;
          justify-content: space-between;
          gap: 30px;
          padding: 0;
          width: 100%;
        }

        div.dates {
          display: flex;
          flex-flow: column;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          padding: 0;
          width: 100%;
        }

        div.dates > .head {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        div.dates > .head > h3.title {
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

        div.head > div.months {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 0;
        }

        div.head > div.months > span.selected {
          display: flex;
          align-items: center;
          font-family: var(--font-main), sans-serif;
          color: var(--gray-color);
          font-size: 1rem;
          font-weight: 500;
          line-height: 1;
          margin: 0;
          padding: 0;
        }

        div.head > div.months > span.nav {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: var(--border);
          width: 25px;
          height: 25px;
          opacity: 0.8;
          border-radius: 50%;
          background: var(--gray-background);
          color: var(--gray-color);
        }

        div.head > div.months > span.nav:hover {
          background: var(--gray-background);
        }

        div.head > div.months > span.nav.active {
          opacity: 1;
          background: var(--icon-background);
          color: var(--text-color);
        }

        div.head > div.months > span.nav.active:hover {
          background: var(--icon-background);
          border: var(--icon-border-active);
          color: var(--accent-color);
        }

        div.head > div.months > span.nav > svg {
          width: 20px;
          height: 20px;
          margin-top: 1px;
          display: inline-block;
          vertical-align: middle;
        }

        div.head > div.months > span.nav.next > svg {
          margin-left: 2px;
        }

        div.head > div.months > span.nav.prev > svg {
          margin-right: 1px;
        }

        div.week {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          gap: 0;
          padding: 0;
        }

        div.week > ul.days {
          display: flex;
          list-style-type: none;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 0;
          margin: 0;
        }

        div.week > ul.days > li.day {
          background: var(--gray-background);
          display: flex;
          list-style-type: none;
          flex-flow: column;
          align-items: center;
          justify-items: center;
          cursor: pointer;
          border: var(--border);
          color: var(--text-color);
          font-weight: 600;
          gap: 15px;
          width: 70px;
          border-radius: 12px;
          padding: 10px 12px;
          margin: 0;
        }

        div.week > ul.days > li.day > span.head {
          font-family: var(--font-read), sans-serif;
        }

        div.week > ul.days > li.day > span.date {
          font-family: var(--font-main), sans-serif;
          font-size: 1.25rem;
        }

        div.week > ul.days > li.day.unselctable,
        div.week > ul.days > li.day.unselctable.selected {
          box-shadow: none;
          background: var(--unselctable-background);
          color: var(--unselctable-color);
          pointer-events: none;
          opacity: .7;
          cursor: not-allowed;
        }

        div.week > ul.days > li.day.today,
        div.week > ul.days > li.day.today:hover,
        div.week > ul.days > li.day.today.selected {
          transform: unset;
          border: var(--active-border);
          box-shadow: 0 8px 25px rgba(0, 96, 223, 0.25);
          background: var(--today-background);
        }

        div.week > ul.days > li.day:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, var(--stat-background), rgba(0, 96, 223, 0.05));
          border: var(--selected-border);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.25);
        }

        div.week > ul.days > li.day.selected {
          transform: translateY(-2px);
          background: linear-gradient(135deg, var(--stat-background), rgba(0, 96, 223, 0.05));
          border: var(--selected-border);
          box-shadow: 0 8px 25px #10b98140;
        }

        div.times {
          display: flex;
          flex-flow: column;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          padding: 0;
          width: 100%;
        }

        div.times > .head {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        div.times > .head > h3.title {
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

        div.times > div.schedules {
          display: flex;
          flex-flow: column;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 0;
        }

        div.times > div.schedules > ul.periods {
          display: flex;
          list-style-type: none;
          flex-flow: row nowrap;
          align-items: center;
          gap: 15px;
          width: 100%;
          padding: 0;
          margin: 0;
        }

        div.times > div.schedules > ul.periods > li.period {
          background: var(--gray-background);
          display: flex;
          list-style-type: none;
          flex-flow: column;
          align-items: center;
          justify-items: center;
          position: relative;
          background: var(--gray-background);
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 400;
          cursor: pointer;
          gap: 5px;
          text-transform: capitalize;
          justify-content: center;
          padding: 7px 15px;
          width: max-content;
          border-radius: 12px;
        }

        div.times > div.schedules > ul.periods > li.period.selected {
          background: var(--accent-linear);
          color: var(--white-color);
        }

        div.times > div.schedules > ul.period-times {
          border-top: var(--border);
          display: flex;
          width: 100%;
          list-style-type: none;
          flex-flow: row nowrap;
          align-items: center;
          gap: 15px;
          padding: 15px 0 0;
          margin: 0;
        }

        div.times > div.schedules > ul.period-times > li.time {
          background: var(--gray-background);
          display: flex;
          list-style-type: none;
          flex-flow: column;
          align-items: center;
          justify-items: center;
          position: relative;
          background: var(--gray-background);
          color: var(--gray-color);
          border: var(--border);
          border-width: 2px;
          font-family: var(--font-read), sans-serif;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          gap: 5px;
          text-transform: capitalize;
          justify-content: center;
          padding: 5px 15px;
          width: max-content;
          border-radius: 11px;
        }

        div.times > div.schedules > ul.period-times > li.time.unselctable,
        div.times > div.schedules > ul.period-times > li.time.unselctable.selected {
          box-shadow: none;
          background: var(--unselctable-background);
          color: var(--unselctable-color);
          pointer-events: none;
          opacity: .7;
          cursor: not-allowed;
        }

        div.times > div.schedules > ul.period-times > li.time:hover {
          /* transform: translateY(-2px); */
          background: linear-gradient(135deg, var(--stat-background), rgba(0, 96, 223, 0.05));
          border: var(--selected-border);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.25);
        }

        div.times > div.schedules > ul.period-times > li.time.selected {
          transform: unset;
          position: relative;
          color: var(--accent-color);
          font-weight: 600;
          border: var(--active-border);
          box-shadow: 0 8px 25px rgba(0, 96, 223, 0.25);
          background: var(--today-background);
        }

        div.checkbox-round {
          position: absolute;
          right: -8px;
          top: -5px;
        }

        div.checkbox-round label {
          background-color: var(--background);
          border: var(--border);
          border-radius: 50%;
          cursor: pointer;
          height: 22px;
          width: 22px;
          display: block;
        }

        div.checkbox-round label:after {
          border: 2px solid var(--accent-color);
          border-top: none;
          border-right: none;
          content: "";
          height: 4px;
          left: 5px;
          opacity: 0;
          position: absolute;
          top: 7px;
          transform: rotate(-45deg);
          width: 10px;
        }

        div.checkbox-round input[type="checkbox"] {
          visibility: hidden;
          display: none;
          opacity: 0;
        }

        div.checkbox-round input[type="checkbox"]:checked + label {
          background: var(--background);
          border: var(--active-border);
          border-color: none;
        }

        div.checkbox-round input[type="checkbox"]:checked + label:after {
          opacity: 1;
        }

        @media (max-width: 700px) {
          :host {
            border: var(--border);
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
            gap: 0;
            padding: 0;
            width: 180px;
            min-width: 180px;
            border-radius: 8px;
          }

          /* reset all cursor: pointer to default */
          a,
          .details div.name span.name,
          .buttons > .button,
          .buttons > .button.add,
          .buttons > .button.view,
          .buttons > .button.wish,
          .buttons > .button.added,
          .store-name {
            cursor: default !important;
          }
        }
      </style>
    `
  }
}