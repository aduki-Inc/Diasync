export default class TransactionsFeed extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.all = this.number.parse(this.getAttribute("all"));
    this.holding = this.number.parse(this.getAttribute("holding"));
    this.investments = this.number.parse(this.getAttribute("investments"));
    this.loan = this.number.parse(this.getAttribute("loan"));
    this.revenue = this.number.parse(this.getAttribute("revenue"));
    this.render();
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
        ${this.getTab()}
        <div class="transactions">
          ${this.getTransactions()}
          ${this.getPagination({ current: 13, total: 24 })}
        </div>
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
    const all = this.number.shorten(this.all);
    const holding = this.number.shorten(this.holding);
    const investments = this.number.shorten(this.investments);
    const loan = this.number.shorten(this.loan);
    const revenue = this.number.shorten(this.revenue);
    return /* html */`
      <ul class="tabs">
        <li class="tab active">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M12.5 3H11.5C7.02166 3 4.78249 3 3.39124 4.39124C2 5.78249 2 8.02166 2 12.5C2 16.9783 2 19.2175 3.39124 20.6088C4.78249 22 7.02166 22 11.5 22C15.9783 22 18.2175 22 19.6088 20.6088C21 19.2175 21 16.9783 21 12.5V11.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M22 5.5C22 7.433 20.433 9 18.5 9C16.567 9 15 7.433 15 5.5C15 3.567 16.567 2 18.5 2C20.433 2 22 3.567 22 5.5Z" stroke="currentColor" stroke-width="1.8" />
            <path d="M7 11H11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7 16H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">All</span>
          <span class="count">${all}</span>
        </li>
        <li class="tab">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M14.9805 7.01556C14.9805 7.01556 15.4805 7.51556 15.9805 8.51556C15.9805 8.51556 17.5687 6.01556 18.9805 5.51556" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9.99491 2.02134C7.49644 1.91556 5.56618 2.20338 5.56618 2.20338C4.34733 2.29053 2.01152 2.97385 2.01154 6.96454C2.01156 10.9213 1.9857 15.7993 2.01154 17.7439C2.01154 18.932 2.74716 21.7033 5.29332 21.8518C8.38816 22.0324 13.9628 22.0708 16.5205 21.8518C17.2052 21.8132 19.4847 21.2757 19.7732 18.7956C20.0721 16.2263 20.0126 14.4407 20.0126 14.0157" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M21.9999 7.01556C21.9999 9.77698 19.7592 12.0156 16.9951 12.0156C14.231 12.0156 11.9903 9.77698 11.9903 7.01556C11.9903 4.25414 14.231 2.01556 16.9951 2.01556C19.7592 2.01556 21.9999 4.25414 21.9999 7.01556Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M6.98053 13.0156H10.9805" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M6.98053 17.0156H14.9805" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          <span class="text">Holding</span>
          <span class="count">${holding}</span>
        </li>
        <li class="tab">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M14.9805 7.01556C14.9805 7.01556 15.4805 7.51556 15.9805 8.51556C15.9805 8.51556 17.5687 6.01556 18.9805 5.51556" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9.99491 2.02134C7.49644 1.91556 5.56618 2.20338 5.56618 2.20338C4.34733 2.29053 2.01152 2.97385 2.01154 6.96454C2.01156 10.9213 1.9857 15.7993 2.01154 17.7439C2.01154 18.932 2.74716 21.7033 5.29332 21.8518C8.38816 22.0324 13.9628 22.0708 16.5205 21.8518C17.2052 21.8132 19.4847 21.2757 19.7732 18.7956C20.0721 16.2263 20.0126 14.4407 20.0126 14.0157" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M21.9999 7.01556C21.9999 9.77698 19.7592 12.0156 16.9951 12.0156C14.231 12.0156 11.9903 9.77698 11.9903 7.01556C11.9903 4.25414 14.231 2.01556 16.9951 2.01556C19.7592 2.01556 21.9999 4.25414 21.9999 7.01556Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M6.98053 13.0156H10.9805" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M6.98053 17.0156H14.9805" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          <span class="text">Investments</span>
          <span class="count">${investments}</span>
        </li>
        <li class="tab">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M14.9805 7.01556C14.9805 7.01556 15.4805 7.51556 15.9805 8.51556C15.9805 8.51556 17.5687 6.01556 18.9805 5.51556" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9.99491 2.02134C7.49644 1.91556 5.56618 2.20338 5.56618 2.20338C4.34733 2.29053 2.01152 2.97385 2.01154 6.96454C2.01156 10.9213 1.9857 15.7993 2.01154 17.7439C2.01154 18.932 2.74716 21.7033 5.29332 21.8518C8.38816 22.0324 13.9628 22.0708 16.5205 21.8518C17.2052 21.8132 19.4847 21.2757 19.7732 18.7956C20.0721 16.2263 20.0126 14.4407 20.0126 14.0157" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M21.9999 7.01556C21.9999 9.77698 19.7592 12.0156 16.9951 12.0156C14.231 12.0156 11.9903 9.77698 11.9903 7.01556C11.9903 4.25414 14.231 2.01556 16.9951 2.01556C19.7592 2.01556 21.9999 4.25414 21.9999 7.01556Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M6.98053 13.0156H10.9805" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M6.98053 17.0156H14.9805" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          <span class="text">Loan</span>
          <span class="count">${loan}</span>
        </li>
        <li class="tab">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
          <path d="M14.9805 7.01556C14.9805 7.01556 15.4805 7.51556 15.9805 8.51556C15.9805 8.51556 17.5687 6.01556 18.9805 5.51556" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9.99491 2.02134C7.49644 1.91556 5.56618 2.20338 5.56618 2.20338C4.34733 2.29053 2.01152 2.97385 2.01154 6.96454C2.01156 10.9213 1.9857 15.7993 2.01154 17.7439C2.01154 18.932 2.74716 21.7033 5.29332 21.8518C8.38816 22.0324 13.9628 22.0708 16.5205 21.8518C17.2052 21.8132 19.4847 21.2757 19.7732 18.7956C20.0721 16.2263 20.0126 14.4407 20.0126 14.0157" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M21.9999 7.01556C21.9999 9.77698 19.7592 12.0156 16.9951 12.0156C14.231 12.0156 11.9903 9.77698 11.9903 7.01556C11.9903 4.25414 14.231 2.01556 16.9951 2.01556C19.7592 2.01556 21.9999 4.25414 21.9999 7.01556Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M6.98053 13.0156H10.9805" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M6.98053 17.0156H14.9805" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          <span class="text">Revenue</span>
          <span class="count">${revenue}</span>
        </li>
      </ul>
    `;
  }

  getTransactions = () => {
    return /* html */`
      <transaction-item id="TAC534436534" name="Fredrick Ochieng" account="EAC763442H" account-kind="Holding"
        amount="2734.65" datetime="2021-09-12T12:00:00Z" image="https://randomuser.me/api/portraits/men/1.jpg"
        kind="received" status="completed" note="Payment for services rendered" in="true">
      </transaction-item>
      <transaction-item id="TAC534436535" name="Loan Account" account="EAC763442H"
        amount="950.43" datetime="2021-09-13T14:00:00Z" account-kind="Loan"
        kind="repay" status="completed" note="Loan repayment" in="false">
      </transaction-item>
      <transaction-item id="TAC534436536" name="Alice Johnson" account="EAC763442H" account-kind="Investment"
        amount="9816.81" datetime="2021-09-14T16:00:00Z" image="https://randomuser.me/api/portraits/women/15.jpg"
        kind="deposit" status="completed" note="Deposit from client" in="true">
      </transaction-item>
      <transaction-item id="TAC534436537" name="Bob Brown" account="EAC763442H"
        amount="755.65" datetime="2021-09-15T18:00:00Z" account-kind="Holding"
        kind="send" status="completed" note="Payment for services rendered" in="false">
      </transaction-item>
      <transaction-item id="TAC534436542" name="Grace Harris" account="EAC763442H" account-kind="Investment"
        amount="700.00" datetime="2021-09-20T16:00:00Z" image="https://randomuser.me/api/portraits/men/1.jpg"
        kind="apply" status="completed" note="Applied for loan" in="true">
      </transaction-item>
      <transaction-item id="TAC534436543" name="Henry Irving" account="EAC763442H" account-kind="Investment"
        amount="800.00" datetime="2024-09-21T18:00:00Z" image="https://randomuser.me/api/portraits/men/11.jpg"
        kind="pay" status="completed" note="Payment for services rendered" in="false">
      </transaction-item>
      <transaction-item id="TAC534436544" name="Ivy Johnson" account="EAC763442H"
        amount="900.00" datetime="2021-09-22T20:00:00Z" account-kind="Revenue"
        kind="withdraw" status="completed" note="Withdrawal from account" in="false">
      </transaction-item>
      <transaction-item id="TAC534436544" name="Mpesa Deposit" account="EAC763442H"
        amount="2358.00" datetime="2024-10-13T20:45:00Z" account-kind="Holding"
        kind="Deposit" status="completed" note="Deposit from MPESA" in="true">
      </transaction-item>
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

          /* disable user select */
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -khtml-user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
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
          height: max-content;
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
          align-items: center;
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
          line-height: 1.3;
          color: var(--text-color);
          font-size: 1rem;
          font-family: inherit;
        }

        .head > .desc a {
          color: var(--anchor-color);
          font-weight: 500;
          transition: 0.3s;
        }

        .head > .desc a:hover {
          text-decoration: underline;
        }

        .head > .desc p {
          margin: 7px 0;
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
          z-index: 1;
          position: sticky;
          top: 55px;
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

        .transactions {
          min-height: 200px;
          display: flex;
          flex-flow: column;
          align-items: center;
          gap: 0;
          width: 100%;
        }

        .pagination {
          display: flex;
          flex-flow: row;
          gap: 10px;
          justify-content: center;
          padding: 20px 0;
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

          :host {
            padding-bottom: 30px;
          }

          ul.tabs {
            top: 0;
            position: sticky;
            z-index: 1;
          }

					a,
          ul.tabs > li.tab {
						cursor: default !important;
          }
				}
	    </style>
    `;
  }
}