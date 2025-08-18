export default class ProductWrapper extends HTMLDivElement {
  constructor() {

    // We are not even going to touch this.
    super();
    this.app = window.app;
    // lets create our shadow root
    this.shadowObj = this.attachShadow({ mode: 'open' });
    this.utils = window.app.utils;
    this.quantity = this.utils.number.parseInteger(this.getAttribute('quantity'));
    this.inCart = this.utils.number.parseInteger(this.getAttribute('in-cart'));
    this.price = this.utils.number.parse(this.getAttribute('price'));
    this.lastPrice = this.utils.number.parse(this.getAttribute('last'));
    this.storeCountry = this.getAttribute('store-country');
    this.userCountry = this.getCountryCode();
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  getCountryCode = () => {
    // get country from local storage
    const country = localStorage.getItem('country');
    if (!country) return 'KE';

    // get the country code
    return country.countryCode;
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
    const discount = this.utils.number.parse(this.calculateDiscount(this.price, this.lastPrice));
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
        <span class="currency">乇</span>
        <span class="price">${this.utils.number.shorten(this.lastPrice)}</span>
      </span>
    `;
  }

  // Todo: Fix mobile prices when number is 1k or more
  getBody() {
    const ratingsInt = this.utils.number.parseInteger(this.getAttribute('reviews'))
    const reviews = this.utils.number.shorten(ratingsInt)
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="number">${this.getAttribute('average-review')}</span>
            <span class="sp">•</span>
            <span class="people">${ratingsText}</span>
          </span>
        </div>
        <div class="name">
          <span class="name">${this.getAttribute('name')}</span>
          <span class="store">
            <span class="by">by</span>
            <span class="store-name">${this.getAttribute('store')}</span>
          </span>
        </div>
				<div class="price">
          <span class="value">
            <span class="currency">乇</span>
            <span class="price">${this.utils.number.balanceWithCommas(this.getAttribute("price"))}</span>
          </span>
          ${this.getWasPrice()}
        </div>
        ${this.checkCountry()}
				<!-- Button Box -->
        ${this.getButtons()}
			</div>
    `
  }

  // check if store and user are within the same country
  checkCountry = () => {
    const isSameCoutry = this.storeCountry.toLowerCase() === this.userCountry.toLowerCase();

    if (isSameCoutry) {
      return /* html */`
        <span class="country-info">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" stroke-width="1.5" />
            <path d="M8 12.5L10.5 15L16 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">Local dispatch</span>
        </span>
      `;
    } else {
      return /* html */`
        <span class="country-info">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M10 9.50003L5.27531 4.47565C4.85705 4.0245 4.92403 3.69496 5.41729 3.40965C6.34454 2.8733 7.06689 2.85873 8.04428 3.39511L12.949 6.08675C13.2982 6.27836 13.6406 6.47259 14 6.57855" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12.5 13.6632L14.6103 20.4697C14.7826 21.0255 15.086 21.1263 15.556 20.8568C16.4396 20.3501 16.7958 19.765 16.8197 18.7107L16.9395 13.4198C16.9555 12.7131 16.9526 12.0215 17.5 11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8.32846 10.9843L10.2154 9.60557L14.6377 6.38136L14.6416 6.37851L14.6491 6.37301C14.7535 6.29661 16.3094 5.16238 17.1919 4.77581C18.2765 4.30067 19.2869 4.52156 20.3739 4.82515C20.9362 4.98218 21.2173 5.06069 21.4202 5.20717C21.742 5.43958 21.9513 5.79728 21.9943 6.18852C22.0215 6.4351 21.9498 6.71459 21.8065 7.27356L21.8065 7.27358C21.5294 8.35431 21.2181 9.32819 20.2588 10.0175C19.4782 10.5784 17.7045 11.341 17.5856 11.3919L17.5771 11.3955L17.5726 11.3974L12.5317 13.5645L10.3782 14.4876L10.3782 14.4876C9.5974 14.8223 9.207 14.9896 8.94139 15.3002C8.31933 16.0275 8.23148 17.3438 7.99931 18.2494C7.87101 18.7498 7.16748 19.6171 6.54058 19.4869C6.15355 19.4065 6.14613 18.922 6.09796 18.6131L5.6342 15.6389C5.5233 14.9276 5.51479 14.9131 4.94599 14.4627L2.56757 12.5793C2.32053 12.3836 1.89903 12.135 2.022 11.7641C2.22119 11.1633 3.33408 10.9957 3.83747 11.1363C4.74834 11.3907 5.94747 11.9738 6.89684 11.8058C7.3022 11.7341 7.64428 11.4842 8.32844 10.9843L8.32846 10.9843Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">Global dispatch</span>
        </span>
      `;
    }
  }

  getButtons = () => {
    const { html, class: className } = this.getAddedToCartButton(this.getAttribute('in-cart'));
    const { html: wishHtml, class: wishClass } = this.getWishedButton(this.getAttribute('wished'));
    return /* html */`
      <div class="buttons">
        <button class="button add ${className}">${html}</button>
        <button class="button wish ${wishClass}">${wishHtml}</button>
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
          <span class="text">Add to Cart</span>
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
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding: 0;
          width: 250px;
          min-width: 250px;
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
          margin: 0 -2px 0 -2px;
          color: var(--gray-color);
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 4px;
        }

        .details > .content .review .sp {
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
          font-size: 1.5rem;
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
          width: 100%;
          font-weight: 500;
          font-size: 1.1rem;
          line-height: 1.4;
          cursor: pointer;

          /* prevent overflow add ellipsis */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .details div.name span.store {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 3px;
          margin: 0;
          padding: 0;
        }

        .details div.name span.store span.by {
          color: var(--gray-color);
          font-size: 0.9rem;
          font-weight: 400;
          font-family: var(--font-mono), monospace;
        }

        .details div.name span.store span.store-name {
          width: calc(100% - 20px);
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          cursor: pointer;

          /* prevent overflow add ellipsis */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
          justify-content: space-between;
          gap: 7px;
          margin: 10px 0 0 0;
          padding: 0;
        }

        .details div.price span.value {
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 8px;
        }

        .details div.price span.value span.currency {
          color: var(--anchor-color);
          display: inline-block;
          margin: -2px 0 0 0;
          font-size: 1.12rem;
          font-family: var(--font-text), sans-serif;
          font-weight: 700;
          letter-spacing: 0.2px;
        }

        .details div.price span.value span.price {
          color: var(--anchor-color);
          font-size: 1.32rem;
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
          font-size: 1rem;
          font-family: var(--font-text), sans-serif;
          font-weight: 500;
          display: inline-block;
          margin: -2px 0 0 0;
        }

        .details div.price > .was span.price {
          color: var(--gray-color);
          font-size: 1rem;
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
          gap: 15px;
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
          height: 35px;
          text-transform: capitalize;
          justify-content: center;
          padding: 5px 12px 6px;
          width: max-content;
          border-radius: 12px;
        }

        .buttons > .button.add {
          display: flex;
          padding: 8px 20px;
          width: cal(100% - 70px);
          min-width: calc(100% - 70px);
          border-radius: 12px;
        }

        .buttons > .button.view {
          padding: 5px 15px;
          border: var(--action-border);
          background: none;
          color: var(--gray-color);
        }

        .buttons > .button.wish {
          border: var(--action-border);
          background: none;
          color: var(--gray-color);
          padding: 5px 15px 4px;
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

        .buttons > .button.added {
          background: none;
          padding: 8px 20px;
          width: cal(100% - 70px);
          min-width: calc(100% - 70px);
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

        .buttons > .button.added > .quantity {
          color: inherit;
          font-size: 1.15rem;
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

  // Todo: Add a method to calculate the discount percentage
}