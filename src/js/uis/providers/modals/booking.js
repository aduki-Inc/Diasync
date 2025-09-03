export default class Booking extends HTMLElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: 'open' });
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.date.set(this.getAttribute('date'))
    this.from = this.date.parse(this.getAttribute('from'));
    this.to = this.date.parse(this.getAttribute('to'));
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    this.disableScroll();
    const btns = this.shadowObj.querySelectorAll('.cancel-btn');
    if (btns) this.closePopup(btns);
  }

  disconnectedCallback() {
    this.enableScroll()
  }

  disableScroll() {
    // Get the current page scroll position
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    let scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    document.body.classList.add("stop-scrolling");

    // if any scroll is attempted, set this to the previous value
    window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

  enableScroll() {
    document.body.classList.remove("stop-scrolling");
    window.onscroll = function () { };
  }

  closePopup = (btns) => {
    btns.forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        this.remove();
      });
    })
  }

  getTemplate() {
    // Show HTML Here
    return `
      <div class="overlay"></div>
      <section id="content" class="content">
        ${this.getWelcome()}
      </section>
    ${this.getStyles()}`
  }

  getWelcome() {
    return /*html*/`
      <div class="welcome">
        <div class="booking ${this.getAttribute('status') || ''}">
          <div class="left">
            ${this.getDay()}
          </div>
          <div class="right">
            ${this.getInfo()}
            ${this.getDetails()}
          </div>
        </div>
        <div class="container">
          ${this.getModify(this.getAttribute('status'))}
        </div>
        ${this.getActions()}
			</div>
    `;
  }

  getDay = () => {
    return /* html */`
      <div class="day">
        <span class="day-text">${this.date.day()}</span>
        <span class="day-number">${this.date.getDate()}</span>
      </div>
    `;
  }

  getInfo() {
    return /* html */`
      <div class="info">
        ${this.getTime()}
        ${this.getLocation()}
      </div>
    `;
  }

  getTime = () => {
    return /* html */`
      <div class="time">
        <span class="from time-text">${this.date.getTime(this.from, 12)}</span>
        <span class="separator">-</span>
        <span class="to time-text">${this.date.getTime(this.to, 12)}</span>
      </div>
    `;
  }

  getLocation = () => {
    return /* html */`
      <div class="location">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
          <path d="M13.6177 21.367C13.1841 21.773 12.6044 22 12.0011 22C11.3978 22 10.8182 21.773 10.3845 21.367C6.41302 17.626 1.09076 13.4469 3.68627 7.37966C5.08963 4.09916 8.45834 2 12.0011 2C15.5439 2 18.9126 4.09916 20.316 7.37966C22.9082 13.4393 17.599 17.6389 13.6177 21.367Z" stroke="currentColor" stroke-width="1.8" />
          <path d="M15.5 11C15.5 12.933 13.933 14.5 12 14.5C10.067 14.5 8.5 12.933 8.5 11C8.5 9.067 10.067 7.5 12 7.5C13.933 7.5 15.5 9.067 15.5 11Z" stroke="currentColor" stroke-width="1.8" />
        </svg>
        <span class="address">${this.getAttribute('location')}</span>
      </div>
    `;
  }

  getDetails = () => {
    return /* html */`
      <div class="details">
        <h4 class="name">${this.getAttribute('name') || 'Service Name'}</h4>
        <div class="bottom">
          ${this.getUsers()}
          <span class="price">
            ${this.getPrice(this.number.parse(this.getAttribute('price') || '0'))}
          </span>
        </div>
      </div>
    `;
  }

  getUsers = () => {
    return /* html */`
      <div class="users">
        ${this.getImages()}
      </div>
    `;
  }

  getImages = () => {
    const images = this.getAttribute('images');
    if (!images) return /* html */ `
      <div class="avatar">
        <img src="https://ui-avatars.com/api/?background=578fcac7&name=${encodeURIComponent(this.getAttribute('specialist-name') || 'Host User')}&color=ffffff" />
      </div>
      <div class="avatar">
        <img src="https://ui-avatars.com/api/?background=df791a&name=${encodeURIComponent('Guest Userr')}&color=ffffff" />
      </div>
    `;
    try {
      const imgArray = images.split(',').map(img => img.trim()).slice(0, 3);
      return imgArray.map(img => /* html */`<div class="avatar"><img src="${img}" alt="User Image" /></div>`).join('');
    } catch (e) {
      return /* html */ `
        <div class="avatar">
          <img src="https://ui-avatars.com/api/?background=578fcac7&name=${encodeURIComponent(this.getAttribute('specialist-name') || 'Host User')}&color=ffffff" />
        </div>
        <div class="avatar">
          <img src="https://ui-avatars.com/api/?background=df791a&name=${encodeURIComponent('Guest Userr')}&color=ffffff" />
        </div>
      `;
    }
  }

  getPrice = price => {
    if (price < 1) {
      return /* html */`
        <span class="free">Free</span>
      `;
    }
    return /* html */`
        <span class="currency">Ksh</span>
        <span class="amount">${this.number.withCommas(price)}</span>
      `;
  }

  getActions = () => {
    return /* html */`
      <div class="actions">
        <span class="action cancel-btn" id="cancel-action" action="cancel">Close</span>
        <a href="/user/booking" class="action view" id="view-action" action="view">View</a>
      </div>
    `;
  }

  getModify = status => {
    return /* html */`
      <div class="modify">
        ${this.getApproveAction(status)}
        <button class="option reschedule">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M16 2V6M8 2V6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M3 10H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M17.5 15V22M21 18.5L14 18.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <span class="text">Reschedule the event</span>
        </button>
        <button class="option location">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M15.5 11C15.5 12.933 13.933 14.5 12 14.5C10.067 14.5 8.5 12.933 8.5 11C8.5 9.067 10.067 7.5 12 7.5C13.933 7.5 15.5 9.067 15.5 11Z" stroke="currentColor" stroke-width="1.8"></path>
            <path d="M12 2C16.8706 2 21 6.03298 21 10.9258C21 15.8965 16.8033 19.3847 12.927 21.7567C12.6445 21.9162 12.325 22 12 22C11.675 22 11.3555 21.9162 11.073 21.7567C7.2039 19.3616 3 15.9137 3 10.9258C3 6.03298 7.12944 2 12 2Z" stroke="currentColor" stroke-width="1.8"></path>
          </svg>
          <span class="text">Edit the event location</span>
        </button>
        <button class="option invite">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M15 8C15 5.23858 12.7614 3 10 3C7.23858 3 5 5.23858 5 8C5 10.7614 7.23858 13 10 13C12.7614 13 15 10.7614 15 8Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M17.5 21L17.5 14M14 17.5H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M3 20C3 16.134 6.13401 13 10 13C11.4872 13 12.8662 13.4638 14 14.2547" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <span class="text">Invite more guests</span>
        </button>
        <button class="option cancel">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M16 2V6M8 2V6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M21 13V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M3 10H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M21 16L18 19M18 19L15 22M18 19L21 22M18 19L15 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <span class="text">Cancel this event</span>
        </button>
      </div>
    `;
  }

  getApproveAction = status => {
    if (status === 'pending') {
      return /* html */`
        <button class="option approve">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 11.3151 21.9311 10.6462 21.8 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M8 12.5C8 12.5 9.5 12.5 11.5 16C11.5 16 17.0588 6.83333 22 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">Approve this Event</span>
        </button>
      `;
    }

    return '';
  }

  getStyles() {
    return /*css*/`
      <style>
        * {
          box-sizing: border-box !important;
        }

        :host{
          border: none;
          padding: 0;
          justify-self: end;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          z-index: 100;
          width: 100%;
          min-width: 100vw;
          position: fixed;
          right: 0;
          top: 0;
          bottom: 0;
          left: 0;
        }

        div.overlay {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background: var(--modal-background);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
        }

        #content {
          z-index: 1;
          border: var(--border);
          background: var(--background);
          padding: 15px 10px 5px;
          margin-bottom: 20px;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          width: calc(100% - 20px);
          max-height: 90%;
          height: max-content;
          border-radius: 20px;
          position: relative;
        }

        .welcome {
          width: 98%;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 0;
        }

        .welcome > .head {
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          gap: 0;
          padding: 0 0 10px;
        }

        .welcome > .head > h2.consent {
          width: 100%;
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0;
          padding: 0;
          font-family: var(--font-main), sans-serif;
          color: var(--title-color);
          font-weight: 500;
          position: relative;
        }

        .welcome  p {
          margin: 0;
          width: 100%;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          line-height: 1.4;
          font-size: 1rem;
        }

        .welcome p.sub {
          margin: 10px 0 10px;
          width: 100%;
          font-family: var(--font-read), sans-serif;
          color: var(--gray-color);
          line-height: 1.4;
          font-size: 0.9rem;
        }

        .welcome span.items {
          display: flex;
          width: 100%;
          padding: 0;
          margin: 15px 0 0;
          font-family: var(--font-read), sans-serif;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 5px;
          color: var(--error-color);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        div.booking {
          border: none;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: start;
          border-bottom: var(--border);
          width: 100%;
          cursor: default !important;
          gap: 10px;
          padding: 0 0 10px 0;
          border-radius: 0;
        }

          /* approved hover effect: but not for cancelled or pending */
        div.booking:hover {
          background: var(--background);
          border: none;
          border-bottom: var(--border);
          /* border-bottom: var(--approved-border); */
        }

        div.booking.cancelled {
          background: var(--background);
          border: none;
          border-bottom: var(--border);
          /* border-bottom: var(--cancelled-border); */
        }

        div.booking.pending {
          background: var(--background);
          border: none;
          border-bottom: var(--border);
          /* border-bottom: var(--pending-border); */
        }

        div.left {
          display: flex;
          width: 60px;
          height: 100%;
          gap: 0;
        }

        div.day {
          padding: 5px 10px;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          border-right: var(--border);
          gap: 10px;
        }

        div.day > .day-text {
          font-family: var(--font-main), sans-serif;
          color: var(--gray-color);
          font-size: 1rem;
          font-weight: 500;
          line-height: 1;
          margin: 0;
          padding: 0;
        }

        div.day > .day-number {
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1;
          margin: 0;
          padding: 0;
        }

        div.day {
          padding: 5px 5px;
          min-width: 60px;
          border: var(--border);
          border-width: 2px;
          background: var(--stat-background);
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          gap: 20px;
        }

        div.right {
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 8px;
          width: calc(100% - 75px);
          max-width: calc(100% - 75px);
        }

        div.info {
          display: flex;
          flex-flow: column;
          align-items: start;
          justify-content: center;
          padding: 0;
          gap: 2px;
          width: 100%;
        }

        div.info > .time, div.info > .location {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: start;
          gap: 2px;
          font-family: var(--font-main), sans-serif;
          color: var(--gray-color);
          font-size: 0.9rem;
          font-weight: 400;
          line-height: 1;
          width: 100%;
          max-width: 100%;
        }

        div.info > div.location > svg {
          width: 14px;
          height: 14px;
        }

        div.info > div.location > span.address {
          font-family: var(--font-read), sans-serif;
          color: var(--gray-color);
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 400;
          line-height: 1;
          width: calc(100% - 20px);
          max-width: calc(100% - 20px);

          /* add ellipsis if too long */
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        div.info > div.time {
          width: 100%;
          max-width: 100%;
          display: flex;
          align-items: center;
          position: relative;
          gap: 5px;
        }

        div.info > .time > .separator {
          color: var(--gray-color);
        }

        div.info > div.time > .separator {
          color: var(--gray-color);
        }

        div.info > div.time > .time-text {
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          font-size: 0.8rem;
          font-weight: 500;
          line-height: 1;
          margin: 0;
          padding: 0;
        }

        div.info > div.time > span.more-actions {
          display: flex;
          gap: 3px;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 0;
          top: 0;
          padding: 4px;
        }

        div.info > div.time > span.more-actions > span.dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          background: var(--text-color);
          color: inherit;
          border-radius: 50%;
        }

        div.details {
          padding: 0;
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 5px;
          width: 100%;
        }
        
        div.details > h4.name {
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          font-size: 0.8rem;
          font-weight: 400;
          line-height: 1;
          margin: 0;
          padding: 0;
          /* add ellipsis if too long */
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
        }

        div.details > p.description {
          font-family: var(--font-read), sans-serif;
          color: var(--gray-color);
          font-size: 0.9rem;
          font-weight: 400;
          line-height: 1;
          margin: 0;
          padding: 0;

          /* add ellipsis if too long */
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
        }

        div.details > div.bottom {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: flex-start;
          gap: 10px;
          width: 100%;
        }

        div.details > div.bottom > .users {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: start;
          gap: -30px;
        }

        div.details > div.bottom > .users > .avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 2px solid var(--background);
          background-color: var(--gray-color);
        }

        div.details > div.bottom > .users > .avatar:nth-child(1) {
          z-index: 3;
          margin-left: 0;
        }

        div.details > div.bottom > .users > .avatar:nth-child(2) {
          z-index: 2;
          margin-left: -9px;
        }

        div.details > div.bottom > .users > .avatar:nth-child(3) {
          z-index: 1;
          margin-left: -9px;
        }

        div.details > div.bottom > .users > .avatar > img {
          width: 28px;
          height: 28px;
          border: var(--action-border);
          border-radius: 50%;
          object-fit: cover;
        }

        div.details > div.bottom {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: flex-start;
          gap: 10px;
          width: 100%;
        }

        div.details > div.bottom > .users {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: start;
          gap: -30px;
        }

        div.details > div.bottom > .users > .avatar {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 2px solid var(--background);
          background-color: var(--gray-color);
        }

        div.details > div.bottom > .price {
          border-left: var(--border);
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          font-size: 0.9rem;
          font-weight: 500;
          line-height: 1;
          padding: 0 0 0 10px;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: start;
          gap: 2px;
        }

        /* container styles */
        div.container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 0;
          width: 100%;
          border-bottom: var(--border);
        }

        div.actions {
          display: flex;
          font-family: var(--font-main), sans-serif;
          width: 100%;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 20px 0 10px;
        }

        div.actions > .action {
          padding: 12px 30px;
          background: none;
          font-family: var(--font-main), sans-serif;
          border: var(--border);
          color: var(--gray-color);
          font-weight: 500;
          text-decoration: none;
          font-size: 0.9rem;
          width: calc(50% - 10px);
          min-width: calc(50%  - 10px);
          cursor: pointer;
          display: flex;
          flex-flow: row;
          align-items: center;
          text-align: center;
          justify-content: center;
          border-radius: 15px;
          -webkit-border-radius: 15px;
          -moz-border-radius: 15px;
        }

        div.actions > .action.cancel-btn {
          border: thin solid #fd7f593a;
          background: var(--error-background);
          color: var(--error-color);
        }

        .welcome > .actions > .action.refresh {
          border: none;
          background: var(--success-background);
          color: var(--success-color);
          padding: 12px 20px;
        }

        div.modify {
          display: flex;
          align-items: start;
          justify-content: center;
          gap: 5px;
          padding: 10px 0;
          flex-flow: column nowrap;
          width: max-content;
          width: 100%;
        }

        div.modify > button.option {
          background: none;
          border: none;
          width: 100%;
          z-index: 1;
          padding: 6px 15px 6px 0;
          text-align: left;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          font-size: 1rem;
          font-weight: 400;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 20px;
        }

        div.modify > button.option.cancel {
          color: var(--warn-color);
        }

        div.modify > button.option > svg {
          width: 22px;
          height: 22px;
        }

        div.modify > button.option:hover {
          background: var(--gray-background);
        }

        div.modify > button.option.approve:hover {
          background: var(--approved-background);
          color: var(--accent-color);
        }

        div.modify > button.option.cancel:hover {
          background: var(--cancelled-background);
          color: var(--warn-color);
        }

        div.modify > button.option > span.text {
          text-transform: none;
        }

      </style>
    `;
  }
}