export default class Transaction extends HTMLElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    window.activeTransaction = null;
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  // noinspection JSUnusedGlobalSymbols
  connectedCallback() {
    this.expandTransaction();
  }

  expandTransaction = () => {
    const content = this.shadowObj.querySelector(".content");
    const header = this.shadowObj.querySelector(".header");
    // add event listener to the content
    content.addEventListener("click", () => {
      // check for open transaction
      if (window.activeTransaction && window.activeTransaction !== this) {
        // close the active transaction
        try {
          window.activeTransaction.shadowObj.querySelector(".content").classList.remove("full");
          window.activeTransaction.shadowObj.querySelector(".header").classList.remove("full");
        } catch (error) {
          // pass
          console.error(error);
        }
      }

      // toggle the class full to the
      // content and header to expand the transaction
      content.classList.toggle("full");
      header.classList.toggle("full");

      // set the active transaction to this
      if (content.classList.contains("full")) {
        window.activeTransaction = this;
      }
    })
  }

  capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  hideAccount = account => {
    // Using regex to replace all characters with X except the first three and last three
    return account.replace(/(?<=.{3}).(?=.*.{3}$)/g, "*");
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    const name = this.getAttribute("name");
    return /* html */`
      ${this.getHeader()}
      <div class="content">
        <div class="left">
          ${this.getAvatar(name)}
          ${this.getName()}

        </div>
        ${this.getDesc()}
        ${this.hiddenInfo()}
      </div>
    `;
  }

  getHeader = () => {
    return /* html */`
      <div class="header">
        <span class="kind">${this.getAttribute("kind")}</span>
        <span class="sp">•</span>
        <span class="account">${this.getAttribute("account-kind")}</span>
        <span class="sp">•</span>
        <span class="datetime">${this.date.formatDateTime(this.getAttribute("datetime"))}</span>
      </div>
    `;
  }

  getName = () => {
    return /* html */`
      <div class="name">
        <h2 class="title">${this.getAttribute("name")}</h2>
        <span class="note">${this.getAttribute("note")}</span>
      </div>
    `;
  }

  getAvatar = name => {
    const image = this.getAttribute("image");
    if (image && image !== "" && image !== "null") {
      return /* html */`
        <div class="avatar">
          <img src="${image}" alt="${name}" />
        </div>
      `;
    } else {
      // get the first letter of the name and first letter of the last name
      const [first, last] = name.split(" ");
      // get css value for var(--gray-background) from :root
      const color = window.getComputedStyle(document.documentElement).getPropertyValue("--gray-background").replace('#', '');
      const textColor = window.getComputedStyle(document.documentElement).getPropertyValue("--text-color").replace('#', '');
      console.log(color);
      return /* html */`
        <div class="avatar">
          <img src="https://ui-avatars.com/api/?background=${color}&color=${textColor}&name=${first}+${last}" alt="${name}" />
        </div>
      `;
    }
  }

  getDesc = () => {
    const received = this.getAttribute("in") === "true";
    return /* html */`
      <div class="desc">
        <span class="amount ${received ? "in" : "out"}">
          <span class="no">${received === true ? "+" : "-"}${this.number.balanceWithCommas(this.getAttribute("amount"))}</span>
          <span class="currency">EAC</span>
        </span>
        <span class="account">${this.hideAccount(this.getAttribute("account"))}</span>
      </div>
    `;
  }

  hiddenInfo = () => {
    const date = new Date(this.getAttribute("datetime"));
    // GET time in: 12:00 PM
    const time = date.toLocaleString('default', { hour: 'numeric', minute: 'numeric', hour12: true });
    return /* html */`
      <div class="hidden">
        <span class="id">
          <span class="text">TXN ID:</span>
          <span class="value">${this.getAttribute("id")}</span>
        </span>
        <span class="time">
          <span class="text">TXN TIME:</span>
          <span class="value">${time}</span>
        </span>
      </div
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

          /* Disable user select */
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
          padding: 10px 0;
          border-bottom: var(--border);
          margin: 0;
          display: flex;
          flex-flow: column;
          height: max-content;
          gap: 0;
          width: 100%;
        }

        .content {
          display: flex;
          flex-flow: row;
          gap: 0;
          padding: 0;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          min-width: 100%;
          cursor: pointer;
          height: 100%;
          transition: 0.3s;
        }

        .content.full {
          display: flex;
          flex-flow: column;
          gap: 20px;
          padding: 0;
          align-items: start;
          justify-content: start;
          width: 100%;
          height: 100%;
          transition: 0.3s;
        }

        .header {
          display: flex;
          flex-flow: row;
          gap: 5px;
          padding: 0 0 5px 0;
          align-items: center;
          justify-content: start;
          width: 100%;
          height: max-content;
          transition: 0.3s;
        }

        .header.full {
          display: flex;
          gap: 5px;
          padding: 5px 0 10px;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .header > .kind {
          margin: 0;
          padding: 0;
          font-size: .8rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          /* make font uppercase */
          text-transform: uppercase;
        }

        .header > .sp {
          margin: 0;
          padding: 0;
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
        }

        .header > .account {
          margin: 0;
          padding: 0;
          font-size: .8rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
          /* make font uppercase */
          text-transform: uppercase;
        }

        .header > .datetime {
          margin: 0;
          padding: 0;
          font-size: .8rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-read), monospace;
          /* make font uppercase */
          text-transform: uppercase;
        }

        .left {
          display: flex;
          flex-flow: row;
          gap: 10px;
          padding: 0;
          align-items: center;
          justify-content: start;
          height: 100%;
          max-width: 70%;
          transition: 0.3s;
          overflow: hidden;
        }

        .content.full > .left {
          display: flex;
          flex-flow: column;
          gap: 5px;
          padding: 0;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 100%;
          height: max-content;
          max-width: 100%;
          transition: 0.3s;
          overflow: unset;
        }

        .left > .avatar {
          display: flex;
          flex-flow: row;
          gap: 0;
          padding: 0;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          min-width: 40px;
          min-height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }

        .content.full > .left > .avatar {
          width: 100px;
          height: 100px;
          min-width: 100px;
          min-height: 100px;
        }

        .left > .avatar > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .left > .name {
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 0;
          align-items: start;
          justify-content: center;
          width: max-content;
          height: 100%;
          transition: 0.3s;
          overflow: hidden;
        }

        .content.full > .left > .name {
          align-items: center;
          justify-content: center;
        }

        .left > .name > .title {
          margin: 0;
          padding: 0;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-read), sans-serif;
        }

        .left > .name > .note {
          margin: 0;
          padding: 0;
          font-size: .95rem;
          font-weight: 400;
          max-width: 100%;
          color: var(--gray-color);
          font-family: var(--font-read), monospace;
          /**add ellipsis to the text */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .content.full > .left > .name > .note {
          white-space: normal;
          overflow: unset;
          text-overflow: unset;
          text-align: center;
          max-width: 100%;
        }

        .desc {
          display: flex;
          flex-flow: column;
          gap: 2px;
          padding: 0;
          align-items: end;
          justify-content: center;
          width: max-content;
          height: 100%;
          transition: 0.3s;
        }

        .content.full > .desc {
          align-items: center;
          justify-content: center;
          width: 100%;
          height: max-content;
        }

        .desc > .amount {
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: end;
          gap: 5px;
          margin: 0;
          padding: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-color);
          font-family: var(--font-read), sans-serif;
        }

        .content.full > .desc > .amount {
          justify-content: center;
          gap: 10px;
        }

        .desc > .amount > .no {
          display: flex;
          gap: 0;
          margin: 0;
          padding: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
        }

        .content.full > .desc > .amount > .no {
          font-size: 1.5rem;
        }

        .desc > .amount.in > .no {
          color: var(--anchor-color);
        }

        .desc > .amount.out > .no {
          color: var(--warn-color);
        }

        .desc > .amount > .currency {
          margin: 0;
          padding: 0;
          display: none;
          font-weight: 600;
          color: transparent;
          background: var(--second-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .content.full > .desc > .amount > .currency {
          display: inline-block;
        }

        .desc > .account {
          margin: 0;
          padding: 0;
          font-size: .9rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
          /* make font uppercase */
          text-transform: uppercase;
        }

        .content.full > .desc > .account {
          text-align: center;
          font-size: 1.1rem;
        }

        .hidden {
          display: none;
          padding: 0;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: max-content;
          transition: 0.3s;
        }

        .content.full > .hidden {
          display: flex;
          gap: 10px;
        }

        .hidden > .id ,
        .hidden > .time {
          display: flex;
          flex-flow: row;
          gap: 5px;
          padding: 0;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: max-content;
          transition: 0.3s;
        }

        .hidden > .id > .text,
        .hidden > .time > .text {
          margin: 0;
          padding: 0;
          font-size: .8rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
        }

        .hidden > .id > .value ,
        .hidden > .time > .value {
          margin: 0;
          padding: 0;
          font-size: .8rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-mono), monospace;
          text-transform: uppercase;
        }
        
				@media screen and (max-width:660px) {
					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

          .content,
					a {
						cursor: default !important;
          }
				}
	    </style>
    `;
  }
}