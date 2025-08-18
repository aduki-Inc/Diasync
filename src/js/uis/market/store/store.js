export default class StoreContainer extends HTMLElement {
  constructor() {
    super();

    // lets create our shadow root
    this.shadowObj = this.attachShadow({ mode: 'open' });
    this.app = window.app;
    this.utils = this.app.utils;
    this.selected = true;
    this.active_tab = null;
    this.mql = window.matchMedia("(max-width: 700px)");
    this.owner = true;
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
    this.watchMql();
  }

  connectedCallback() {
    this.activateTabController(this.shadowObj.querySelector(".tabs"));
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
        sectionTitle: 'Store',
        description: 'Flamecos & Coorporation',
      });
    }
  }

  activateTabController = tabs => {
    // get the active tab
    this.getOrSetActiveTab(tabs);

    // add click event listener to the tabs
    tabs.querySelectorAll("li").forEach(tab => {
      tab.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        // remove the active class from the active tab
        this.active_tab.classList.remove("active");

        // set the new active tab
        this.active_tab = tab;
        this.active_tab.classList.add("active");

        //TODO: hide the tab content
      });
    });
  }

  getOrSetActiveTab = tabs => {
    // get the active tab
    let activeTab = tabs.querySelector("li.active");

    if (!activeTab) {
      // if no active tab, set the first tab as active
      activeTab = tabs.querySelector("li");
      activeTab.classList.add("active");
      this.active_tab = activeTab;
    }

    // else set the active tab
    this.active_tab = activeTab;
  }

  getTemplate() {
    return /* html */`
      ${this.getBody()}
      ${this.getStyles()}
    `
  }

  getBody = () => {
    return /* html */`
      ${this.getHeader(this.mql)}
      <div class="sticky">
        ${this.getSearch(this.mql)}
        ${this.getTab()}
      </div>
      <div class="products">
        ${this.getProducts()}
      </div>
    `
  }

  getHeader = mql => {
    return /* html */`
      <div class="header">
        <div class="cover">
          <div class="image">
            <img src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="store image">
          </div>
          <div class="avatar">
            <img src="/images/shops/shop.jpg" alt="store avatar">
          </div>
          <div class="info">
            <h3 class="title">The Flamecos & Co.</h3>
            <span class="address">
              <span class="address">1234, 5th avenue, New York</span>
              <span class="country">United States</span>
            </span>
            <p class="description">
              Discover the latest trends in fashion with our exclusive collection of clothes, shoes, and accessories. <br> We offer a wide variety of styles to suit every taste and occasion.
            </p>
          </div>
        </div>
        <div class="stats">
          <div class="followers">
            <span class="number">${this.utils.number.withCommas(363234)}</span>
            <span class="label">Followers</span>
          </div>
          <span class="line"></span>
          <div class="products">
            <span class="number">${this.utils.number.withCommas(7369)}</span>
            <span class="label">Products</span>
          </div>
          <span class="line"></span>
          <div class="orders">
            <span class="number">${this.utils.number.withCommas(634)}</span>
            <span class="label">Orders</span>
          </div>
        </div>
        ${mql.matches ? this.getActions(this.owner) : ""}
      </div>
    `
  }

  getActions = owner => {
    if (owner) {
      return /* html */`
        <div class="actions">
          <button class="btn btn-products">Products</button>
          <button class="btn btn-orders">Orders</button>
          <button class="btn btn-manage">Manage</button>
        </div>
      `
    } else {
      return /* html */`
        <div class="actions">
          <button class="btn btn-follow">Follow</button>
          <button class="btn btn-call">Call</button>
          <button class="btn btn-inquire">Inquire</button>
        </div>
      `
    }
  }

  getSearch = mql => {
    if (mql.matches) {
      return /* html */`
        ${this.getForm()}
      `;
    }
    else {
      return /* html */`
        <div class="search-actions">
          ${this.getActions(this.owner)}
          ${this.getForm()}
        </div>
      `;
    }
  }

  getForm = () => {
    return /* html */`
      <form action="" method="get" class="search">
        <div class="contents">
          <input type="text" name="q" id="query" placeholder="Search in this store..." />
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11.7666" cy="11.7667" r="8.98856" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"  stroke-linejoin="round" />
            <path d="M18.0183 18.4853L21.5423 22.0001" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <button type="submit">Search</button>
        </div>
      </form>
    `;
  }

  getTab = () => {
    return /* html */`
      <ul class="tabs">
        <li class="tab">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M12.5 3H11.5C7.02166 3 4.78249 3 3.39124 4.39124C2 5.78249 2 8.02166 2 12.5C2 16.9783 2 19.2175 3.39124 20.6088C4.78249 22 7.02166 22 11.5 22C15.9783 22 18.2175 22 19.6088 20.6088C21 19.2175 21 16.9783 21 12.5V11.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M22 5.5C22 7.433 20.433 9 18.5 9C16.567 9 15 7.433 15 5.5C15 3.567 16.567 2 18.5 2C20.433 2 22 3.567 22 5.5Z" stroke="currentColor" stroke-width="1.8" />
            <path d="M7 11H11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7 16H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">All</span>
        </li>
        <li class="tab active">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M3.06164 15.1933L3.42688 13.1219C3.85856 10.6736 4.0744 9.44952 4.92914 8.72476C5.78389 8 7.01171 8 9.46734 8H14.5327C16.9883 8 18.2161 8 19.0709 8.72476C19.9256 9.44952 20.1414 10.6736 20.5731 13.1219L20.9384 15.1933C21.5357 18.5811 21.8344 20.275 20.9147 21.3875C19.995 22.5 18.2959 22.5 14.8979 22.5H9.1021C5.70406 22.5 4.00504 22.5 3.08533 21.3875C2.16562 20.275 2.4643 18.5811 3.06164 15.1933Z" stroke="currentColor" stroke-width="1.5" />
            <path d="M7.5 8L7.66782 5.98618C7.85558 3.73306 9.73907 2 12 2C14.2609 2 16.1444 3.73306 16.3322 5.98618L16.5 8" stroke="currentColor" stroke-width="1.5" />
            <path d="M15 11C14.87 12.4131 13.5657 13.5 12 13.5C10.4343 13.5 9.13002 12.4131 9 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <span class="text">What's New</span>
        </li>
        <li class="tab">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M7.69171 19.6161C8.28274 19.6161 8.57825 19.6161 8.84747 19.716C8.88486 19.7298 8.92172 19.7451 8.95797 19.7617C9.21897 19.8815 9.42793 20.0904 9.84585 20.5083C10.8078 21.4702 11.2887 21.9512 11.8805 21.9955C11.96 22.0015 12.04 22.0015 12.1195 21.9955C12.7113 21.9512 13.1923 21.4702 14.1541 20.5083C14.5721 20.0904 14.781 19.8815 15.042 19.7617C15.0783 19.7451 15.1151 19.7298 15.1525 19.716C15.4218 19.6161 15.7173 19.6161 16.3083 19.6161H16.4173C17.9252 19.6161 18.6792 19.6161 19.1476 19.1476C19.6161 18.6792 19.6161 17.9252 19.6161 16.4173V16.3083C19.6161 15.7173 19.6161 15.4218 19.716 15.1525C19.7298 15.1151 19.7451 15.0783 19.7617 15.042C19.8815 14.781 20.0904 14.5721 20.5083 14.1541C21.4702 13.1923 21.9512 12.7113 21.9955 12.1195C22.0015 12.04 22.0015 11.96 21.9955 11.8805C21.9512 11.2887 21.4702 10.8078 20.5083 9.84585C20.0904 9.42793 19.8815 9.21897 19.7617 8.95797C19.7451 8.92172 19.7298 8.88486 19.716 8.84747C19.6161 8.57825 19.6161 8.28274 19.6161 7.69171V7.58269C19.6161 6.07479 19.6161 5.32083 19.1476 4.85239C18.6792 4.38394 17.9252 4.38394 16.4173 4.38394H16.3083C15.7173 4.38394 15.4218 4.38394 15.1525 4.28405C15.1151 4.27018 15.0783 4.25491 15.042 4.23828C14.781 4.11855 14.5721 3.90959 14.1541 3.49167C13.1923 2.52977 12.7113 2.04882 12.1195 2.00447C12.04 1.99851 11.96 1.99851 11.8805 2.00447C11.2887 2.04882 10.8078 2.52977 9.84585 3.49167C9.42793 3.90959 9.21897 4.11855 8.95797 4.23828C8.92172 4.25491 8.88486 4.27018 8.84747 4.28405C8.57825 4.38394 8.28274 4.38394 7.69171 4.38394H7.58269C6.07479 4.38394 5.32083 4.38394 4.85239 4.85239C4.38394 5.32083 4.38394 6.07479 4.38394 7.58269V7.69171C4.38394 8.28274 4.38394 8.57825 4.28405 8.84747C4.27018 8.88486 4.25491 8.92172 4.23828 8.95797C4.11855 9.21897 3.90959 9.42793 3.49167 9.84585C2.52977 10.8078 2.04882 11.2887 2.00447 11.8805C1.99851 11.96 1.99851 12.04 2.00447 12.1195C2.04882 12.7113 2.52977 13.1923 3.49167 14.1541C3.90959 14.5721 4.11855 14.781 4.23828 15.042C4.25491 15.0783 4.27018 15.1151 4.28405 15.1525C4.38394 15.4218 4.38394 15.7173 4.38394 16.3083V16.4173C4.38394 17.9252 4.38394 18.6792 4.85239 19.1476C5.32083 19.6161 6.07479 19.6161 7.58269 19.6161H7.69171Z" stroke="currentColor" stroke-width="1.5" />
            <path d="M15 9L9 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15 15H14.9892M9.01076 9H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">Offers</span>
        </li>
      </ul>
    `;
  }

  getProducts = () => {
    return /* html */`
      <div is="product-wrapper" product-image="/images/product/product-8.webp" name="Fresh Tea and is a very long name" last="33.25" store="The Vines Inn" reviews="120" average-review="4.5" wished="true" in-cart="0" quantity="45" price="33.25" store-country="KE"></div>
      <div is="product-wrapper" product-image="/images/product/product-1.webp" name="Apple Fresh" last="9625.00" store="Wendy's" reviews="85" average-review="3.8" wished="false" in-cart="2" quantity="32" price="9115.00" store-country="US"></div>
      <div is="product-wrapper" product-image="/images/product/product-2.webp" name="Banana Fresh" last="15.50" store="Trader Joe's" reviews="200" average-review="4.8" wished="true" in-cart="0" quantity="50" price="10.25" store-country="KE"></div>
      <div is="product-wrapper" product-image="/images/product/product-4.webp" name="Orange Fresh" last="20.75" store="Whole Foods" reviews="150" average-review="4.3" wished="false" in-cart="1" quantity="65" price="20.75" store-country="US"></div>
      <div is="product-wrapper" product-image="/images/product/product-5.webp" name="Grapes Fresh" last="18.00" store="Safeway" reviews="6987" average-review="4.1" wished="true" in-cart="0" quantity="73" price="32.50" store-country="US"></div>
      <div is="product-wrapper" product-image="/images/product/product-6.webp" name="Mango Fresh" last="22.50" store="Kroger" reviews="110" average-review="4.6" wished="false" in-cart="0" quantity="48" price="19.25" store-country="KE"></div>
      <div is="product-wrapper" product-image="/images/product/fruits/10.jpg" name="Strawberry Fresh" last="30.00" store="Publix" reviews="130" average-review="4.7" wished="true" in-cart="0" quantity="32" price="55.40" store-country="US"></div>
      <div is="product-wrapper" product-image="/images/product/fruits/11.jpg" name="Blueberry Fresh" last="28.00" store="Albertsons" reviews="95" average-review="4.2" wished="false" in-cart="0" quantity="0" price="13.80" store-country="KE"></div>
      <div is="product-wrapper" product-image="/images/product/fruits/12.jpg" name="Watermelon Fresh" last="35.00" store="Sprouts" reviews="140" average-review="4.4" wished="true" in-cart="0" quantity="38" price="45.00" store-country="KE"></div>
      <div is="product-wrapper" product-image="/images/product/product-7.webp" name="Peach Fresh" last="27.00" store="H-E-B" reviews="105" average-review="4.3" wished="false" in-cart="0" quantity="15" price="14.25" store-country="US"></div>
      <div is="product-wrapper" product-image="/images/product/fruits/14.jpg" name="Cherry Fresh" last="32.00" store="Aldi" reviews="115" average-review="3.5" wished="true" in-cart="3" quantity="44" price="19.60" store-country="KE"></div>
      <div is="product-wrapper" product-image="/images/product/fruits/15.jpg" name="Pomegranate Fresh" last="40.00" store="Costco" reviews="125" average-review="4.6" wished="false" in-cart="1" quantity="36" price="28.75" store-country="US"></div>
      <div is="product-wrapper" product-image="/images/product/product-8.webp" name="Kiwi Fresh" last="24.00" store="Sam's Club" reviews="100" average-review="4.2" wished="true" in-cart="0" quantity="29" price="12.80" store-country="KE"></div>
      <div is="product-wrapper" product-image="/images/product/fruits/17.jpg" name="Papaya Fresh" last="26.00" store="Meijer" reviews="80" average-review="2.0" wished="false" in-cart="0" quantity="41" price="9.20" store-country="US"></div>
      <div is="product-wrapper" product-image="/images/product/fruits/22.jpg" name="Guava Fresh" last="19.00" store="Wegmans" reviews="70" average-review="3.9" wished="true" in-cart="0" quantity="0" price="7.90" store-country="KE"></div>
      <div is="product-wrapper" product-image="/images/product/fruits/19.jpg" name="Lychee Fresh" last="29.00" store="Hy-Vee" reviews="60" average-review="3.1" wished="false" in-cart="0" quantity="13" price="17.30" store-country="KE"></div>
    `;
  }

  getStyles() {
    return /* css */`
      <style>
        * {
          box-sizing: border-box !important;
        }

        :host {
          padding: 20px 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        .header {
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 100%;
          padding: 0;
          margin: 0;
        }

        .header > .cover {
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 100%;
          min-width: 100%;
          padding: 0;
          margin: 0;
        }

        .header > .cover > .image {
          width: 100%;
          height: 160px;
          border-radius: 10px;
          overflow: hidden;
        }

        .header > .cover > .image > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .header > .cover > .avatar {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          overflow: hidden;
          margin: -68px 0 0 20px;
          background: var(--background);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .header > .cover > .avatar > img {
          width: calc(100% - 10px);
          height: calc(100% - 10px);
          object-fit: cover;
          border-radius: 50%;
        }

        .header > .cover > .info {
          width: 100%;
          padding: 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        .header > .cover > .info > .title {
          font-size: 1.5rem;
          font-weight: 500;
          line-height: 1.3;
          font-family: var(--font-main), sans-serif;
          color: var(--title-color);
          margin: 0;
        }

        .header > .cover > .info > .address {
          display: flex;
          flex-flow: column;
          gap: 0;
          margin: 0 0 5px 0;
          color: var(--gray-color);
        }

        .header > .cover > .info > .address > .address {
          font-size: 1rem;
          font-weight: 400;
          margin: 0;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.3;
        }

        .header > .cover > .info > .address > .country {
          font-size: 1rem;
          font-weight: 500;
          margin: 0;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          line-height: 1.3;
        }

        .header > .cover > .info > .description {
          font-size: 1rem;
          font-weight: 400;
          margin: 0;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.3;
        }

        .header > .stats {
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: start;
          gap: 50px;
          width: 100%;
          padding: 15px 0;
          margin: 0;
        }

        .header > .stats > div {
          display: flex;
          flex-flow: column;
          gap: 0;
          margin: 0;
          padding: 0;
        }

        .header > .stats > div > .number {
          font-size: 1.15rem;
          font-weight: 500;
          margin: 0;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.3;
        }

        .header > .stats > div > .label {
          font-size: 1rem;
          font-weight: 400;
          margin: 0;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          line-height: 1.3;
        }

        .header > .stats > .line {
          display: inline-block;
          width: 2px;
          height: 30px;
          border-radius: 2px;
          background: var(--tab-background);
        }

        .actions {
          display: flex;
          flex-flow: row;
          gap: 20px;
          padding: 0;
          margin: 0;
        }

        .actions > .btn {
          padding: 7px 18px;
          border-radius: 12px;
          width: max-content;
          background: var(--gray-background);
          font-size: 0.9rem;
          color: var(--text-color);
          border: none;
          /* border: var(--border); */
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .actions > .btn.btn-products {
          background: var(--que-background);
        }

        .actions > .btn.btn-orders {
          background: var(--tab-background);
        }

        div.sticky {
          padding: 10px 0 0;
          display: flex;
          flex-flow: column;
          gap: 5px;
          margin: 0;
          width: 100%;
          z-index: 2;
          position: sticky;
          top: 0;
          background: var(--background);
        }

        div.search-actions {
          /* border: 1px solid red; */
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        form.search {
          padding: 0;
          background: var(--background);
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          width: 100%;
        }

        form.search > svg {
          position: absolute;
          left: -12px;
          top: calc(50% - 15px);
          color: var(--text-color);
          cursor: pointer;
          width: 40px;
          height: 40px;
        }

        form.search > svg:hover {
          color: var(--accent-color);
        }

        form.search > .contents {
          padding: 0;
          display: flex;
          flex-flow: row;
          align-items: center;
          flex-wrap: nowrap;
          gap: 0;
          margin: 0;
          width: 100%;
          position: relative;
        }

        form.search > .contents > input {
          border: var(--input-border-focus);
          background-color: var(--background) !important;
          display: flex;
          flex-flow: row;
          align-items: center;
          font-family: var(--font-text),sans-serif;
          color: var(--text-color);
          font-size: 1rem;
          padding: 8px 10px 8px 35px;
          gap: 0;
          width: 100%;
          outline: none;
          border-radius: 12px;
        }

        form.search > .contents > input:-webkit-autofill,
        form.search > .contents > input:-webkit-autofill:hover,
        form.search > .contents > input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px var(--background) inset;
          -webkit-text-fill-color: var(--text-color) !important;
          transition: background-color 5000s ease-in-out 0s;
          color: var(--text-color) !important;
        }

        form.search > .contents > input:-webkit-autofill {
          filter: none;
          color: var(--text-color) !important;
        }

        form.search > .contents > svg {
          position: absolute;
          height: 18px;
          color: var(--gray-color);
          width: 18px;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
        }

        form.search > .contents > button {
          position: absolute;
          right: 10px;
          top: calc(50% - 13px);
          border: none;
          cursor: pointer;
          color: var(--white-color);
          font-family: var(--font-text), sans-serif;
          background: var(--accent-linear);
          height: 26px;
          width: max-content;
          padding: 0 10px;
          font-size: 0.9rem;
          font-weight: 400;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          border-radius: 10px;
        }

        ul.tabs {
          border-bottom: var(--border);
          display: flex;
          flex-flow: row;
          gap: 15px;
          padding: 10px 0 10px;
          margin: 0;
          width: 100%;
          list-style: none;
          overflow-x: auto;
          overflow-y: hidden;
          white-space: nowrap;
          scrollbar-width: 0;
          -ms-overflow-style: none;
          z-index: 2;
          background: var(--background);
        }

        ul.tabs::-webkit-scrollbar {
          display: none;
          visibility: hidden;
        }

        ul.tabs > li.tab {
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 5px;
          padding: 5px 0;
          border-radius: 12px;
          /*background: var(--gray-background);*/
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: 0.3s;
        }

        ul.tabs > li.tab > span.count,
        ul.tabs > li.tab > svg {
          display: none;
        }

        ul.tabs > li.tab.active {
          background: var(--tab-background);
          padding: 5px 10px;
          color: var(--text-color);
        }

        ul.tabs > li.tab.active > span.count,
        ul.tabs > li.tab.active > svg,
        ul.tabs > li.tab:not(.active):hover > span.count,
        ul.tabs > li.tab:not(.active):hover > svg {
          display: flex;
        }

        /* style hover tab: but don't touch tab with active class */
        ul.tabs > li.tab:not(.active):hover {
          background: var(--tab-background);
          padding: 5px 10px;
          color: var(--text-color);
        }

        ul.tabs > li.tab > svg {
          width: 19px;
          height: 19px;
        }

        ul.tabs > li.tab > .text {
          font-size: 1rem;
          padding: 0 5px 0 0;
          font-weight: 500;
        }

        ul.tabs > li.tab > .count {
          font-size: 0.85rem;
          display: none;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-weight: 500;
          background: var(--accent-linear);
          font-family: var(--font-text), sans-serif;
          color: var(--white-color);
          padding: 1px 7px 2px;
          border-radius: 10px;
        }

        .products {
          padding: 20px 0;
          max-width: 100%;
          display:flex;
          flex-flow: row wrap;
          gap: 20px;
          justify-content: space-between;
          margin: 0;
        }

        .pagination {
          z-index: 0;
          display: flex;
          flex-flow: row;
          gap: 10px;
          justify-content: center;
          padding: 15px 0 20px;
          margin: 0;
          width: 100%;
        }

        .pagination > .previous {
          display: flex;
          flex-flow: row;
          gap: 5px;
          align-items: center;
        }

        .pagination > .nexts {
          display: flex;
          flex-flow: row;
          gap: 5px;
          align-items: center;
        }

        .pagination button {
          font-size: 0.9rem;
          outline: none;
          border: none;
          background: none;
          font-family: var(--font-text), sans-serif;
        }

        .pagination > button.current,
        .pagination > .nexts > .page,
        .pagination > .previous > .page {
          padding: 0;
          height: 30px;
          width: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50px;
          color: var(--text-color);
          border: var(--action-border);
          cursor: pointer;
          transition: 0.3s;
        }

        .pagination > .nexts > button.large,
        .pagination > .previous > button.large,
        .pagination > button.large {
          padding: 0;
          height: 30px;
          width: max-content;
          padding: 0 10px;
        }

        .pagination > button.current {
          color: var(--white-color);
          background: var(--accent-linear);
          cursor: default;
        }

        .pagination > .previous > .prev:hover,
        .pagination > .nexts > .next:hover {
          background: var(--tab-background);
          border: none;
        }

        .pagination > .previous > .start {
          margin-right: 10px;
          border: none;
          background: var(--tab-background);
        }

        .pagination > .nexts > .end {
          margin-left: 10px;
          border: none;
          background: var(--tab-background);
        }

        .pagination > .previous > .page.current,
        .pagination > .nexts > .page.current {
          background: var(--accent-linear);
          color: var(--white-color);
        }

        /* at 700px */
        @media all and (max-width: 700px) {
          :host {
            padding: 70px 10px;
          }
          /* reset all cursor: pointer */
          a,
          .actions > .btn,
          ul.tabs > li.tab,
          .pagination > button,
          .pagination > .previous > .prev,
          .pagination > .nexts > .next,
          .pagination > .previous > .start,
          .pagination > .nexts > .end,
          .pagination > .previous > .page,
          .pagination > .nexts > .page {
            cursor: default !important;
          }

          div.sticky {
            position: sticky;
            top: 60px;
          }

          .actions {
            display: flex;
            flex-flow: row;
            gap: 20px;
            padding: 0;
            margin: 5px 0 10px;
          }

          .header > .stats {
            display: flex;
            flex-flow: row;
            align-items: center;
            justify-content: start;
            gap: 30px;
            width: 100%;
            padding: 15px 0;
            margin: 0;
          }

          ul.tabs {
            padding: 10px 0;
          }

          .products {
            padding: 20px 0;
            max-width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin: 0;
          }

          .pagination {
            padding: 5px 0 25px;
          }
        }
        @media (max-width: 480px) {
          .products {
            padding: 20px 0;
            max-width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin: 0;
          }
        }
      </style>
    `
  }
}