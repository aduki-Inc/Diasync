export default class Specialist extends HTMLDivElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: 'open' });
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.rate = this.number.parse(this.getAttribute('rate'));
    this.owner = this.getAttribute('owner') === 'true';
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // some events
  }

  getTemplate() {
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    return /* html */`
      <div class="specialist">
        <div class="specialist-content">
          ${this.getAvatar()}
          ${this.getInfo()}
        </div>
        ${this.getRate()}
        ${this.getActions()}
      </div>
    `;
  }

  getInfo() {
    return /* html */`
      <div class="info">
        <div class="name">
          <span class="name">${this.getAttribute('name')}</span>
          <span class="title">${this.getAttribute('speciality')}</span>
        </div>
        <div class="bottom">
          <span class="rating">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="number">${this.getAttribute('average-review')}</span>
            <span class="sp">•</span>
            <span class="reviews">${this.number.shorten(this.getAttribute('reviews'))}</span>
          </span>
        </div>
      </div>
    `;
  }

  getAvatar() {
    const image = this.getAttribute('image') || `https://ui-avatars.com/api/?background=578fcac7&name=${encodeURIComponent(this.getAttribute('name'))}&color=fff&size=128&font-size=0.5`;
    return /* html */`
      <div class="avatar">
        <img src="${image}" alt="Jane Clinic & Dental Care">
        ${this.checkVerified(this.getAttribute('verified'))}
      </div>
    `;
  }

  checkVerified = verified => {
    if (verified !== 'true' || !verified) return '';
    return /*html*/`
      <span class="verified" title="Verified Account">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.3592 1.41412C15.9218 0.966482 15.3993 0.610789 14.8224 0.367944C14.2455 0.125098 13.6259 0 13 0C12.3741 0 11.7545 0.125098 11.1776 0.367944C10.6007 0.610789 10.0782 0.966482 9.64079 1.41412L8.62993 2.45091L7.18354 2.43304C6.55745 2.42563 5.93619 2.54347 5.35631 2.77964C4.77642 3.01581 4.24962 3.36554 3.80687 3.80826C3.36413 4.25098 3.01438 4.77775 2.77819 5.3576C2.542 5.93744 2.42415 6.55866 2.43156 7.18472L2.44781 8.63102L1.41421 9.64181C0.966543 10.0792 0.610827 10.6017 0.367967 11.1785C0.125106 11.7554 0 12.3749 0 13.0008C0 13.6267 0.125106 14.2462 0.367967 14.8231C0.610827 15.3999 0.966543 15.9224 1.41421 16.3598L2.44944 17.3706L2.43156 18.8169C2.42415 19.443 2.542 20.0642 2.77819 20.644C3.01438 21.2239 3.36413 21.7506 3.80687 22.1934C4.24962 22.6361 4.77642 22.9858 5.35631 23.222C5.93619 23.4582 6.55745 23.576 7.18354 23.5686L8.62993 23.5523L9.64079 24.5859C10.0782 25.0335 10.6007 25.3892 11.1776 25.6321C11.7545 25.8749 12.3741 26 13 26C13.6259 26 14.2455 25.8749 14.8224 25.6321C15.3993 25.3892 15.9218 25.0335 16.3592 24.5859L17.3701 23.5507L18.8165 23.5686C19.4426 23.576 20.0638 23.4582 20.6437 23.222C21.2236 22.9858 21.7504 22.6361 22.1931 22.1934C22.6359 21.7506 22.9856 21.2239 23.2218 20.644C23.458 20.0642 23.5758 19.443 23.5684 18.8169L23.5522 17.3706L24.5858 16.3598C25.0335 15.9224 25.3892 15.3999 25.632 14.8231C25.8749 14.2462 26 13.6267 26 13.0008C26 12.3749 25.8749 11.7554 25.632 11.1785C25.3892 10.6017 25.0335 10.0792 24.5858 9.64181L23.5506 8.63102L23.5684 7.18472C23.5758 6.55866 23.458 5.93744 23.2218 5.3576C22.9856 4.77775 22.6359 4.25098 22.1931 3.80826C21.7504 3.36554 21.2236 3.01581 20.6437 2.77964C20.0638 2.54347 19.4426 2.42563 18.8165 2.43304L17.3701 2.44929L16.3592 1.41412Z" fill="currentColor"
            id="top"/>
          <path d="M15.3256 4.97901C15.0228 4.6691 14.661 4.42285 14.2616 4.25473C13.8623 4.08661 13.4333 4 13 4C12.5667 4 12.1377 4.08661 11.7384 4.25473C11.339 4.42285 10.9772 4.6691 10.6744 4.97901L9.97457 5.69678L8.97322 5.68441C8.53977 5.67928 8.10967 5.76086 7.70821 5.92437C7.30675 6.08787 6.94204 6.32999 6.63553 6.63649C6.32901 6.94298 6.08688 7.30767 5.92336 7.70911C5.75985 8.11054 5.67826 8.54061 5.68339 8.97403L5.69464 9.97532L4.97907 10.6751C4.66914 10.9779 4.42288 11.3396 4.25475 11.739C4.08661 12.1383 4 12.5673 4 13.0006C4 13.4339 4.08661 13.8628 4.25475 14.2621C4.42288 14.6615 4.66914 15.0232 4.97907 15.326L5.69577 16.0258L5.68339 17.0271C5.67826 17.4605 5.75985 17.8906 5.92336 18.292C6.08688 18.6935 6.32901 19.0581 6.63553 19.3646C6.94204 19.6711 7.30675 19.9133 7.70821 20.0768C8.10967 20.2403 8.53977 20.3218 8.97322 20.3167L9.97457 20.3055L10.6744 21.021C10.9772 21.3309 11.339 21.5771 11.7384 21.7453C12.1377 21.9134 12.5667 22 13 22C13.4333 22 13.8623 21.9134 14.2616 21.7453C14.661 21.5771 15.0228 21.3309 15.3256 21.021L16.0254 20.3043L17.0268 20.3167C17.4602 20.3218 17.8903 20.2403 18.2918 20.0768C18.6932 19.9133 19.058 19.6711 19.3645 19.3646C19.671 19.0581 19.9131 18.6935 20.0766 18.292C20.2402 17.8906 20.3217 17.4605 20.3166 17.0271L20.3054 16.0258L21.0209 15.326C21.3309 15.0232 21.5771 14.6615 21.7453 14.2621C21.9134 13.8628 22 13.4339 22 13.0006C22 12.5673 21.9134 12.1383 21.7453 11.739C21.5771 11.3396 21.3309 10.9779 21.0209 10.6751L20.3042 9.97532L20.3166 8.97403C20.3217 8.54061 20.2402 8.11054 20.0766 7.70911C19.9131 7.30767 19.671 6.94298 19.3645 6.63649C19.058 6.32999 18.6932 6.08787 18.2918 5.92437C17.8903 5.76086 17.4602 5.67928 17.0268 5.68441L16.0254 5.69566L15.3256 4.97901ZM15.6485 11.7113L12.2732 15.0864C12.2209 15.1388 12.1588 15.1803 12.0905 15.2087C12.0222 15.2371 11.9489 15.2517 11.8749 15.2517C11.8009 15.2517 11.7276 15.2371 11.6593 15.2087C11.5909 15.1803 11.5289 15.1388 11.4766 15.0864L9.78893 13.3988C9.73662 13.3465 9.69513 13.2844 9.66683 13.2161C9.63852 13.1478 9.62395 13.0745 9.62395 13.0006C9.62395 12.9266 9.63852 12.8534 9.66683 12.785C9.69513 12.7167 9.73662 12.6546 9.78893 12.6023C9.84123 12.55 9.90333 12.5085 9.97166 12.4802C10.04 12.4519 10.1132 12.4373 10.1872 12.4373C10.2612 12.4373 10.3344 12.4519 10.4028 12.4802C10.4711 12.5085 10.5332 12.55 10.5855 12.6023L11.8749 13.8927L14.8519 10.9147C14.9576 10.8091 15.1008 10.7498 15.2502 10.7498C15.3996 10.7498 15.5429 10.8091 15.6485 10.9147C15.7542 11.0204 15.8135 11.1636 15.8135 11.313C15.8135 11.4624 15.7542 11.6056 15.6485 11.7113Z"
             fill="url(#gradient)" id="bottom"/>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1" gradientUnits="userSpaceOnUse">
              <stop offset="-6.72%" stop-color="var(--alt-color)" />
              <stop offset="109.77%" stop-color="var(--accent-color)" />
            </linearGradient>
          </defs>
        </svg>
      </span>
		`
  }

  getRate = () => {
    return /* html */`
      <span class="rate">
        <span class="price">
          <span class="currency">Ksh</span>
          <span class="amount">${this.number.withCommas(this.rate)}</span>
        </span>
        <span class="separator">/</span>
        <span class="duration">Hour</span>
      </span>
    `
  }

  getActions = () => {
    if (!this.owner) {
      return /* html */`
        <div class="buttons">
          <button class="button view">View</button>
          <button class="button book">Book</button>
          <button class="button inquire">Message</button>
        </div>
      `;
    } else {
      return /* html */`
        <div class="buttons">
          <button class="button view">View</button>
          <button class="button manage">Manage</button>
          <button class="button remove">Remove</button>
        </div>
      `;
    }
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
          border: var(--border);
          break-inside: avoid;
          display: block;
          width: 100%;
          gap: 0;
          padding: 0;
          border-radius: 12px;
        }

        div.specialist {
          display: flex;
          flex-flow: column;
          padding: 8px 8px;
          cursor: pointer;
          width: 100%;
          gap: 10px;
          margin: 0;
          position: relative;
        }

        div.specialist.selected {
          border: var(--active-border);
          box-shadow: var(--box-shadow);
        }

        div.specialist > div.specialist-content {
          display: flex;
          flex-flow: row nowrap;
          width: 100%;
          gap: 10px;
          margin: 0;
        }

        div.specialist-content > div.avatar {
          display: flex;
          gap: 0;
          align-items: center;
          justify-content: center;
          position: relative;
          height: 65px;
          width: 65px;
          min-height: 65px;
          min-width: 65px;
          border-radius: 50%;
          border: var(--action-border);
          border-width: 2px;
          padding: 4px;
          margin: 0;
        }

        div.specialist-content > div.avatar > img {
          width: 57px;
          height: 57px;
          border-radius: 50%;
          object-fit: cover;
          object-position: center;
        }

        div.specialist-content > div.avatar > span.verified {
          pointer-events: none;
          position: absolute;
          bottom: 0;
          right: -10px;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
        }

        div.specialist-content > div.avatar > span.verified > svg {
          width: 30px;
          height: 30px;
          margin-bottom: -1px;
          display: flex;
          justify-content: center;
          color: var(--background);
          align-items: center;
        }

        div.specialist-content > div.avatar > span.verified > svg > path#top {
          color: var(--background);
          fill: var(--background);
        }

        div.specialist-content > div.info {
          display: flex;
          flex-flow: column;
          align-items: flex-start;
          justify-content: start;
          gap: 5px;
          margin: 0;
          padding: 3px 0 0;
        }

        div.specialist-content > div.info > div.name {
          display: flex;
          flex-flow: column;
          align-items: flex-start;
          justify-content: center;
          gap: 0;
          margin: 0;
          padding: 0;
        }

        div.specialist-content > div.info > div.name > span.name {
          font-size: 1rem;
          display: inline-block;
          width: 100%;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          margin: 0;
          line-height: 1.1;

          /* truncate after 0ne line */
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        div.specialist-content > div.info > div.name > span.title {
          font-size: 0.9rem;
          font-weight: 400;
          display: inline-block;
          width: 100%;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          margin: 0;

          /* truncate after 0ne line */
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        div.specialist-content > div.info > div.bottom {
          display: flex;
          flex-flow: column;
          gap: 10px;
          width: 100%;
          margin: 0;
          padding: 0;
        }

        div.specialist-content > div.info > div.bottom > span.rating {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: flex-start;
          gap: 0;
          margin: 0;
          padding: 0;
        }

        div.specialist-content > div.info > div.bottom > span.rating > svg {
          width: 15px;
          height: 15px;
          display: inline-block;
          margin-right: 3px;
          margin-top: -1px;
          vertical-align: middle;
          color: var(--anchor-color);
        }

        div.specialist-content > div.info > div.bottom > span.rating > span.number {
          font-size: 1rem;
          font-weight: 500;
          color: var(--anchor-color);
          font-family: var(--font-read), sans-serif;
          margin: 0;
        }

        div.specialist-content > div.info > div.bottom > span.rating > span.sp {
          font-size: 1.2rem;
          font-weight: 400;
          display: inline-block;
          margin-top: 2px;
          padding: 0 5px;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
        }

        div.specialist-content > div.info > div.bottom > span.rating > span.reviews {
          font-size: 1rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          margin: 0;
        }

        div.specialist > span.rate {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: flex-start;
          gap: 5px;
          margin: 0;
          padding: 0;
        }

        div.specialist > span.rate > span.price {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: flex-start;
          gap: 5px;
          margin: 0;
          padding: 0;
        }

        div.specialist > span.rate > span.price > span.currency {
          color: var(--anchor-color);
          display: inline-block;
          font-size: 1rem;
          font-family: var(--font-read), sans-serif;
          font-weight: 600;
        }

        div.specialist > span.rate > span.price > span.amount {
          color: var(--text-color);
          display: inline-block;
          font-size: 1rem;
          font-family: var(--font-read), sans-serif;
          font-weight: 600;
        }

        div.specialist > span.rate > span.separator {
          color: var(--gray-color);
          display: inline-block;
          font-size: 1rem;
          font-family: var(--font-read), sans-serif;
          margin: 0;
        }

        div.specialist > span.rate > span.duration {
          color: var(--gray-color);
          display: inline-block;
          font-size: 1rem;
          font-family: var(--font-read), sans-serif;
          font-weight: 500;
          letter-spacing: 0.2px;
        }

        /* checkbox for selecting specialist */
        div.specialist > span.checkbox-round {
          position: absolute;
          right: -8px;
          top: -7px;
          color: var(--background);
          z-index: 1;
          background: var(--white-color);
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        div.specialist > span.checkbox-round > svg {
          width: 20px;
          height: 20px;
          color: var(--accent-color);
          display: inline-block;
          vertical-align: middle;
        }

        div.buttons {
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: space-between;
          gap: 10px;
          margin: 0;
          padding: 2px  0 0 0;
        }

        .buttons.disabled {
          display: none;
          visibility: hidden;
        }

        .buttons > .button {
          border: var(--border);
          position: relative;
          background: none;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 5px;
          text-transform: capitalize;
          justify-content: center;
          padding: 7px 12px 8px;
          width: max-content;
          min-width: calc(33% - 5px);
          border-radius: 12px;
        }

        .buttons > .button.inquire {
          padding: 8px 12px 9px;
          background: none;
          color: var(--gray-color);
        }

        .buttons > .button.view {
          border: none;
          padding: 8px 12px 9px;
          background: var(--gray-background);
          color: var(--gray-color);
        }

        .buttons > .button.wish {
          background: none;
          color: var(--gray-color);
        }

        .buttons > .button.remove {
          border: var(--error-border);
          background: none;
          color: var(--warn-color);
        }

        .buttons > .button > .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .buttons > .button > .icon svg {
          width: 22px;
          height: 22px;
        }

        .buttons > .button.add.out {
          pointer-events: none;
          opacity: 0.5;
          cursor: not-allowed !important;
        }
        
        @media screen and (max-width: 700px) {
          :host {
            border: unset;
            border-bottom: var(--border);
            break-inside: avoid;
            display: block;
            width: 100%;
            gap: 0;
            padding: 0;
            border-radius: 0;
          }

          div.specialist {
            display: flex;
            flex-flow: column;
            padding: 8px 0;
            cursor: default !important;
            width: 100%;
            gap: 10px;
            margin: 0;
            position: relative;
          }

          div.specialist-content > div.avatar {
            display: flex;
            gap: 0;
            align-items: center;
            justify-content: center;
            position: relative;
            height: 65px;
            width: 65px;
            min-height: 65px;
            min-width: 65px;
            border-radius: 50%;
            border: var(--action-border);
            border-width: 2px;
            padding: 5px;
            margin: 0;
          }

          div.specialist-content > div.avatar > img {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            object-fit: cover;
            object-position: center;
          }

          div.specialist-content > div.avatar > span.verified {
            pointer-events: none;
            position: absolute;
            bottom: 2px;
            right: -10px;
            width: 25px;
            height: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
          }

          div.specialist-content > div.avatar > span.verified > svg {
            width: 30px;
            height: 30px;
            margin-bottom: -1px;
            display: flex;
            justify-content: center;
            color: var(--background);
            align-items: center;
          }

          div.specialist-content > div.avatar > span.verified > svg > path#top {
            color: var(--background);
            fill: var(--background);
          }

          div.specialist-content > div.info {
            display: flex;
            flex-flow: column;
            align-items: flex-start;
            justify-content: flex-end;
            gap: 2px;
            margin: 0;
            padding: 0;
          }

          div.specialist-content > div.info > div.name {
            display: flex;
            flex-flow: column;
            align-items: flex-start;
            justify-content: center;
            gap: 0;
            margin: 0;
            padding: 0;
          }

          div.specialist-content > div.info > div.bottom > span.rating > svg {
            width: 14px;
            height: 14px;
            display: inline-block;
            margin-right: 3px;
            margin-top: -1px;
            vertical-align: middle;
            color: var(--anchor-color);
          }

          div.buttons {
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: flex-start;
            gap: 10px;
            margin: 0;
            padding: 2px  0 0 0;
          }

          .buttons.disabled {
            display: none;
            visibility: hidden;
          }

          .buttons > .button {
            border: var(--border);
            position: relative;
            background: none;
            color: var(--gray-color);
            font-family: var(--font-main), sans-serif;
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            flex-flow: row;
            align-items: center;
            gap: 5px;
            text-transform: capitalize;
            justify-content: center;
            padding: 6px 12px;
            width: max-content;
            min-width: 70px;
            border-radius: 12px;
          }

          .buttons > .button.inquire {
            padding: 7px 12px;
            background: none;
            color: var(--gray-color);
          }

          .buttons > .button.view {
            border: none;
            padding: 7px 12px;
            background: var(--gray-background);
            color: var(--gray-color);
          }

          .buttons > .button.wish {
            background: none;
            color: var(--gray-color);
          }

          .buttons > .button.remove {
            border: var(--error-border);
            background: none;
            color: var(--warn-color);
          }

          .buttons > .button > .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
          }

          .buttons > .button > .icon svg {
            width: 22px;
            height: 22px;
          }

          .buttons > .button.add.out {
            pointer-events: none;
            opacity: 0.5;
            cursor: not-allowed !important;
          }
        }
      </style>
    `;
  }
}