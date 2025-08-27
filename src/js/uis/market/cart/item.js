export default class CartItem extends HTMLDivElement {
  constructor() {
    super();
    this.getTotal = this.getTotal.bind(this);
    this.shadowObj = this.attachShadow({ mode: 'open' });
    this.host = this.getRootNode().host;
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.quantity = this.number.parseInteger(this.getAttribute('quantity'));
    this.price = this.number.parse(this.getAttribute('price'));
    this.stock = this.number.parseInteger(this.getAttribute('stock'));
    this.selected = true;
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    this.calculateTotal(this.quantity, this.price)
    this.activateButtons();
    this.removeItem();
    this.incrementQuantity();
    this.updateRootTotal();
    this.listenToCheckbox();
  }

  listenToCheckbox = () => {
    const checkbox = this.shadowObj.querySelector('div.side-info input[type="checkbox"]');
    if (checkbox) {
      checkbox.addEventListener('change', e => {
        this.selected = e.target.checked;
        this.host.setAttribute('changed', 'true');
      });
    }
  }

  updateRootTotal = () => {
    const total = this.getTotal();

    // if stock is less than 0, return
    if (this.stock <= 0 || !this.selected) return;

    this.host.setAttribute('changed', 'true');
  }

  getTotal = () => {
    // if stock is less than 0, return
    if (this.stock <= 0 || !this.selected) return 0.00;
    return (this.quantity * this.price);
  }

  incrementQuantity = () => {
    const wrapper = this.shadowObj.querySelector('div.quantity-wrapper');
    const quantity = wrapper.querySelector('.quantity');

    // check if stock is available, less than or equal to 0
    if (this.stock <= 0) {
      return;
    }

    // check if button is available
    if (wrapper && quantity) {
      // select add and remove buttons
      const add = wrapper.querySelector('button.add');
      const remove = wrapper.querySelector('button.remove');

      // add event listener to add button
      add.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()

        // get total ammount
        const total = this.quantity * this.price;

        // if quantity + 1 is greater than stock
        const test = this.quantity + 1;
        if (test > this.stock) {
          return;
        }

        // increment quantity
        quantity.textContent = test;
        this.quantity = test;
        this.setAttribute('quantity', this.quantity);

        // calculate total
        this.calculateTotal(this.quantity, this.price)

        // update root host
        this.host.setAttribute('changed', 'true')
      });

      // add event listener to remove button
      remove.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()

        // get total ammount
        const total = this.quantity * this.price;

        // if quantity - 1 is less than 1
        const test = this.quantity - 1;
        if (test < 1) {
          return;
        }

        // decrement quantity
        quantity.textContent = test;
        this.quantity = test;

        this.setAttribute('quantity', this.quantity)

        // calculate total
        this.calculateTotal(this.quantity, this.price)

        // update root host
        this.host.setAttribute('changed', 'true')
      });
    }
  }

  getTemplate() {
    return /* html */`
      ${this.getBody()}
      ${this.getStyles()}
    `
  }

  getBody() {
    const out = this.stock <= 0 ? 'out' : '';
    const outChecked = this.stock <= 0 ? 'disabled' : 'checked';
    return /* html */`
      <div class="info">
        <div class="side-info">
          <div class="round">
            <input type="checkbox" id="checkbox-18" ${outChecked}>
            <label for="checkbox-18"></label>
          </div>
          <div class="store">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M3.50002 10V15C3.50002 17.8284 3.50002 19.2426 4.3787 20.1213C5.25738 21 6.67159 21 9.50002 21H14.5C17.3284 21 18.7427 21 19.6213 20.1213C20.5 19.2426 20.5 17.8284 20.5 15V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M17 7.50184C17 8.88255 15.8807 9.99997 14.5 9.99997C13.1193 9.99997 12 8.88068 12 7.49997C12 8.88068 10.8807 9.99997 9.50002 9.99997C8.11931 9.99997 7.00002 8.88068 7.00002 7.49997C7.00002 8.88068 5.82655 9.99997 4.37901 9.99997C3.59984 9.99997 2.90009 9.67567 2.42 9.16087C1.59462 8.2758 2.12561 6.97403 2.81448 5.98842L3.20202 5.45851C4.08386 4.2527 4.52478 3.6498 5.16493 3.32494C5.80508 3.00008 6.55201 3.00018 8.04587 3.00038L15.9551 3.00143C17.4485 3.00163 18.1952 3.00173 18.8351 3.32658C19.475 3.65143 19.9158 4.25414 20.7974 5.45957L21.1855 5.99029C21.8744 6.97589 22.4054 8.27766 21.58 9.16273C21.0999 9.67754 20.4002 10.0018 19.621 10.0018C18.1734 10.0018 17 8.88255 17 7.50184Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M14.9971 17C14.3133 17.6072 13.2247 18 11.9985 18C10.7723 18 9.68376 17.6072 9 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <p class="name">${this.getAttribute('store')}</p>
          </div>
        </div>
        <div class="details">
          <div class="meta-data">
            <div class="image">
              <img src="${this.getAttribute('image-src')}" alt="Product image">
            </div>
            <div class="other">
              <p class="name">${this.getAttribute('name')}</p>
              <span class="store">
                <span class="by">From</span>
                <span class="store-name">${this.getAttribute('location')}</span>
              </span>
              <span class="price">
                <span class="currency">Ksh </span>
                <span class="money">${this.getAttribute('price')}</span>
              </span>
            </div>
          </div>
          <div class="content">
            <div class="quantity-wrapper">
              ${this.checkOutOfStocK(this.stock)}
            </div>
            <div class="ammount ${out}">
              <span class="currency">Ksh</span>
              <span class="no">0</span>
            </div>
            <div class="actions">
              <span class="action view">
                <span class="text">view</span>
              </span>
              <span class="action remove">
                <span class="text">remove</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    `
  }

  checkOutOfStocK = stok => {
    const out = stok <= 0 ? 'out' : '';
    if (stok <= 0) {
      return /* html */`
        <div class="out-of-stock">
          <span class="text">Out of stock</p>
        </div>
      `;
    } else {
      return /* html */`
        <button class="remove ${out}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M20 12L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <span class="quantity">${this.quantity}</span>
        <button class="add">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M12 4V20M20 12H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      `;
    }
  }

  removeItem() {
    const btn = this.shadowObj.querySelector('.actions > .action.remove');
    if (btn) {
      btn.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()

        this.remove();
        this.host.setAttribute('changed', 'true');
      })
    }
  }

  calculateTotal(quantity, price) {
    const total = this.shadowObj.querySelector('.ammount span.no');

    if (total) {
      total.textContent = this.number.balanceWithCommas(quantity * price)
    }
  }

  activateButtons() {
    const self = this
    const no = this.shadowObj.querySelector('.picker span.no');
    const leftNav = this.shadowObj.querySelector('.picker #left-nav');
    const rightNav = this.shadowObj.querySelector('.picker #right-nav');

    if (no && leftNav && rightNav && this.totalAmmount) {
      rightNav.addEventListener('click', (e) => {
        e.preventDefault()
        let total = parseFloat(self.totalAmmount.textContent)
        no.textContent = parseInt(no.textContent) + 1
        self.setAttribute('quantity', no.textContent)
        self.calculateTotal(no.textContent, self.getAttribute('price'))

        self.totalAmmount.textContent = total += parseFloat(self.getAttribute('price'))
      })

      leftNav.addEventListener('click', (e) => {
        let total = parseFloat(self.totalAmmount.textContent)
        if (parseInt(no.textContent) === 1) {
          no.textContent = 1
          self.setAttribute('quantity', no.textContent)
          self.calculateTotal(no.textContent, self.getAttribute('price'))
        }
        else {
          no.textContent = parseInt(no.textContent) - 1
          self.setAttribute('quantity', no.textContent)
          self.calculateTotal(no.textContent, self.getAttribute('price'))

          self.totalAmmount.textContent = total -= parseFloat(self.getAttribute('price'))
        }

      })

    }
  }

  getStyles() {
    return /* css */`
      <style>
        * {
          box-sizing: border-box !important;
        }

        :host {
          /* border-top: var(--border); */
          padding: 0;
          background: var(--item-background);
          width: 100%;
          height: max-content;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        .info {
          display: flex;
          flex-flow: column nowrap;
          gap: 10px;
        }

        .side-info {
          padding: 10px 10px;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          gap: 20px;
          border-bottom: var(--border);
        }

        .side-info .round {
          position: relative;
        }

        .side-info .round label {
          background-color: var(--background);
          border: var(--border);
          border-radius: 50%;
          cursor: pointer;
          height: 22px;
          width: 22px;
          display: block;
        }

        .side-info .round label:after {
          border: 2px solid var(--white-color);
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

        .side-info .round input[type="checkbox"] {
          visibility: hidden;
          display: none;
          opacity: 0;
        }

        .side-info .round input[type="checkbox"]:checked + label {
          background: var(--accent-linear);
           border: var(--action-border);
          border-color: none;
        }

        .side-info .round input[type="checkbox"]:checked + label:after {
          opacity: 1;
        }

        .side-info > div.store {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          gap: 5px;
          font-weight: 500;
          font-size: 1rem;
          color: var(--title-color);
        }

        .side-info > div.store > svg {
          width: 20px;
          height: 20px;
        }

        .side-info > div.store > p {
          margin: 0;
          padding: 0;
          font-size: 1rem;
          color: var(--title-color);

          /* add ellipsis to overflowing text */
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* details */
        div.details {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          width: 100%;
          gap: 5px;
          padding: 0 10px 10px 10px;
        }

        .details .meta-data {
          display: flex;
          width: 100%;
          justify-content: start;
          align-items: start;
          gap: 10px;
        }

        .details .meta-data .image {
          width: 80px;
          height: 80px;
          min-width: 80px;
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 5px;
        }

        .details .meta-data .image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .details .meta-data .other {
          display: flex;
          flex-flow: column;
          align-items: start;
          justify-content: space-between;
          gap: 5px;
          padding: 3px 0;
          width: calc(100% - 130px);
          max-width: calc(100% - 130px);
        }

        .details .meta-data .other p.name {
          margin: 0;
          padding: 0;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-color);
          text-align: start;
          width: 100%;
          /* add ellipsis */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .details .meta-data .other .store {
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 5px;
          width: 100%;
          min-width: 100%;
          font-weight: 400;
        }

        .details .meta-data .other .store > .by {
          font-size: 1rem;
          font-family: var(--font-mono), monospace;
        }

        .details .meta-data .other .store .store-name {
          font-size: 1rem;
          font-family: var(--font-read), sans-serif;
          /* add ellipsis */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .details .meta-data .other .price {
          font-weight: 500;
          color: var(--teext-color);
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .details .meta-data .other .price * {
          color: inherit;
        }

        .details .meta-data .other .price .currency {
          font-size: 1.35rem;
          font-weight: 600;
          display: inline-block;
          margin: 0;
        }

        .details .meta-data .other .price .money {
          font-size: 1.35rem;
          font-weight: 600;
          display: inline-block;
          margin: 0;
        }


        .quantity-wrapper {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: center;
          gap: 5px;
          height: max-content;
          margin: 0;
        }

        .quantity-wrapper > button {
          border: none;
          position: relative;
          color: var(--white-color);
          font-family: var(--font-main), sans-serif;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          flex-flow: row;
          align-items: center;
          color: var(--text-color);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: inherit;
          gap: 5px;
          width: 35px;
          padding: 5px 12px;
        }

        .quantity-wrapper > button > svg {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          width: 24px;
          height: 24px;
        }

        .quantity-wrapper button.add.out {
          pointer-events: none;
          opacity: 0.5;
          cursor: not-allowed !important;
        }

        .quantity-wrapper button.add {
          background: var(--gray-background);
          width: max-content;
          color: var(--accent-color);
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: space-between;
          gap: 5px;
        }

        .quantity-wrapper button.remove  {
          color: var(--warn-color);
          background: var(--warn-background);
        }

        .quantity-wrapper button svg {
          width: 16px;
          height: 16px;
        }

        .quantity-wrapper > .quantity {
          color: inherit;
          font-size: 1rem;
          font-weight: 500;
          width: 40px;
          font-family: var(--font-main), sans-serif;
        }

        .quantity-wrapper .out-of-stock {
          margin: 2px 0 0 0;
          border-radius: 12px;
          color: var(--warn-color);
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
          font-weight: 500;
        }

        .quantity-wrapper .out-of-stock .text {
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .content {
          margin: 0;
          width: 100%;
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .ammount {
          font-weight: 600;
          color: var(--title-color);
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .ammount.out {
          color: var(--warn-color) !important;
        }

        .ammount .currency {
          font-size: 1.35rem;
          font-weight: 600;
          display: flex;
          margin: 0;
        }

        .ammount .no {
          font-size: 1.35rem;
          font-weight: 600;
          display: inline-block;
          margin: 0;
        }
        
        .actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .actions .action {
          /* border: var(--border); */
          background: var(--gray-background);
          padding: 7px 15px;
          color: var(--gray-color);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-size: 0.95rem;
          font-family: var(--font-read), sans-serif;
          cursor: pointer;
        }

        .actions .action.remove {
          background: var(--warn-background);
          color: var(--warn-color);
        }

        .actions .action svg {
          width: 20px;
          height: 20px;
        }

        /* at 660px */
        @media all and (max-width: 660px) {
          a,
          .quantity > button,
          .actions .action,
          .actions .action svg,
          .quantity > button.added,
          .quantity > button.added > .icon,
          .checkbox-wrapper-18 .round label,
          .quantity > button.added > .icon svg {
            cursor: default !important;
          }
        }
        
      </style>
    `
  }
}