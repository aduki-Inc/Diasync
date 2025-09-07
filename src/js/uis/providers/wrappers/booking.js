export default class Booking extends HTMLElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: 'open' });
    this.mql = window.matchMedia("(max-width: 700px)");
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.date.set(this.getAttribute('date'))
    this.from = this.date.parse(this.getAttribute('from'));
    this.to = this.date.parse(this.getAttribute('to'));
    this.render();
  }

  connectedCallback() {
    this.activateActions();
    this.handleViewModal(this.mql);
  }

  disconnectedCallback() {
    // cleanup global listeners
    if (this._boundOutsideClick) window.removeEventListener('click', this._boundOutsideClick, true);
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  activateActions() {
    const bookBtn = this.shadowObj.querySelector('div.buttons > .button.book');
    const inquireBtn = this.shadowObj.querySelector('div.buttons > .button.inquire');

    if (bookBtn) {
      bookBtn.addEventListener('click', e => {
        e.stopPropagation();
        this.book();
      });
    }

    if (inquireBtn) {
      inquireBtn.addEventListener('click', e => {
        e.stopPropagation();
        this.inquire();
      });
    }

    // edit dropdown toggle (uses JS to apply inline styles and classes so CSS animations can run)
    const editAction = this.shadowObj.querySelector('#edit-action');
    if (editAction) {
      editAction.addEventListener('click', e => {
        e.stopPropagation();
        this.toggleEditDropdown();
      });

      // close dropdown when clicking outside the host element
      this._boundOutsideClick = (ev) => {
        // use composedPath to correctly handle shadow DOM
        const path = ev.composedPath ? ev.composedPath() : (ev.path || []);
        // if the host is not in the path, the click was outside
        if (!path.includes(this)) {
          this.closeEditDropdown();
        }
      };
      window.addEventListener('click', this._boundOutsideClick, true);
    }
  }

  book() {
    // dispatch a custom event for host page to listen to
    this.dispatchEvent(new CustomEvent('service:book', {
      detail: {
        title: this.title,
        price: this.price
      },
      bubbles: true,
      composed: true
    }));

    if (this.app?.showToast) this.app.showToast(true, `Booked: ${this.title}`);
  }

  inquire() {
    this.dispatchEvent(new CustomEvent('service:inquire', {
      detail: {
        title: this.title,
        price: this.price
      },
      bubbles: true,
      composed: true
    }));

    if (this.app?.showToast) this.app.showToast(true, `Inquiry sent for: ${this.title}`);
  }

  // Toggle/open/close helpers for the edit dropdown
  toggleEditDropdown() {
    const el = this.shadowObj.querySelector('.action.edit');
    if (!el) return;
    if (el.classList.contains('open')) this.closeEditDropdown();
    else this.openEditDropdown();
  }

  openEditDropdown() {
    const el = this.shadowObj.querySelector('.action.edit');
    if (!el) return;
    const dropdown = el.querySelector('.edit-dropdown');
    if (!dropdown) return;

    if (el.classList.contains('open')) return; // already open

    el.classList.add('open');

    // prepare for animation using inline styles (will not modify existing stylesheet rules)
    dropdown.style.display = 'flex';
    dropdown.style.opacity = '0';
    dropdown.style.transform = 'translateY(-6px) scale(0.98)';
    dropdown.style.transition = 'opacity 180ms ease, transform 180ms ease';

    // force a reflow so the transition starts
    // eslint-disable-next-line no-unused-expressions
    dropdown.offsetHeight;

    // animate to visible state
    requestAnimationFrame(() => {
      dropdown.style.opacity = '1';
      dropdown.style.transform = 'translateY(0) scale(1)';
    });
  }

  closeEditDropdown() {
    const el = this.shadowObj.querySelector('.action.edit');
    if (!el) return;
    const dropdown = el.querySelector('.edit-dropdown');
    if (!dropdown) return;

    if (!el.classList.contains('open')) return; // already closed

    // animate to hidden state
    dropdown.style.opacity = '0';
    dropdown.style.transform = 'translateY(-6px) scale(0.98)';

    const cleanup = () => {
      // remove inline styles added for animation
      dropdown.style.display = '';
      dropdown.style.opacity = '';
      dropdown.style.transform = '';
      dropdown.style.transition = '';
      el.classList.remove('open');
      dropdown.removeEventListener('transitionend', cleanup);
    };

    // ensure we cleanup after transition; fallback to timeout if transitionend doesn't fire
    dropdown.addEventListener('transitionend', cleanup);
    setTimeout(cleanup, 220);
  }


  getTemplate() {
    return `
      ${this.getBody(this.mql)}
      ${this.getStyles()}
    `;
  }

  getBody = mql => {
    if (mql && mql.matches) {
      return /* html */`
        <div class="content ${this.getAttribute('status') || ''}" id="view-modal">
          <div class="left">
            ${this.getDay()}
          </div>
          <div class="right">
            ${this.getInfo()}
            ${this.getDetails()}
          </div>
        </div>
      `;
    } else {
      return /* html */`
        <div class="content ${this.getAttribute('status') || ''}">
          <div class="left">
            ${this.getDay()}
            ${this.getInfo()}
          </div>
          ${this.getDetails()}
          ${this.getActions()}
        </div>
      `;
    }
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
        ${this.getMoreAction(this.mql)}
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
        <a href="/user/booking" class="action view" id="view-action" data-action="view">view</a>
        <span class="action edit" id="edit-action" action="edit">
          <span class="text">edit</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          ${this.getEditDropdown(this.getAttribute('status') || '')}
        </span>
      </div>
    `;
  }

  getMoreAction = mql => {
    if (mql && mql.matches) {
      return /* html */`
        <span class="more-actions" id="view-modal">
          <span class="dot"></span>
          <span class="dot"></span>
        </span>
      `;
    } else return '';
  }

  getEditDropdown = status => {
    return /* html */`
      <div class="edit-dropdown">
        ${this.getApproveAction(status)}
        <button class="option reschedule">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M16 2V6M8 2V6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M3 10H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M17.5 15V22M21 18.5L14 18.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <span class="text">Reschedule</span>
        </button>
        <button class="option location">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M15.5 11C15.5 12.933 13.933 14.5 12 14.5C10.067 14.5 8.5 12.933 8.5 11C8.5 9.067 10.067 7.5 12 7.5C13.933 7.5 15.5 9.067 15.5 11Z" stroke="currentColor" stroke-width="1.8"></path>
            <path d="M12 2C16.8706 2 21 6.03298 21 10.9258C21 15.8965 16.8033 19.3847 12.927 21.7567C12.6445 21.9162 12.325 22 12 22C11.675 22 11.3555 21.9162 11.073 21.7567C7.2039 19.3616 3 15.9137 3 10.9258C3 6.03298 7.12944 2 12 2Z" stroke="currentColor" stroke-width="1.8"></path>
          </svg>
          <span class="text">Edit location</span>
        </button>
        <button class="option invite">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M15 8C15 5.23858 12.7614 3 10 3C7.23858 3 5 5.23858 5 8C5 10.7614 7.23858 13 10 13C12.7614 13 15 10.7614 15 8Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M17.5 21L17.5 14M14 17.5H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M3 20C3 16.134 6.13401 13 10 13C11.4872 13 12.8662 13.4638 14 14.2547" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <span class="text">Invite Guests</span>
        </button>
        <button class="option cancel">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M16 2V6M8 2V6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M21 13V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M3 10H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M21 16L18 19M18 19L15 22M18 19L21 22M18 19L15 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <span class="text">Cancel Event</span>
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
          <span class="text">Approve</span>
        </button>
      `;
    }

    return '';
  }

  handleViewModal = mql => {
    if (!mql || !mql.matches) return;
    const actions = this.shadowObj.querySelectorAll("#view-modal");
    if (!actions) return;
    const html = this.getModal();
    actions.forEach(action => {
      action.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();
        document.body.insertAdjacentHTML("beforeend", html);
      });
    });
  }

  getModal = () => {
    let images = this.getAttribute('images');
    if (!images || images === 'null' || images === '') {
      images = '';
    } else {
      images = /* html */`images="${images}"`;
    }
    return /* html */`
      <booking-modal date="${this.getAttribute('date')}" from="${this.getAttribute('from')}" to="${this.getAttribute('to')}" location="${this.getAttribute('location')}" status="${this.getAttribute('status')}" 
        specialist-name="${this.getAttribute('specialist-name')}" kind="${this.getAttribute('kind')}" reviews="${this.getAttribute('reviews')}" average-review="${this.getAttribute('average-review')}" 
        name="${this.getAttribute('name')}" ${images} price="${this.getAttribute('price')}" last="${this.getAttribute('last')}">
      </booking-modal>
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
          display: flex;
          font-family: var(--font-main), sans-serif;
        }

        div.content {
          border: var(--border);
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: start;
          width: 100%;
          cursor: pointer;
          gap: 20px;
          padding: 10px 5px;
          border-radius: 12px;
        }

        /* approved hover effect: but not for cancelled or pending */
        div.content:hover {
          background: var(--approved-background);
          border: var(--approved-border);
        }

        div.content.cancelled {
          background: var(--cancelled-background);
          border: var(--cancelled-border);
        }

        div.content.pending {
          background: var(--pending-background);
          border: var(--pending-border);
        }

        div.left {
          display: flex;
          width: 33%;
          min-width: 33%;
          gap: 10px;
        }

        div.day {
          padding: 5px 10px;
          width: 70px;
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
          font-size: 0.9rem;
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

        div.info {
          display: flex;
          flex-flow: column;
          align-items: start;
          justify-content: center;
          padding: 0;
          gap: 8px;
          width: calc(100% - 70px);
        }

        div.info > .time, div.info > .location {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: start;
          gap: 5px;
          font-family: var(--font-main), sans-serif;
          color: var(--gray-color);
          font-size: 0.9rem;
          font-weight: 400;
          line-height: 1;
          width: 100%;
          max-width: 100%;
        }

        div.info > div.location > svg {
          width: 16px;
          height: 16px;
        }

        div.info > div.location > span.address {
          font-family: var(--font-main), sans-serif;
          color: var(--gray-color);
          display: inline-block;
          font-size: 0.9rem;
          font-weight: 400;
          line-height: 1;
          width: calc(100% - 21px);
          max-width: calc(100% - 21px);

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
          font-size: 1rem;
          font-weight: 500;
          line-height: 1;
          margin: 0;
          padding: 0;
        }

        div.details {
          padding: 0;
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 5px;
          width: 40%;
        }

        div.details > h4.name {
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
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

        div.details > div.bottom > .price {
          border-left: var(--border);
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          font-size: 1rem;
          font-weight: 500;
          line-height: 1;
          padding: 0 0 0 10px;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: start;
          gap: 2px;
        }

        div.actions {
          display: flex;
          font-family: var(--font-main), sans-serif;
          width: 100%;
          flex-flow: row;
          align-items: center;
          align-self: center;
          justify-content: end;
          gap: 12px;
          padding: 0;
        }

        div.actions > .action {
          border: var(--action-border);
          padding: 6px 12px;
          background: none;
          font-family: var(--font-main), sans-serif;
          border: var(--border-mobile);
          color: var(--gray-color);
          font-weight: 400;
          text-decoration: none;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          width: max-content;
          flex-flow: row;
          align-items: center;
          text-transform: lowercase;
          text-align: center;
          justify-content: center;
          border-radius: 10px;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
        }

        div.actions > .action.view {
          background: var(--gray-background);
          color: var(--text-color);
          padding: 7px 20px;
          border: none;
          font-weight: 500;
        }

        div.actions > .action.edit {
          background: var(--background);
          color: var(--text-color);
          border: var(--border);
          font-weight: 500;
          padding: 5px 8px 5px 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          position: relative;
        }

        div.actions > .action.edit > svg {
          width: 17px;
          height: 17px;
          display: inline-block;
          margin: 2px 0 0 0;
        }

        /* rotate icon when dropdown is open */
        div.actions > .action.edit > svg {
          transform-origin: center center;
          transition: transform 180ms ease;
        }

        div.actions > .action.edit.open > svg {
          transform: rotate(-180deg);
        }

        div.actions > .action.edit > span.text {
          text-transform: lowercase;
        }

        div.actions > .action.edit > .edit-dropdown {
          display: none;
          align-items: start;
          justify-content: center;
          gap: 0;
          position: absolute;
          top: 38px;
          right: -7px;
          background: var(--background);
          border: var(--border);
          box-shadow: var(--modal-shadow);
          z-index: 10;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
          flex-flow: column nowrap;
          width: max-content;
          min-width: 150px;
        }

        div.actions > .action.edit > .edit-dropdown:before {
          content: "";
          position: absolute;
          top: -5px;
          right: 23px;
          display: inline-block;
          width: 10px;
          height: 10px;
          z-index: 0;
          rotate: 45deg;
          border-top: var(--border);
          border-left: var(--border);
          background: var(--background);
        }

        div.edit-dropdown > button.option {
          background: none;
          border: none;
          border-bottom: var(--border);
          width: 100%;
          z-index: 1;
          padding: 10px 15px;
          text-align: left;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          font-size: 0.9rem;
          font-weight: 400;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 10px;
        }

        div.edit-dropdown > button.option.cancel {
          color: var(--warn-color);
        }

        div.edit-dropdown > button.option > svg {
          width: 18px;
          height: 18px;
        }

        div.edit-dropdown > button.option:first-child {
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }


        div.edit-dropdown > button.option:last-child {
          border-bottom: none;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
        }

        div.edit-dropdown > button.option:hover {
          background: var(--gray-background);
        }

        div.edit-dropdown > button.option.approve:hover {
          background: var(--approved-background);
          color: var(--accent-color);
        }

        div.edit-dropdown > button.option.cancel:hover {
          background: var(--cancelled-background);
          color: var(--warn-color);
        }

        div.edit-dropdown > button.option > span.text {
          text-transform: none;
        }

        /* mobile */ 
        @media screen and (max-width: 700px) {
          div.content {
            border: none;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: start;
            border-bottom: var(--border);
            width: 100%;
            cursor: default !important;
            gap: 10px;
            padding: 10px 5px;
            border-radius: 0;
          }

          /* approved hover effect: but not for cancelled or pending */
          div.content:hover {
            background: var(--background);
            border: none;
            border-bottom: var(--border);
            /* border-bottom: var(--approved-border); */
          }

          div.content.cancelled {
            background: var(--background);
            border: none;
            border-bottom: var(--border);
            /* border-bottom: var(--cancelled-border); */
          }

          div.content.pending {
            background: var(--background);
            border: none;
            border-bottom: var(--border);
            /* border-bottom: var(--pending-border); */
          }

          div.left {
            display: flex;
            width: 50px;
            max-width: 50px;
            min-width: 50px;
            height: 100%;
            gap: 0;
          }

          div.day {
            padding: 5px 5px;
            height: 100%;
            min-height: 100%;
            width: 50px;
            display: flex;
            flex-flow: column;
            align-items: flex-start;
            justify-content: center;
            border-right: var(--border);
            border-right-style: dashed;
            gap: 20px;
          }

          div.right {
            display: flex;
            flex-flow: column;
            align-items: start;
            gap: 5px;
            width: calc(100% - 60px);
            max-width: calc(100% - 60px);
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
        }
      </style>
    `;
  }
}