export default class CartItem extends HTMLDivElement {
  constructor() {

    // We are not even going to touch this.
    super();

    // lets create our shadow root
    this.shadowObj = this.attachShadow({mode: 'open'});
    this.utils = window.app.utils;
    this.host = this.getRootNode().host;
    this.quanity = this.utils.number.parseInteger(this.getAttribute('quantity'));
    this.price = this.utils.number.parse(this.getAttribute('price'));
    this.stock = this.utils.number.parseInteger(this.getAttribute('stock'));
    this.selected = true;
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    this.calculateTotal(this.quanity, this.price)
    this.activateButtons();
    this.removeItem();
    this.incrementQuantity();
    this.updateRootTotal();
    this.listenToCheckbox();
  }

  listenToCheckbox = () => {
    const checkbox = this.shadowObj.querySelector('.checkbox-wrapper-18 input[type="checkbox"]');
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
    return (this.quanity * this.price);
  }

  incrementQuantity = () => {
    const button = this.shadowObj.querySelector('.quanity button.added')
    const quantity = this.shadowObj.querySelector('.quanity button.added .quantity')

    // check if stock is available, less than or equal to 0
    if (this.stock <= 0) {
      return;
    }

    // check if button is available
    if (button && quantity) {
      // select add and remove buttons
      const add = button.querySelector('.icon.add');
      const remove = button.querySelector('.icon.remove');

      // add event listener to add button
      add.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()

        // get total ammount
        const total = this.quanity * this.price;

        // if quantity + 1 is greater than stock
        const test = this.quanity + 1;
        if (test > this.stock) {
          return;
        }

        // increment quantity
        quantity.textContent = test;
        this.quanity = test;
        this.setAttribute('quantity', this.quanity);
        
        // calculate total
        this.calculateTotal(this.quanity, this.price)

        // update root host
        this.host.setAttribute('changed', 'true')
      });

      // add event listener to remove button
      remove.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()

        // get total ammount
        const total = this.quanity * this.price;

        // if quantity - 1 is less than 1
        const test = this.quanity - 1;
        if (test < 1) {
          return;
        }

        // decrement quantity
        quantity.textContent = test;
        this.quanity = test;

        this.setAttribute('quantity', this.quanity)

        // calculate total
        this.calculateTotal(this.quanity, this.price)

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

  getBody(){
    const out = this.stock <= 0 ? 'out' : '';
    const outChecked = this.stock <= 0 ? 'disabled' : 'checked';
    return /* html */`
      <div class="info">
        <div class="checkbox-wrapper-18">
          <div class="round">
            <input type="checkbox" id="checkbox-18" ${outChecked}>
            <label for="checkbox-18"></label>
          </div>
        </div>
        <div class="image">
          <img src="${this.getAttribute('image-src')}" alt="Product image">
        </div>
        <div class="other">
          <p class="name">${this.getAttribute('name')}</p>
          <span class="store">
            <span class="by">by</span>
            <span class="store-name">${this.getAttribute('store')}</span>
          </span>
          <span class="price">
            <span class="currency">乇</span>
            <span class="money">${this.getAttribute('price')}</span>
          </span>
        </div>
      </div>
      <div class="content">
        <div class="quanity">
          ${this.checkOutOfStocK(this.stock)}
        </div>
        <div class="ammount ${out}">
          <span class="currency">乇</span>
          <span class="no">0</span>
        </div>
        <div class="actions">
          <span class="action remove">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.8892 9.55426C18.8892 17.5733 20.0435 21.1981 12.2797 21.1981C4.5149 21.1981 5.693 17.5733 5.693 9.55426" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M20.3652 6.47997H4.21472" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M15.7149 6.47995C15.7149 6.47995 16.2435 2.71423 12.2892 2.71423C8.3359 2.71423 8.86447 6.47995 8.86447 6.47995" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="text">Remove</span>
          </span>
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
        <button class="add added ${out}">
          <span class="icon remove">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M20 12L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="quantity">${this.quanity}</span>
          <span class="icon add">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M12 4V20M20 12H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </button>
      `;
    }
  }

  removeItem() {
    const btn = this.shadowObj.querySelector('.actions > .action.remove');
    if (btn ) {
      btn.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()

        this.remove();
        this.host.setAttribute('changed', 'true');
      })
    }
  }

  calculateTotal(quanity, price) {
    const total = this.shadowObj.querySelector('.ammount span.no');

    if (total) {
      total.textContent = this.utils.number.balanceWithCommas(quanity * price)
    }
  }

  activateButtons(){
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
        else{
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
          border-top: var(--border);
          padding: 10px 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 10px;
        }

        .checkbox-wrapper-18 {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .checkbox-wrapper-18 .round {
          position: relative;
        }
      
        .checkbox-wrapper-18 .round label {
          background-color: var(--background);
          border: var(--action-border);
          border-radius: 50%;
          cursor: pointer;
          height: 25px;
          width: 25px;
          display: block;
        }
      
        .checkbox-wrapper-18 .round label:after {
          border: 2px solid var(--white-color);
          border-top: none;
          border-right: none;
          content: "";
          height: 4px;
          left: 7px;
          opacity: 0;
          position: absolute;
          top: 9px;
          transform: rotate(-45deg);
          width: 10px;
        }
      
        .checkbox-wrapper-18 .round input[type="checkbox"] {
          visibility: hidden;
          display: none;
          opacity: 0;
        }
      
        .checkbox-wrapper-18 .round input[type="checkbox"]:checked + label {
          background: var(--accent-linear);
          border-color: none;
        }
      
        .checkbox-wrapper-18 .round input[type="checkbox"]:checked + label:after {
          opacity: 1;
        }

        .info {
          display: flex;
          width: 100%;
          justify-content: start;
          align-items: start;
          gap: 10px;
        }

        .info .image {
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

        .info .image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .info .other {
          display: flex;
          flex-flow: column;
          align-items: start;
          justify-content: space-between;
          gap: 5px;
          padding: 3px 0;
          width: calc(100% - 130px);
          max-width: calc(100% - 130px);
        }

        .info .other p.name {
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

        .info .other .store {
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 5px;
          width: 100%;
          min-width: 100%;
          font-weight: 400;
        }

        .info .other .store > .by {
          font-size: 1rem;
          font-family: var(--font-mono), monospace;
        }

        .info .other .store .store-name {
          font-size: 1rem;
          font-family: var(--font-read), sans-serif;
          /* add ellipsis */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .info .other .price {
          font-weight: 500;
          color: var(--teext-color);
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .info .other .price * {
          color: inherit;
        }

        .info .other .price .currency {
          font-size: 0.98rem;
          font-weight: 800;
          display: inline-block;
          margin: -2px 0 0 0;
        }

        .info .other .price .money {
          font-size: 1.2rem;
          font-weight: 500;
          display: inline-block;
          margin: 0;
        }

        .content {
          margin: 12px 0 0 0;
          width: 100%;
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .quanity {
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
        }

        .quanity > button {
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
          padding: 4px 0;
          width: max-content;
          border-radius: 12px;
        }

        .quanity > button > .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .quanity > button > .icon svg {
          width: 22px;
          height: 22px;
        }
      
        .quanity > button.added.out {
          pointer-events: none;
          opacity: 0.5;
          cursor: not-allowed !important;
        }

        .quanity > button.added {
          background: none;
          padding: 5px 0;
          width: max-content;
          color: var(--accent-color);
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
          gap: 5px;
        }

        .quanity > button.added > .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: inherit;
        }

        .quanity > button.added > .icon.remove  {
          color: var(--warn-color);
        }

        .quanity > button.added > .icon svg {
          width: 19px;
          height: 19px;
        }

        .quanity > button.added > .quantity {
          color: inherit;
          font-size: 1rem;
          font-weight: 500;
          width: 40px;
          font-family: var(--font-main), sans-serif;
        }

        .quanity .out-of-stock {
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

        .quanity .out-of-stock .text {
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ammount {
          font-weight: 600;
          color: var(--accent-color);
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
          font-size: 1.05rem;
          font-weight: 800;
          display: flex;
          margin: -2px 0 0 0;
        }

        .ammount .no {
          font-size: 1.2rem;
          font-weight: 600;
          display: inline-block;
          margin: 0;
        }
        
        .actions {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .actions .action {
          border: var(--border);
          padding: 5px 10px 5px 8px;
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

        .actions .action:hover {
          color: var(--warn-color);
        }

        .actions .action svg {
          width: 20px;
          height: 20px;
        }

        /* at 660px */
        @media all and (max-width: 660px) {
          a,
          .quanity > button,
          .actions .action,
          .actions .action svg,
          .quanity > button.added,
          .quanity > button.added > .icon,
          .checkbox-wrapper-18 .round label,
          .quanity > button.added > .icon svg {
            cursor: default !important;
          }
        }
        
      </style>
    `
  }
}