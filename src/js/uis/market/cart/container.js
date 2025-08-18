export default class CartContainer extends HTMLElement {
  constructor() {
    super();

    // lets create our shadow root
    this.shadowObj = this.attachShadow({ mode: 'open' });
    this.app = window.app;
    this.utils = this.app.utils;
    this.mql = window.matchMedia('(max-width: 700px)');
    this.totalAmmount = 0.00
    this.render();
  }

  // add observed attributes
  static get observedAttributes() {
    return ['changed', 'empty'];
  }

  getTotal() {
    return this.totalAmmount
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
    this.watchMql();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'changed') {
      this.allItems();
    }
    if (name === 'empty') {
      this.render();
    }
  }

  connectedCallback() {
    this.setHeader(this.mql);
  }

  watchMql() {
    this.mql.addEventListener('change', () => {
      this.render();
      this.setHeader(this.mql);
    });
  }

  setHeader = mql => {
    if (mql.matches) {
      this.app.setHeader({
        sectionTitle: 'Your Cart',
        description: 'Here you can see all the items you have added to your cart. You can proceed to checkout or remove items from your cart.',
      });
    }
  }

  allItems = () => {
    const total = this.shadowObj.querySelector('.cart-items > .totals > .price > .ammount');
    const items = this.shadowObj.querySelectorAll('.cart-items > div.items > div');
    console.log(items)
    // IF items is empty make the current innerHTML empty
    if (items.length === 0) {
      this.setAttribute('empty', 'true');
      return;
    }

    let totalPrice = 0.00;
    items.forEach(item => {
      totalPrice += item.getTotal();
    })

    if (total) total.textContent = this.utils.number.balanceWithCommas(totalPrice);
  }

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getHead()}
      ${this.checkIfEmpty()}
      ${this.getStyles()}
    `
  }

  getHead = () => {
    // if empty return empty head
    const empty = this.getAttribute('empty');
    if (empty === 'true' || empty === null || empty === undefined) {
      return ''
    }
    return /* html */`
      <div class="full">
        <p class="head">Cart</p>
        <h1 class="title">Your cart items</h1>
        <p class="text">
          ${this.getAttribute('desc')}
        </p>
      </div>
    `;
  }

  setTotal = data => {
    const total = this.shadowObj.querySelector('.cart-items > .totals > .price > .ammount');
    const { add, value } = data;
    // if value is not a number return
    if (isNaN(value)) return;
    if (total) {
      if (add) {
        this.totalAmmount += value
        total.textContent = this.utils.number.balanceWithCommas(this.totalAmmount)
      } else {
        this.totalAmmount -= value
        if (this.totalAmmount < 0) this.totalAmmount = 0;
        total.textContent = this.utils.number.balanceWithCommas(this.totalAmmount)
      }
    }
  }

  getItems() {
    return /* html */`
      <div class="cart-items">
        <div class="items">
          <div is="cart-item" name="Pinapple Freash" quantity="25" price="78.12" image-src="/images/product/fruits/10.jpg" store="Some Store" stock="30"></div>
          <div is="cart-item" name="Some other item Ganders Inn and it is very long description" quantity="2" price="12.74" image-src="/images/product/fruits/11.jpg" store="The Ganders Inn" stock="12"></div>
          <div is="cart-item" name="Avacado" quantity="2" price="33.25" image-src="/images/product/fruits/12.jpg" store="The Ganders Inn and it is very long description" stock="12"></div>
          <div is="cart-item" name="Pinapple Freash" quantity="1" price="228.09" image-src="/images/product/fruits/4.jpg" store="Amazone" stock="0"></div>
          <div is="cart-item" name="Pinapple Freash" quantity="1" price="4.45" image-src="/images/product/fruits/5.jpg" store="Femar's Collections" stock="12"></div>
          <div is="cart-item" name="Pinapple Freash" quantity="1" price="33.46" image-src="/images/product/fruits/8.jpg" store="Femar's Collections" stock="12"></div>
          <div is="cart-item" name="Pinapple Freash" quantity="1" price="6367.54" image-src="/images/product/fruits/18.jpg" store="Honey's Store" stock="12"></div>
          <div is="cart-item" name="Pinapple Freash" quantity="1" price="44.37" image-src="/images/product/fruits/9.jpg" store="Kingstone Drinks" stock="12"></div>
        </div>
        <div class="totals">
          <p class="head">Total</p>
          <div class="price">
            <span class="currency">乇</span>
            <span class="ammount">0.0</span>
          </div>
          <p class="text">
            The above is your total ammout, proceed to checkout in order to pay for the items
          </p>
          <button class="action">Proceed to checkout</button>
        </div>
      </div>
    `
  }

  getEmpty() {
    return /* html */`
      <div class="empty">
        <p class="head">Cart</p>
        <h1 class="title">Your cart is empty!</h1>
        <p class="text">
          Please go to products page, home page or search for disired producrt then add it to 
          the cart/buy then come check the cart later.
        </p>
        <a href="/market/products" class="action">Shop now</a>
      </div>
    `
  }

  checkIfEmpty() {
    if (this.getAttribute('empty') === 'true') {
      return this.getEmpty()
    }
    else {
      return this.getItems()
    }
  }


  getStyles() {
    return /* css */`
      <style>
        * {
          box-sizing: border-box !important;

          /* disable user select */
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -o-user-select: none;
          -khtml-user-select: none;
        }

        :host {
          margin: 0;
          padding: 0;
          width: 100%;
          min-width: 100%;
          display: flex;
          flex-flow: column;
          height: max-content;
        }

        .empty,
        .full {
          margin: 0;
          padding: 15px 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          color: var(--text-color);
          text-align: center;
          gap: 0;
        }

        .empty > p.head,
        .full > p.head {
          width: max-content;
          color: var(--white-color);
          margin: 0;
          padding: 5px 12px;
          background: var(--accent-linear);
          border-radius: 50px;
        }

        .empty > h1.title,
        .full > h1.title {
          line-height: 1.3;
          text-shadow: var(--text-shadow);
          margin: 8px 0;
          font-size: 2rem;
          font-family: var(--font-main), sans-serif;
          line-height: 1.3;
          font-weight: 500;
        }

        .empty > p.text,
        .full > p.text {
          font-family: var(--font-main), sans-serif;
          margin: 0;
          bottom: 40px;
          font-size: 1rem;
          line-height: 1.5;
          font-style: normal;
          text-align: center;
        }

        .empty > .action {
          margin: 15px 0;
          padding: 10px 15px;
          text-decoration: none;
          font-family: var(--font-main), sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          display: flex;
          flex-flow: row;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s linear;
          background: var(--accent-linear);
          color: var(--white-color);
          backdrop-filter: blur(84px);
          -webkit-backdrop-filter: blur(84px);
          box-shadow: var(--box-shadow);
        }

        .cart-items {
          margin: 0;
          width: 100%;
          min-height: 100%;
          display: flex;
          flex-flow: column;
          align-items: center;
          color: var(--text-color);
          text-align: center;
          gap: 0;
        }

        .cart-items > .items {
          width: 100%;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 0;
        }

        .cart-items > .totals {
          border-top: var(--action-border);
          padding: 30px 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          color: var(--text-color);
          text-align: center;
          gap: 10px;
        }

        .cart-items .totals > p.head {
          width: max-content;
          color: var(--white-color);
          margin: 0;
          padding: 5px 12px;
          background: var(--accent-linear);
          border-radius: 50px;
        }

        .cart-items .totals > .price {
          display: flex;
          flex-flow: row;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .cart-items .totals > .price > .currency {
          font-size: 2rem;
          font-weight: 800;
          color: var(--accent-color);
        }

        .cart-items .totals > .price > .ammount {
          font-size: 2.3rem;
          font-weight: 500;
          color: var(--accent-color);
        }

        .cart-items .totals > p.text {
          font-family: "Inter Custom", sans-serif;
          margin: 0;
          bottom: 40px;
          font-size: 1.15rem;
          line-height: 1.5;
          font-style: normal;
          text-align: center;
        }

        .cart-items .totals > .action {
          margin: 15px 0;
          padding: 12px 18px;
          border: var(--action-border);
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          display: flex;
          flex-flow: row;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: center;
          font-family: var(--font-main), sans-serif;
          gap: 10px;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s linear;
          background: var(--gray-background);
          color: var(--text-color);
        }

        @media all and (max-width: 700px) {
          :host {
            margin: 0;
            padding: 65px 10px;
            width: 100%;
            min-width: 100%;
            display: flex;
            flex-flow: column;
            height: max-content;
          }
  
          a,
          .cart-items .totals > .action {
            cursor: default !important;
          }
        }
        
      </style>
    `
  }
}