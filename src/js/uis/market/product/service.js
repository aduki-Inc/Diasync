export default class ServiceWrapper extends HTMLDivElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: 'open' });
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.price = this.number.parse(this.getAttribute('price'));
    this.lastPrice = this.number.parse(this.getAttribute('last'));
    this.render();
  }

  connectedCallback() {
    this.activateActions();
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

  calculateDiscount = (current, last) => {
    if (current === last || current > last) return 0;

    // if current is less than last > calculate discount: 2 decimal places if available
    const discount = ((last - current) / last) * 100;

    // if discount is a whole number return it
    if (discount % 1 === 0) return discount;

    // if discount is not a whole number return it with 2 decimal places
    return discount.toFixed(2);
  }

  getOffer = () => {
    const discount = this.number.parse(this.calculateDiscount(this.price, this.lastPrice));
    if (discount === 0 || discount < 1) return '';
    return /* html */`
      <div class="offer">
        <span class="discount">${discount}% Off</span>
      </div>
    `;
  }

  getWasPrice = () => {
    if (this.price === this.lastPrice || this.price > this.lastPrice) return '';
    return /* html */`
      <span class="was">
        <span class="strike"></span>
        <span class="currency">Ksh</span>
        <span class="price">${this.number.shorten(this.lastPrice)}</span>
      </span>
    `;
  }

  getTemplate() {
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody() {
    const ratingsInt = this.number.parseInteger(this.getAttribute('reviews'))
    const reviews = this.number.shorten(ratingsInt)
    let ratingsText = ratingsInt > 1 ? `${reviews} reviews` : `${reviews} review`
    if (ratingsInt < 1) ratingsText = `No reviews yet`
    return /* html */`
      <div class="details">
        ${this.getInfo()}
        <div class="content">
          <span class="review">
            <span class="number">${this.getAttribute('average-review')}</span>
            <span class="sp">•</span>
            <span class="people">${ratingsText}</span>
          </span>
        </div>
        <p class="description">${this.getAttribute('description')}</p>
				<div class="price">
          <span class="value">
            ${this.getPrice(this.price)}
          </span>
          ${this.getWasPrice()}
        </div>
        <!-- Button Box -->
        ${this.getActions()}
			</div>
    `;
  }

  getInfo() {
    return /* html */`
      <div class="name">
        <span class="name">${this.getAttribute('name')}</span>
        <span class="store">${this.getAttribute('store-name')}</span>
      </div>
    `;
  }

  getPrice = (price) => {
    if (price < 1) {
      return /* html */`
        <span class="free">Free</span>
      `;
    }
    return /* html */`
      <span class="currency">Ksh</span>
      <span class="price">${this.number.balanceWithCommas(price)}</span>
    `;
  }

  getActions = () => {
    return /* html */`
      <div class="buttons">
        <button class="button book">Book</button>
        <button class="button inquire">Inquire</button>
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
          border: var(--border);
          break-inside: avoid;
          margin-bottom: 10px;
          display: block;
          width: 100%;
          gap: 0;
          padding: 5px;
          border-radius: 8px;
        }

        .details {
          width: 100%;
          padding: 10px;
          display: flex;
          flex-flow: column;
          align-items: start;
          justify-content: center;
          gap: 0px;
        }

        .details > .content {
          width: 100%;
          padding: 0;
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 5px;
        }

        .details > .content .review {
          width: 100%;
          padding: 0;
          margin: 0 0 0 1px;
          color: var(--gray-color);
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 4px;
        }

        .details > .content .review .sp {
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
          font-size: 1.3rem;
          font-weight: 500;
          display: inline-block;
          margin-top: 2px;
        }

        .details > .content .review .number {
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          font-size: 1rem;
          font-weight: 500;
        }

        .details > .content .review svg {
          color: var(--rating-color);
          margin: -1.5px 0 0 0;
          width: 15px;
          height: 15px;
        }

        .details > .content .review .people {
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          font-size: 1rem;
          font-weight: 500;

          /* prevent overflow add ellipsis */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .details div.name {
          width: 100%;
          display: flex;
          align-items: start;
          flex-flow: column;
          gap: 0;
          margin: 0;
          padding: 0;
        }

        .details div.name span.name {
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          width: 100%;
          font-weight: 500;
          font-size: 1.2rem;
          line-height: 1;
          display: inline-block;
          padding: 0 0 2px 0;
          cursor: pointer;

          /* prevent overflow add ellipsis after 2 lines */
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          -webkit-box-pack: start;
        }

        .details div.name span.store {
          width: 100%;
          display: inline-flex;
          padding: 2px 0;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          /* prevent overflow add ellipsis after 2 lines */
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          -webkit-box-pack: start;
        }

        .details p.name > a {
          text-decoration: none;
          color: inherit;
        }

        .details p.name:hover {
          color: var(--anchor-color);
        }

        .details p.description {
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          font-size: 0.97rem;
          font-weight: 400;
          line-height: 1.4;
          margin: 5px 0;
        }

        .details div.price {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 10px 0 0 0;
          padding: 0;
        }

        .details div.price span.value {
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 5px;
        }

        .details div.price span.free {
          color: var(--anchor-color);
          font-size: 1.15rem;
          font-family: var(--font-text), sans-serif;
          font-weight: 600;
          letter-spacing: 0.2px;
        }

        .details div.price span.value span.currency {
          color: var(--anchor-color);
          display: inline-block;
          /* margin: -2px 0 0 0; */
          font-size: 1.15rem;
          font-family: var(--font-text), sans-serif;
          font-weight: 600;
          letter-spacing: 0.2px;
        }

        .details div.price span.value span.price {
          color: var(--anchor-color);
          font-size: 1.15rem;
          font-family: var(--font-main), sans-serif;
          font-weight: 600;
          letter-spacing: 0.2px;
        }

        .details div.price > .was {
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 2px;
          margin: 0;
          padding: 0;
          position: relative;
        }

        .details div.price > .was > span.strike {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: -5px;
          right: -5px;
          height: 1px;
          border-radius: 2px;
          background: var(--text-color);
          margin: 0;
          padding: 0;
        }

        .details div.price > .was span.currency {
          color: var(--gray-color);
          font-size: 0.9rem;
          font-family: var(--font-text), sans-serif;
          font-weight: 500;
          display: inline-block;
        }

        .details div.price > .was span.price {
          color: var(--gray-color);
          font-size: 0.9rem;
          font-family: var(--font-main), sans-serif;
          font-weight: 500;
        }

        .details span.country-info {
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 3px;
          margin: 0;
          padding: 5px 0;
          color: var(--gray-color);
          width: 100%;
        }

        .details span.country-info svg {
          width: 16px;
          height: 16px;
          color: var(--accent-color);
        }

        .details span.country-info .text {
          color: var(--gray-color);
          font-size: 0.97rem;
          font-family: var(--font-read), sans-serif;
          font-weight: 400;
        }

        .details > .buttons {
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: space-between;
          gap: 10px;
          margin: 0;
          padding: 15px 0 0 0;
        }

        .buttons.disabled {
          display: none;
          visibility: hidden;
        }

        .buttons > .button {
          border: none;
          position: relative;
          background: var(--accent-linear);
          color: var(--white-color);
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
          padding: 9px 12px 10px;
          width: max-content;
          min-width: calc(50% - 5px);
          border-radius: 12px;
        }

        .buttons > .button.inquire {
          width: calc(50% - 5px);
          min-width: calc(50% - 5px);
          padding: 8px 12px 9px;
          border: var(--action-border);
          background: none;
          color: var(--gray-color);
        }

        .buttons > .button.wish {
          border: var(--action-border);
          background: none;
          color: var(--gray-color);
          padding: 5px 12px 4px;
        }

        .buttons > .button.wish.wished {
          color: var(--rating-color);
          border: var(--rating-border);
          /* background: var(--rating-background); */
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

        @media (max-width: 700px) {
          .service-footer { gap: 8px; }
          .action { gap: 6px; }
        }
      </style>
    `;
  }
}