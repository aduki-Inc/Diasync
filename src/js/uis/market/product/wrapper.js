export default class ProductWrapper extends HTMLDivElement {
  constructor() {
    super();
    this.app = window.app;
    this.shadowObj = this.attachShadow({ mode: 'open' });
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.quantity = this.number.parseInteger(this.getAttribute('quantity'));
    this.inCart = this.number.parseInteger(this.getAttribute('in-cart'));
    this.price = this.number.parse(this.getAttribute('price'));
    this.lastPrice = this.number.parse(this.getAttribute('last'));
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // initialize cart
    this.initializeCart();

    // activate wish button
    this.activateWishButton();
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

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `
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

  // Todo: Fix mobile prices when number is 1k or more
  getBody() {
    const ratingsInt = this.number.parseInteger(this.getAttribute('reviews'))
    const reviews = this.number.shorten(ratingsInt)
    let ratingsText = ratingsInt > 1 ? `${reviews} reviews` : `${reviews} review`
    if (ratingsInt < 1) ratingsText = `No reviews yet`
    return /* html */`
      <div class="image">
        ${this.getOffer()}
				<img src="${this.getAttribute('product-image')}" alt="Product" srcset="">
			</div>
			<div class="details">
        <div class="content">
          <span class="review">
            <span class="number">${this.getAttribute('average-review')}</span>
            <span class="sp">•</span>
            <span class="people">${ratingsText}</span>
          </span>
        </div>
        <div class="name">
          <span class="name">${this.getAttribute('name')}</span>
          <span class="store">${this.getAttribute('store')}</span>
        </div>
				<div class="price">
          <span class="value">
            <span class="currency">Ksh</span>
            <span class="price">${this.number.balanceWithCommas(this.getAttribute("price"))}</span>
          </span>
          ${this.getWasPrice()}
        </div>
        <span class="country-info">
          <span class="text">Local dispatch from ${this.getAttribute('store-country')}</span>
        </span>
				<!-- Button Box -->
        ${this.getButtons()}
			</div>
    `
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

  getAddedToCartButton = () => {
    let added = this.inCart > 0;

    // if quantity is 0 return out of stock
    if (this.quantity === 0 || this.quantity < 1) {
      return {
        html: /* html */`
          <span class="text">Out of Stock</span>
        `,
        class: 'out'
      };
    }

    if (added) {
      return {
        html: /* html */`
          <span class="icon remove">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M20 12L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="quantity">${this.inCart}</span>
          <span class="icon add">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M12 4V20M20 12H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        `,
        class: 'added'
      };
    } else {
      return {
        html: /* html */`
          <span class="text">Buy</span>
        `,
        class: ''
      };
    }
  }

  initializeCart = () => {
    const content = this.shadowObj.querySelector('.buttons > button.add');
    if (!content) return;

    // add event listener to add button
    content.addEventListener('click', e => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      // if quantity is 0 return
      if (this.quantity === 0 || this.quantity < 1) return;

      // if added to cart
      if (this.quantity > 0) {
        // update the cart
        this.inCart += 1;

        // add the added button and remove the add button
        content.innerHTML = this.getAddedToCartButton(true).html;

        //add class to the button
        content.classList.add('added');

        // increment cart
        this.incrementCart(content);
        return;
      }
    }, { once: true });
  }

  incrementCart = (content) => {
    const quantity = this.quantity;

    // select plus and minus buttons
    const plusBtn = content.querySelector('.icon.add');
    const minusBtn = content.querySelector('.icon.remove');
    const quantityText = content.querySelector('.quantity');

    // add event listener to plus button
    plusBtn.addEventListener('click', e => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      const current = parseInt(quantityText.textContent);
      if (current >= quantity) return;
      quantityText.textContent = current + 1;

      this.inCart += 1;
    });

    // add event listener to minus button
    minusBtn.addEventListener('click', e => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      const current = parseInt(quantityText.textContent);
      if (this.inCart === 0 || current <= 1) {
        this.inCart = 0;
        // remove the added button and add add button
        content.innerHTML = this.getAddedToCartButton(false).html;

        // remove class from the button
        content.classList.remove('added');

        // activate the add button
        this.initializeCart();
        return;
      } else {
        quantityText.textContent = current - 1;
        this.inCart -= 1;
      }
    });
  }

  getWishedButton = wished => {
    wished = wished === 'true';
    if (wished) {
      return {
        html: /* html */`
          <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"  color="currentColor">
          <path d="M11.9553 3.70845L11.9997 3.7438L12.044 3.70846C12.4134 3.41639 12.9531 3.05089 13.636 2.75875C15.0217 2.16591 16.9799 1.88758 19.2119 3.08156C21.9945 4.57002 23.3601 8.13311 22.4862 11.8026C21.6023 15.5144 18.4614 19.3368 12.2626 21.6518L11.9997 21.75L11.7367 21.6518C5.53788 19.3368 2.39701 15.5144 1.51304 11.8026C0.639129 8.13311 2.00471 4.57002 4.78724 3.08155C7.01925 1.88756 8.97747 2.16591 10.3632 2.75874C11.0461 3.05088 11.5858 3.41638 11.9553 3.70845Z" fill="currentColor"></path>
          </svg>
          </div>
        `,
        class: 'wished'
      };
    } else {
      return {
        html: /* html */`
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </div>
        `,
        class: ''
      };
    }
  }

  activateWishButton = () => {
    const content = this.shadowObj.querySelector('.buttons > button.wish');
    if (!content) return;

    // add event listener to wish button
    content.addEventListener('click', e => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      // if wished
      if (content.classList.contains('wished')) {
        // remove the wished button and add wish button
        content.innerHTML = this.getWishedButton('false').html;

        // remove class from the button
        content.classList.remove('wished');
        this.app.showToast(true, 'Removed from wishlist');
        return;
      } else {
        // add the wished button and remove the wish button
        content.innerHTML = this.getWishedButton('true').html;

        //add class to the button
        content.classList.add('wished');
        this.app.showToast(true, 'Added to wishlist');
        return;
      }
    });
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
          min-width: 250px;
          gap: 0;
          padding: 0;
          border-radius: 8px;
        }

        .image {
          background-color: var(--gray-background);
          height: 180px;
          width: 100%;
          max-width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          border-top-left-radius: 7px;
          border-top-right-radius: 7px;
        }

        .image img {
          height: 100%;
          width: 100%;
          object-fit: cover;
          filter: var(--image-dimming);
        }

        .image .offer {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          background: var(--rating-linear);
          font-family: var(--font-main), sans-serif;
          font-weight: 600;
          color: var(--white-color);
          opacity: 0.9;
          padding: 5px 10px;
          border-bottom-right-radius: 7px;
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
          font-size: 1rem;
          line-height: 1.4;
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
          padding: 10px 0 0 0;
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
          padding: 8px 15px;
          width: max-content;
          border-radius: 12px;
        }

        .buttons > .button.add {
          display: flex;
          padding: 8px 15px;
          width: calc(50% - 5px);
          min-width: calc(50% - 5px);
          border-radius: 12px;
        }

        .buttons > .button.view {
          width: calc(50% - 5px);
          padding: 9px 15px;
          min-width: calc(50% - 5px);
          background: var(--gray-background);
          color: var(--gray-color);
        }

        .buttons > .button.wish {
          border: var(--action-border);
          background: none;
          color: var(--gray-color);
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
          padding: 8px 15px;
          cursor: not-allowed !important;

          /* prevent text from overflowing */
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 0.85rem;
        }

        .buttons > .button.added {
          background: none;
          padding: 7px 20px;
          width: calc(50% - 5px);
          min-width: calc(50% - 5px);
          color: var(--accent-color);
          border: var(--border);
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
          gap: 5px;
        }

        .buttons > .button.added > .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: inherit;
        }

        .buttons > .button.added > .icon.remove  {
          color: var(--warn-color);
        }

        .buttons > .button.added > .icon svg {
          width: 18px;
          height: 18px;
        }

        .buttons > .button.added > .quantity {
          color: inherit;
          font-size: 0.9rem;
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
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

          .image {
            height: 150px;
          }

          .details > .content .review {
            width: 100%;
            padding: 0;
            margin: 0 -2px 0 -2px;
            color: var(--gray-color);
            display: flex;
            align-items: center;
            justify-content: start;
            gap: 3px;
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
            font-family: var(--font-main), sans-serif;
            font-size: 1rem;
            font-weight: 500;
          }

          .details > .content .review .people {
            color: var(--gray-color);
            font-family: var(--font-read), sans-serif;
            font-size: 1rem;
            font-weight: 400;
          }

          .details p.name {
            font-size: 1rem;
          }

          .details div.price span.value span.currency {
            font-size: 1rem;
          }

          .details div.price span.value span.price {
            font-size: 1.2rem;
          }

          .details p.price {
            font-size: 1.2rem;
          }

          .details > .buttons {
            gap: 10px;
          }

          .buttons > .button {
            font-size: 0.85rem;
            padding: 5px 10px;
            height: 30px;
          }

          .buttons > .button.add {
            width: calc(100% - 30px);
            padding: 5px 5px;
            border: none;
          }

          .buttons > .button.add > span.text {
            font-size: 0.8rem;
            font-weight: 500;
            font-family: var(--font-read), sans-serif;

            /* prevent overflow add ellipsis */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .buttons > .button.view {
            padding: 1px 10px;
          }

          .buttons > .button.wish > .icon svg {
            width: 20px;
            height: 20px;
          }

          .buttons > .button.added {
            width: calc(100% - 30px);
            background: none;
            padding: 5px 10px;
            color: var(--accent-color);
            border: var(--action-border);
            display: flex;
            flex-flow: row;
            align-items: center;
            justify-content: space-between;
            gap: 5px;
          }

          .buttons > .button.added > .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            color: inherit;
          }

          .buttons > .button.added > .icon.remove  {
            color: var(--warn-color);
          }

          .buttons > .button.added > .icon svg {
            width: 20px;
            height: 20px;
          }
        }
        /* Todo: This one changed */
        @media (max-width: 450px) {
          :host {
            border: var(--border);
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
            gap: 0;
            padding: 0;
            width: 175px;
            max-width: 175px;
            min-width: 175px;
            border-radius: 8px;
          }
        }
      </style>
    `
  }
}