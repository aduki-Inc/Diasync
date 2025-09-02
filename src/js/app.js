import APIManager from "./api.js";
import utils from "./utils/index.js";
import uis from "./uis/index.js"
import urls from "./urls.js";

export default class AppMain extends HTMLElement {
  constructor() {
    super();
    uis('Apps registered');
    this.content = this.getContent();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.api = new APIManager(this.getAttribute('api'), 9500, 'v1');
    window.app = this;
    this.utils = utils();
    this.urls = urls;
    this.mql = window.matchMedia('(max-width: 660px)');
    this.initTheme();
    this.render();
    this.currentUrl = this.getAttribute('url');
    window.addEventListener('popstate', this.handlePopState);
  }

  getContent = () => {
    const content = this.innerHTML;
    this.innerHTML = '';
    return content;
  }

  render() {
    // this.shadowObj.innerHTML = this.getTemplate(this.isAuthenticated()); // re enable this when backend & authentication is implemented
    this.shadowObj.innerHTML = this.getTemplate(); // For now, render as plain UI
    // watch for media query changes
    this.watchMeta();
  }

  isAuthenticated() {
    // Check if a cookie named: x-account-token exists
    const token = document.cookie.split('; ').find(row => row.startsWith('x-account-token='));
    return !!token;
  }

  initTheme() {
    // Get saved theme from localStorage, default to light
    const savedTheme = localStorage.getItem('user-theme') || 'light';

    // Set the theme on document
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  connectedCallback() {
    // this.setUpEvents();
    this._setupSpecialNavs();
    this._setupNavLinks(); // Add navigation link event handlers
    // this._loadInitialContent(); // Load content based on the current URL
  }

    watchMql() {
      this.mql.addEventListener('change', () => {
        this.render();
        this.setHeader(this.mql);
      });
    }

    setHeader = data => {
      const header = this.shadowObj.querySelector('header-section');
      if (header) {
        header.setAttribute('section-title', data.sectionTitle);
        header.setAttribute('description', data.description);
      }
    }

  _loadInitialContent() {
    // Get the current path from the browser
    const currentPath = window.location.pathname;

    // Update the active navigation item based on the current URL
    this._updateActiveNavItem(currentPath);

    // Load the content for this URL
    if (this.urls[currentPath]) {
      const container = this.shadowObj.querySelector('section.flow > div#content-container.content-container');
      if (container) container.innerHTML = this.urls[currentPath];
    } else if (currentPath !== '/' && currentPath !== '/dashboard') {
      // If a path is not in nav contents and not the root path, show 404/default
      const container = this.shadowObj.querySelector('section.flow > div#content-container.content-container');
      if (container) {
        container.innerHTML = this.urls.default;
      }
    }
  }

  _setupNavLinks() {
    if (!this.shadowRoot) {
      console.warn('Shadow root not available for _setupNavLinks. Ensure component is fully initialized.');
      return;
    }

    // Get all navigation links
    const navLinks = this.shadowRoot.querySelectorAll('section.nav a[href]');

    navLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();

        const url = link.getAttribute('href');

        // Update active class for main nav items
        this._updateActiveNavItem(url);

        // Get content for the URL
        const content = this.urls[url] || this.urls.default;

        // Navigate to the URL with the content as state
        this.navigate(url, { kind: 'app', html: content });
      });
    });
  }

  _updateActiveNavItem(url) {
    // Find all expanded dropdowns first to maintain their visibility state
    const expandedDropdowns = Array.from(this.shadowRoot.querySelectorAll('section.nav > ul.nav.special > li:not(.collapsed)'));

    // Remove the active class from all items
    const allNavItems = this.shadowRoot.querySelectorAll('section.nav li');
    allNavItems.forEach(item => item.classList.remove('active'));

    // Re-add active class to expanded dropdowns to maintain a vertical line
    expandedDropdowns.forEach(dropdown => {
      dropdown.classList.add('active');
    });

    // Add an active class to the current nav item
    if (url === '/' || url === '/dashboard') {
      const dashboardItem = this.shadowRoot.querySelector('li.dashboard');
      if (dashboardItem) dashboardItem.classList.add('active');
    } else {
      // Extract the path segments
      const urlSegments = url.split('/').filter(segment => segment);

      if (urlSegments.length > 0) {
        // Try to find the nav item with the class matching the last segment
        const segment = urlSegments[urlSegments.length - 1];
        let navItem = this.shadowRoot.querySelector(`li.${segment}`);

        // If not found, try the first segment
        if (!navItem && urlSegments.length > 0) {
          navItem = this.shadowRoot.querySelector(`li.${urlSegments[0]}`);
        }

        if (navItem) {
          navItem.classList.add('active');

          // If it's in a dropdown, also mark the parent as active and expand the dropdown
          const parentLi = navItem.closest('ul.dropdown')?.closest('li');
          if (parentLi) {
            parentLi.classList.add('active');

            // Expand the dropdown if it's collapsed
            if (parentLi.classList.contains('collapsed')) {
              this._expandDropdown(parentLi);
            }
          }
        }
      }
    }
  }

  getRenderedContent = contentContainer => {
    return contentContainer.innerHTML;
  }

  setUpEvents = () => {
    // set display to flex
    this.style.setProperty('display', 'flex')
    const container = this.shadowObj.querySelector('section.flow > div#content-container.content-container');
    const currentPath = window.location.pathname;

    // Only initialize default content if we're at the root or there's no specific content for this path
    if (container && (currentPath === '/' || !this.urls[currentPath])) {
      container.innerHTML = this.getLoader();
    }
  }

  hideNav = () => {
    const nav = this.shadowObj.querySelector('section.nav.mobile');

    if (nav) nav.style.setProperty('display', 'none');
  }

  showNav = () => {
    const nav = this.shadowObj.querySelector('section.nav.mobile');

    if (nav) nav.style.setProperty('display', 'flex');
  }

  watchMeta = () => {
    this.mql.addEventListener('change', () => {
      this.render();
      // this.setUpEvents();
    })
  }

  showToast = (success, message) => {
    // check if the toast is already open
    const toastEl = document.querySelector('#toast');
    if (toastEl) toastEl.remove();

    // create the toast element
    const toast = this.getToast(success, message);

    // append the toast to the body
    document.body.insertAdjacentHTML('beforeend', toast);

    // add the show class to the toast
    const addedToast = document.querySelector('#toast');
    addedToast.classList.add('show');

    // remove the toast after 5 seconds
    setTimeout(() => {
      addedToast.classList.remove('show');
      setTimeout(() => {
        addedToast.remove();
      }, 300);
    }, 5000);
  }

  navigate = (url, state) => {
    const container = this.shadowObj.querySelector('section.flow > div#content-container.content-container');
    const content = state ? state : this.urls[url] || this.urls.default;
    this.push(url, content, url);
    // set the loader
    container.innerHTML = this.getLoader();
    window.scrollTo(0, 0);

    // Update current URL reference
    this.currentUrl = url;

    // check if the URL is in the nav contents
    if (this.urls[url]) {
      this.updateHistory(this.urls[url]);
      return;
    }

    // if the URL is not in the nav contents, show the 404 page
    this.updateHistory(this.urls.default);
  }

  replaceHistory = state => {
    // get current URL
    const url = window.location.href;

    // replace the current history entry
    this.replace(url, state, url);
  }

  push(url, state = {}, title = '') {
    window.history.pushState(state, title, url);
    this.currentUrl = url;
  }

  replace(url, state = {}, title = '') {
    window.history.replaceState(state, title, url);
    this.currentUrl = url;
  }

  handlePopState = event => {
    const state = event.state;
    const url = window.location.pathname;

    // First, update active navigation with proper expansion of dropdowns
    this._updateActiveNavItem(url);

    if (state && state.kind === 'app') {
      // Update content
      this.updateHistory(state.html);
    } else {
      // If no state or not our app state, still handle the content
      const content = this.urls[url] || this.urls.default;
      this.updateHistory(content);
    }

    // Update current URL reference
    this.currentUrl = url;
  }

  updateHistory = content => {
    // scroll to the top of the page
    window.scrollTo(0, 0);
    this.content = content;
    const container = this.shadowObj.querySelector('section.flow > div#content-container.content-container');
    container.innerHTML = this.getLoader();

    setTimeout(() => {
      // set the content
      container.innerHTML = this.content;
    }, 1000);
  }


  _setupSpecialNavs() {
    if (!this.shadowRoot) {
      console.warn('Shadow root not available for _setupSpecialNavs. Ensure component is fully initialized.');
      return;
    }

    const specialNavUls = this.shadowRoot.querySelectorAll('section.nav > ul.nav.special');

    specialNavUls.forEach(ul => {
      const item = ul.querySelector('li'); // Assuming one li per ul.special.nav
      if (!item) return;

      const header = item.querySelector('div.link-section');
      const dropdown = item.querySelector('ul.dropdown');

      if (header && dropdown) {
        // Default state: if ul.special.nav has 'opened' class, it's open, otherwise collapsed.
        if (ul.classList.contains('opened')) {
          item.classList.remove('collapsed');
          dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
          item.classList.add('active'); // Add an active class for the vertical line
        } else {
          item.classList.add('collapsed');
          dropdown.style.maxHeight = '0px';
          item.classList.remove('active'); // Remove the active class for the vertical line
        }

        header.addEventListener('click', (event) => {
          event.preventDefault();
          const isCurrentlyCollapsed = item.classList.contains('collapsed');

          // Close all other special navs
          specialNavUls.forEach(otherUl => {
            const otherItem = otherUl.querySelector('li');
            if (otherItem && otherItem !== item) {
              otherItem.classList.add('collapsed');
              otherItem.classList.remove('active'); // Remove active class for other items
              const otherDropdown = otherItem.querySelector('ul.dropdown');
              if (otherDropdown) {
                otherDropdown.style.maxHeight = '0px';
              }
            }
          });

          // Toggle the clicked one
          if (isCurrentlyCollapsed) { // If it was collapsed, open it
            item.classList.remove('collapsed');
            item.classList.add('active'); // Add an active class for the vertical line regardless of child selection
            dropdown.style.maxHeight = (dropdown.scrollHeight + 7) + 'px'; // Add some padding
          } else { // If it was open, close it
            item.classList.add('collapsed');
            item.classList.remove('active'); // Remove the active class for the vertical line
            dropdown.style.maxHeight = '0px';
          }
        });
      }
    });
  }

  // Reenable this when backend & authentication is implemented
  // getTemplate = (authenticated = false) => {
  //   if (!authenticated) return `${this.getAccess()}`
  //   return `
  //     ${this.getBody()}
  //     ${this.getStyles()}
  //   `;
  // }

  getTemplate = () => {
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    const mql = window.matchMedia('(max-width: 660px)');
    if (mql.matches) {
      return /* html */`
        ${this.getMobileHeader()}
        <section class="flow">
          <div id="content-container" class="content-container">
            <!--<chats-section all="628" unread="3" requests="2"></chats-section>-->
            ${this.getBookingsFeed()}
          </div>
        </section>
        <section class="nav">
          ${this.getMobileNav()}
        </section>
      `;
    }
    else {
      // Only show navigation if authenticated
      return /* html */`
        ${this.getMainNav()}
        <section class="flow">
          <div id="content-container" class="content-container">
            <!-- ${this.getLoader()} -->
            ${this.getWalletAccount()}
          </div>
        </section>
        ${this.getSidebar()}
      `;
    }
  }

  getMainNav = () => {
    return /* html */`
      <section class="nav">
        ${this.getLogoNav()}
        ${this.getMainLinksNav()}
        ${this.getOrdersNav()}
        ${this.getProvidersNav()}
        ${this.getPharmacyNav()}
        ${this.getBookingsNav()}
        ${this.getTweakNav()}
      </section>
    `;
  }

  getLogoNav = () => {
    return /* html */`
      <ul class="logo nav">
        <li class="logo">
          <span class="tooltip">
            <span class="arrow"></span>
            <span class="text">Diasync</span>
          </span>
        </li>
      </ul>
    `;
  }

  getMobileHeader = () => {
    return /* html */`
      <header-section section-title="Chats" description="Your chats and updates."></header-section>
    `;
  }

  getMobileNav = () => {
    return /* html */`
      <div class="mobile-nav">
        <div class="icons">
          <span class="icon home active">
            <span class="bar"></span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M12 17H12.009" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M20 8.5V13.5C20 17.2712 20 19.1569 18.8284 20.3284C17.6569 21.5 15.7712 21.5 12 21.5C8.22876 21.5 6.34315 21.5 5.17157 20.3284C4 19.1569 4 17.2712 4 13.5V8.5" stroke="currentColor" stroke-width="1.8" />
              <path d="M22 10.5L17.6569 6.33548C14.9902 3.77849 13.6569 2.5 12 2.5C10.3431 2.5 9.00981 3.77849 6.34315 6.33548L2 10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span class="text">Home</span>
          </span>
          <span class="icon book">
            <span class="bar"></span>
            <svg id="other" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M2.74976 12.7756C2.74976 5.81959 5.06876 3.50159 12.0238 3.50159C18.9798 3.50159 21.2988 5.81959 21.2988 12.7756C21.2988 19.7316 18.9798 22.0496 12.0238 22.0496C5.06876 22.0496 2.74976 19.7316 2.74976 12.7756Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M3.02515 9.32397H21.0331" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M16.4285 13.261H16.4375" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M12.0291 13.261H12.0381" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M7.62135 13.261H7.63035" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M16.4285 17.1129H16.4375" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M12.0291 17.1129H12.0381" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M7.62135 17.1129H7.63035" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M16.033 2.05005V5.31205" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M8.02466 2.05005V5.31205" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
           <span class="text">Book</span>
          </span>
          <span class="icon wallet">
            <span class="bar"></span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M3 8.5H15C17.8284 8.5 19.2426 8.5 20.1213 9.37868C21 10.2574 21 11.6716 21 14.5V15.5C21 18.3284 21 19.7426 20.1213 20.6213C19.2426 21.5 17.8284 21.5 15 21.5H9C6.17157 21.5 4.75736 21.5 3.87868 20.6213C3 19.7426 3 18.3284 3 15.5V8.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M15 8.49833V4.1103C15 3.22096 14.279 2.5 13.3897 2.5C13.1336 2.5 12.8812 2.56108 12.6534 2.67818L3.7623 7.24927C3.29424 7.48991 3 7.97203 3 8.49833" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M17.5 15.5C17.7761 15.5 18 15.2761 18 15C18 14.7239 17.7761 14.5 17.5 14.5M17.5 15.5C17.2239 15.5 17 15.2761 17 15C17 14.7239 17.2239 14.5 17.5 14.5M17.5 15.5V14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
           <span class="text">Wallet</span>
          </span>
          <span class="icon search">
            <span class="bar"></span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
              <path d="M17 17L21 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <span class="text">Search</span>
          </span>
          <span class="icon pharmacy">
						<span class="bar"></span>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M5.5 15.5C3.28795 14.6166 2 12.4328 2 10.1746C2 7.24571 4.31698 4.35135 5.94326 2.68056C6.82649 1.77315 8.17351 1.77315 9.05674 2.68056C9.54874 3.18602 9.96485 3.80348 10.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M8 14.9263C8 11.3698 10.9489 7.85521 13.0187 5.82639C14.1428 4.72454 15.8572 4.72454 16.9813 5.82639C19.0511 7.85521 22 11.3698 22 14.9263C22 18.4134 19.3492 22 15 22C10.6508 22 8 18.4134 8 14.9263Z" stroke="currentColor" stroke-width="1.8"></path>
              <path d="M18.5 15.5C18.5 17.7091 17 18.5 15.5 18.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
						<span class="text">Meds</span>
					</span>
				  <span class="icon manage">
				    <span class="bar"></span>
				    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M16.3083 4.38394C15.7173 4.38394 15.4217 4.38394 15.1525 4.28405C15.1151 4.27017 15.0783 4.25491 15.042 4.23828C14.781 4.11855 14.5721 3.90959 14.1541 3.49167C13.1922 2.52977 12.7113 2.04882 12.1195 2.00447C12.04 1.99851 11.96 1.99851 11.8805 2.00447C11.2887 2.04882 10.8077 2.52977 9.84585 3.49166C9.42793 3.90959 9.21897 4.11855 8.95797 4.23828C8.92172 4.25491 8.88486 4.27017 8.84747 4.28405C8.57825 4.38394 8.28273 4.38394 7.69171 4.38394H7.58269C6.07478 4.38394 5.32083 4.38394 4.85239 4.85239C4.38394 5.32083 4.38394 6.07478 4.38394 7.58269V7.69171C4.38394 8.28273 4.38394 8.57825 4.28405 8.84747C4.27017 8.88486 4.25491 8.92172 4.23828 8.95797C4.11855 9.21897 3.90959 9.42793 3.49166 9.84585C2.52977 10.8077 2.04882 11.2887 2.00447 11.8805C1.99851 11.96 1.99851 12.04 2.00447 12.1195C2.04882 12.7113 2.52977 13.1922 3.49166 14.1541C3.90959 14.5721 4.11855 14.781 4.23828 15.042C4.25491 15.0783 4.27017 15.1151 4.28405 15.1525C4.38394 15.4217 4.38394 15.7173 4.38394 16.3083V16.4173C4.38394 17.9252 4.38394 18.6792 4.85239 19.1476C5.32083 19.6161 6.07478 19.6161 7.58269 19.6161H7.69171C8.28273 19.6161 8.57825 19.6161 8.84747 19.716C8.88486 19.7298 8.92172 19.7451 8.95797 19.7617C9.21897 19.8815 9.42793 20.0904 9.84585 20.5083C10.8077 21.4702 11.2887 21.9512 11.8805 21.9955C11.96 22.0015 12.0399 22.0015 12.1195 21.9955C12.7113 21.9512 13.1922 21.4702 14.1541 20.5083C14.5721 20.0904 14.781 19.8815 15.042 19.7617C15.0783 19.7451 15.1151 19.7298 15.1525 19.716C15.4217 19.6161 15.7173 19.6161 16.3083 19.6161H16.4173C17.9252 19.6161 18.6792 19.6161 19.1476 19.1476C19.6161 18.6792 19.6161 17.9252 19.6161 16.4173V16.3083C19.6161 15.7173 19.6161 15.4217 19.716 15.1525C19.7298 15.1151 19.7451 15.0783 19.7617 15.042C19.8815 14.781 20.0904 14.5721 20.5083 14.1541C21.4702 13.1922 21.9512 12.7113 21.9955 12.1195C22.0015 12.0399 22.0015 11.96 21.9955 11.8805C21.9512 11.2887 21.4702 10.8077 20.5083 9.84585C20.0904 9.42793 19.8815 9.21897 19.7617 8.95797C19.7451 8.92172 19.7298 8.88486 19.716 8.84747C19.6161 8.57825 19.6161 8.28273 19.6161 7.69171V7.58269C19.6161 6.07478 19.6161 5.32083 19.1476 4.85239C18.6792 4.38394 17.9252 4.38394 16.4173 4.38394H16.3083Z" stroke="currentColor" stroke-width="1.8"></path>
              <path d="M15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12Z" stroke="currentColor" stroke-width="1.8"></path>
            </svg>
						<span class="text">Manage</span>
					</span>
      </div>
    `;
  }

  getMainLinksNav = () => {
    return /* html */`
      <ul class="main nav">
        <li class="dashboard active">
          <a href="/dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M21 6.75C21 4.67893 19.3211 3 17.25 3C15.1789 3 13.5 4.67893 13.5 6.75C13.5 8.82107 15.1789 10.5 17.25 10.5C19.3211 10.5 21 8.82107 21 6.75Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              <path d="M10.5 6.75C10.5 4.67893 8.82107 3 6.75 3C4.67893 3 3 4.67893 3 6.75C3 8.82107 4.67893 10.5 6.75 10.5C8.82107 10.5 10.5 8.82107 10.5 6.75Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              <path d="M21 17.25C21 15.1789 19.3211 13.5 17.25 13.5C15.1789 13.5 13.5 15.1789 13.5 17.25C13.5 19.3211 15.1789 21 17.25 21C19.3211 21 21 19.3211 21 17.25Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              <path d="M10.5 17.25C10.5 15.1789 8.82107 13.5 6.75 13.5C4.67893 13.5 3 15.1789 3 17.25C3 19.3211 4.67893 21 6.75 21C8.82107 21 10.5 19.3211 10.5 17.25Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
            </svg>
            <span class="text">Home</span>
          </a>
        </li>
        <li class="notes">
          <a href="/notes">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M11.5 5C14.3284 5 15.7426 5 16.6213 5.87868C17.5 6.75736 17.5 8.17157 17.5 11C17.5 19 21.5 19 21.5 19H7.23863C6.91067 19 6.74668 19 6.37485 18.9032C6.00302 18.8063 5.94387 18.7733 5.82558 18.7072C4.6855 18.0702 2.5 16.1742 2.5 11C2.5 8.17157 2.5 6.75736 3.37868 5.87868C4.25736 5 5.67157 5 8.5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M2.5 10V16C2.5 18.8284 2.5 20.2426 3.37868 21.1213C4.25736 22 5.67157 22 8.5 22H11.5761C14.4045 22 15.8188 22 16.6974 21.1213C17.1873 20.6314 17.4041 19.9751 17.5 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M11.5 3.5V6.5C11.5 6.96594 11.5 7.19891 11.4239 7.38268C11.3224 7.62771 11.1277 7.82239 10.8827 7.92388C10.6989 8 10.4659 8 10 8C9.53406 8 9.30109 8 9.11732 7.92388C8.87229 7.82239 8.67761 7.62771 8.57612 7.38268C8.5 7.19891 8.5 6.96594 8.5 6.5V3.5C8.5 3.03406 8.5 2.80109 8.57612 2.61732C8.67761 2.37229 8.87229 2.17761 9.11732 2.07612C9.30109 2 9.53406 2 10 2C10.4659 2 10.6989 2 10.8827 2.07612C11.1277 2.17761 11.3224 2.37229 11.4239 2.61732C11.5 2.80109 11.5 3.03406 11.5 3.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            <span class="text">Notes</span>
          </a>
        </li>
        <li class="payments">
          <a href="/payments">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M3 8.5H15C17.8284 8.5 19.2426 8.5 20.1213 9.37868C21 10.2574 21 11.6716 21 14.5V15.5C21 18.3284 21 19.7426 20.1213 20.6213C19.2426 21.5 17.8284 21.5 15 21.5H9C6.17157 21.5 4.75736 21.5 3.87868 20.6213C3 19.7426 3 18.3284 3 15.5V8.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M15 8.49833V4.1103C15 3.22096 14.279 2.5 13.3897 2.5C13.1336 2.5 12.8812 2.56108 12.6534 2.67818L3.7623 7.24927C3.29424 7.48991 3 7.97203 3 8.49833" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M17.5 15.5C17.7761 15.5 18 15.2761 18 15C18 14.7239 17.7761 14.5 17.5 14.5M17.5 15.5C17.2239 15.5 17 15.2761 17 15C17 14.7239 17.2239 14.5 17.5 14.5M17.5 15.5V14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="text">Wallet</span>
          </a>
        </li>
      </ul>
    `;
  }

  getBookingsNav = () => {
    return /* html */`
      <ul class="special nav">
        <li class="bookings">
          <div class="link-section">
            <span class="left">
              <svg id="other" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M2.74976 12.7756C2.74976 5.81959 5.06876 3.50159 12.0238 3.50159C18.9798 3.50159 21.2988 5.81959 21.2988 12.7756C21.2988 19.7316 18.9798 22.0496 12.0238 22.0496C5.06876 22.0496 2.74976 19.7316 2.74976 12.7756Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M3.02515 9.32397H21.0331" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M16.4285 13.261H16.4375" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M12.0291 13.261H12.0381" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M7.62135 13.261H7.63035" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M16.4285 17.1129H16.4375" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M12.0291 17.1129H12.0381" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M7.62135 17.1129H7.63035" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M16.033 2.05005V5.31205" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M8.02466 2.05005V5.31205" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <span class="text">Bookings</span>
            </span>
          </div>
          <ul class="dropdown last">
            <li class="no-show">
              <a href="/bookings/all"><span class="text">Bookings</span></a>
            </li>
            <li class="in-person">
              <a href="/bookings/pending">
                <span class="text number booking">
                  <span class="number-text">Pending</span>
                  <span class="number-items">63</span>
                </span>
              </a>
            </li>
            <li class="upcoming">
              <a href="/bookings/upcoming">
                <span class="text number booking">
                  <span class="number-text">Upcoming</span>
                  <span class="number-items">17</span>
                </span>
              </a>
            </li>
            <li class="recordings">
              <a href="/meetings/recordings">
                <span class="text">Recordings</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    `;
  }

  getPharmacyNav = () => {
    return /* html */`
      <ul class="special nav">
        <li class="pharmacy">
          <div class="link-section">
            <span class="left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M2.35139 13.2135C1.99837 10.9162 1.82186 9.76763 2.25617 8.74938C2.69047 7.73112 3.65403 7.03443 5.58114 5.64106L7.02099 4.6C9.41829 2.86667 10.6169 2 12 2C13.3831 2 14.5817 2.86667 16.979 4.6L18.4189 5.64106C20.346 7.03443 21.3095 7.73112 21.7438 8.74938C22.1781 9.76763 22.0016 10.9162 21.6486 13.2135L21.3476 15.1724C20.8471 18.4289 20.5969 20.0572 19.429 21.0286C18.2611 22 16.5537 22 13.1388 22H10.8612C7.44633 22 5.73891 22 4.571 21.0286C3.40309 20.0572 3.15287 18.4289 2.65243 15.1724L2.35139 13.2135Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                <path d="M12 10V16M9 13L15 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              </svg>
              <span class="text">Pharmacy</span>
            </span>
          </div>
          <ul class="dropdown">
            <li class="manage">
              <a href="/pharmacy/manage">
                <span class="text">Manage</span>
              </a>
            </li>
            <li class="products">
              <a href="/pharmacy/products">
                <span class="text">Products</span>
              </a>
            </li>
            <li class="pharmacies">
              <a href="/pharmacy/pharmacies">
                <span class="text">Pharmacies</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    `;
  }

  getProvidersNav = () => {
    return /* html */`
      <ul class="special nav">
        <li class="providers">
          <div class="link-section">
            <span class="left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M2 22H22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                <path d="M18 9H14C11.518 9 11 9.518 11 12V22H21V12C21 9.518 20.482 9 18 9Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                <path d="M15 22H3V5C3 2.518 3.518 2 6 2H12C14.482 2 15 2.518 15 5V9" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                <path d="M3 6H6M3 10H6M3 14H6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                <path d="M15 13H17M15 16H17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                <path d="M16 22L16 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="text">Providers</span>
            </span>
          </div>
          <ul class="dropdown">
            <li class="manage">
              <a href="/providers/manage"><span class="text">Manage</span></a>
            </li>
            <li class="services">
              <a href="/providers/services"><span class="text">Services</span></a>
            </li>
            <li class="hospitals">
              <a href="/providers/hospitals"><span class="text">Hospitals</span></a>
            </li>
            <li class="specialists">
              <a href="/providers/specialists"><span class="text">Specialists</span></a>
            </li>
            <li class="ambulance">
              <a href="/providers/ambulance"><span class="text">Ambulance</span></a>
            </li>
          </ul>
        </li>
      </ul>
    `;
  }

  getOrdersNav = () => {
    return /* html */`
      <ul class="special nav opened">
        <li class="orders active">
          <div class="link-section">
            <span class="left">
              <svg id="other" width="24" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.43787 7.4209C7.44386 4.91878 9.47628 2.8949 11.9793 2.8997C14.4811 2.90569 16.5052 4.93856 16.4999 7.44022C16.4999 7.44065 16.4999 7.44107 16.4999 7.44149L15.7499 7.4397L16.4999 7.44022V10.4717C16.4999 10.8859 16.1641 11.2217 15.7499 11.2217C15.3357 11.2217 14.9999 10.8859 14.9999 10.4717V7.4397L14.9999 7.4379C15.0039 5.76426 13.6501 4.4039 11.9764 4.39969C10.3019 4.39668 8.94233 5.75028 8.93787 7.42364V10.4717C8.93787 10.8859 8.60208 11.2217 8.18787 11.2217C7.77365 11.2217 7.43787 10.8859 7.43787 10.4717L7.43787 7.4209Z" fill="currentColor"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.38521 10.2834C4.24823 11.1733 3.69995 12.6443 3.69995 15.2075C3.69995 17.7702 4.2482 19.2409 5.38518 20.1307C6.57922 21.0652 8.60338 21.5155 11.969 21.5155C15.3345 21.5155 17.3587 21.0652 18.5527 20.1307C19.6897 19.2409 20.238 17.7702 20.238 15.2075C20.238 12.6443 19.6897 11.1733 18.5527 10.2834C17.3587 9.34881 15.3345 8.8985 11.969 8.8985C8.60338 8.8985 6.57924 9.34881 5.38521 10.2834ZM4.46069 9.10214C6.08517 7.83069 8.57053 7.3985 11.969 7.3985C15.3674 7.3985 17.8527 7.83069 19.4772 9.10214C21.1587 10.4182 21.738 12.4767 21.738 15.2075C21.738 17.9378 21.1587 19.996 19.4772 21.312C17.8527 22.5833 15.3674 23.0155 11.969 23.0155C8.57052 23.0155 6.08519 22.5833 4.46072 21.312C2.7792 19.996 2.19995 17.9378 2.19995 15.2075C2.19995 12.4767 2.77918 10.4182 4.46069 9.10214Z" fill="currentColor"></path>
              </svg>
              <span class="text">Orders</span>
            </span>
          </div>
          <ul class="dropdown">
            <li class="basket">
              <a href="/orders/cart">
                <span class="text number">
                  <span class="number-text">Cart</span>
                  <span class="number-items">6</span>
                </span>
              </a>
            </li>
            <li class="all">
              <a href="/orders/all">
                <span class="text number">
                  <span class="number-text">Orders</span>
                  <span class="number-items">36k</span>
                </span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    `;
  }

  getNotesNav = () => {
    return /* html */`
      <ul class="special nav">
        <li class="notes">
          <div class="link-section">
            <span class="left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                <path d="M11.5 5C14.3284 5 15.7426 5 16.6213 5.87868C17.5 6.75736 17.5 8.17157 17.5 11C17.5 19 21.5 19 21.5 19H7.23863C6.91067 19 6.74668 19 6.37485 18.9032C6.00302 18.8063 5.94387 18.7733 5.82558 18.7072C4.6855 18.0702 2.5 16.1742 2.5 11C2.5 8.17157 2.5 6.75736 3.37868 5.87868C4.25736 5 5.67157 5 8.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M2.5 10V16C2.5 18.8284 2.5 20.2426 3.37868 21.1213C4.25736 22 5.67157 22 8.5 22H11.5761C14.4045 22 15.8188 22 16.6974 21.1213C17.1873 20.6314 17.4041 19.9751 17.5 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M11.5 3.5V6.5C11.5 6.96594 11.5 7.19891 11.4239 7.38268C11.3224 7.62771 11.1277 7.82239 10.8827 7.92388C10.6989 8 10.4659 8 10 8C9.53406 8 9.30109 8 9.11732 7.92388C8.87229 7.82239 8.67761 7.62771 8.57612 7.38268C8.5 7.19891 8.5 6.96594 8.5 6.5V3.5C8.5 3.03406 8.5 2.80109 8.57612 2.61732C8.67761 2.37229 8.87229 2.17761 9.11732 2.07612C9.30109 2 9.53406 2 10 2C10.4659 2 10.6989 2 10.8827 2.07612C11.1277 2.17761 11.3224 2.37229 11.4239 2.61732C11.5 2.80109 11.5 3.03406 11.5 3.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <span class="text">Notes</span>
            </span>
          </div>
          <ul class="dropdown">
            <li class="history">
              <a href="/payments/history"><span class="text">History</span></a>
            </li>
            <li class="account">
              <a href="/payments/account"><span class="text">Illness</span></a>
            </li>
            <li class="methods">
              <a href="/payments/methods"><span class="text">Progress</span></a>
            </li>
          </ul>
        </li>
      </ul>
    `;
  }

  getTweakNav = () => {
    return /* html */`
      <ul class="main user nav">
        <li class="billing">
          <a href="/billing">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M3.3457 16.1976L16.1747 3.36866M18.6316 11.0556L16.4321 13.2551M14.5549 15.1099L13.5762 16.0886" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M3.17467 16.1411C1.60844 14.5749 1.60844 12.0355 3.17467 10.4693L10.4693 3.17467C12.0355 1.60844 14.5749 1.60844 16.1411 3.17467L20.8253 7.85891C22.3916 9.42514 22.3916 11.9645 20.8253 13.5307L13.5307 20.8253C11.9645 22.3916 9.42514 22.3916 7.85891 20.8253L3.17467 16.1411Z" stroke="currentColor" stroke-width="1.8" />
              <path d="M4 22H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span class="text">Subscriptions</span>
          </a>
        </li>
        <li class="dependents">
          <a href="/dependents">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M13 11C13 8.79086 11.2091 7 9 7C6.79086 7 5 8.79086 5 11C5 13.2091 6.79086 15 9 15C11.2091 15 13 13.2091 13 11Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M11.0386 7.55773C11.0131 7.37547 11 7.18927 11 7C11 4.79086 12.7909 3 15 3C17.2091 3 19 4.79086 19 7C19 9.20914 17.2091 11 15 11C14.2554 11 13.5584 10.7966 12.9614 10.4423" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M15 21C15 17.6863 12.3137 15 9 15C5.68629 15 3 17.6863 3 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M21 17C21 13.6863 18.3137 11 15 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="text">Dependents</span>
          </a>
        </li>
        <li class="after-care">
          <a href="/after-care">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M19.4626 3.99352C16.7809 2.3486 14.4404 3.01148 13.0344 4.06738C12.4578 4.50033 12.1696 4.7168 12 4.7168C11.8304 4.7168 11.5422 4.50033 10.9656 4.06738C9.55962 3.01148 7.21909 2.3486 4.53744 3.99352C1.01807 6.1523 0.221719 13.2742 8.33953 19.2827C9.88572 20.4272 10.6588 20.9994 12 20.9994C13.3412 20.9994 14.1143 20.4272 15.6605 19.2827C23.7783 13.2742 22.9819 6.1523 19.4626 3.99352Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M16 13H15C14.5447 13 14.0655 13.0352 13.6569 12.7214C13.5011 12.6017 13.3977 12.4363 13.191 12.1056L11.5 9L8.5 14L6.94338 11.8321C6.68722 11.5247 6.43747 11.213 6.09845 11.0897C5.85189 11 5.56792 11 5 11H3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="text">AfterCare</span>
          </a>
        </li>
        <li class="support">
          <a href="/support">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M17 11.8045C17 11.4588 17 11.286 17.052 11.132C17.2032 10.6844 17.6018 10.5108 18.0011 10.3289C18.45 10.1244 18.6744 10.0222 18.8968 10.0042C19.1493 9.98378 19.4022 10.0382 19.618 10.1593C19.9041 10.3198 20.1036 10.6249 20.3079 10.873C21.2513 12.0188 21.7229 12.5918 21.8955 13.2236C22.0348 13.7334 22.0348 14.2666 21.8955 14.7764C21.6438 15.6979 20.8485 16.4704 20.2598 17.1854C19.9587 17.5511 19.8081 17.734 19.618 17.8407C19.4022 17.9618 19.1493 18.0162 18.8968 17.9958C18.6744 17.9778 18.45 17.8756 18.0011 17.6711C17.6018 17.4892 17.2032 17.3156 17.052 16.868C17 16.714 17 16.5412 17 16.1955V11.8045Z" stroke="currentColor" stroke-width="1.8"></path>
              <path d="M7 11.8046C7 11.3694 6.98778 10.9782 6.63591 10.6722C6.50793 10.5609 6.33825 10.4836 5.99891 10.329C5.55001 10.1246 5.32556 10.0224 5.10316 10.0044C4.43591 9.9504 4.07692 10.4058 3.69213 10.8732C2.74875 12.019 2.27706 12.5919 2.10446 13.2237C1.96518 13.7336 1.96518 14.2668 2.10446 14.7766C2.3562 15.6981 3.15152 16.4705 3.74021 17.1856C4.11129 17.6363 4.46577 18.0475 5.10316 17.996C5.32556 17.978 5.55001 17.8757 5.99891 17.6713C6.33825 17.5167 6.50793 17.4394 6.63591 17.3281C6.98778 17.0221 7 16.631 7 16.1957V11.8046Z" stroke="currentColor" stroke-width="1.8"></path>
              <path d="M20 10.5V9C20 5.13401 16.4183 2 12 2C7.58172 2 4 5.13401 4 9V10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M20 17.5C20 22 16 22 12 22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <span class="text">Support</span>
          </a>
        </li>
      </ul>
    `;
  }

  getSidebar = () => {
    return /* html */`
      <section class="sidebar">
       <sidebar-section section-title="Chats & Updates" description="Stay connected with your contacts and receive updates."></sidebar-section>
      </section>
    `;
  }

  getFooter = () => {
    const year = new Date().getFullYear();
    return /*html*/`
      <footer class="footer">
        <p class="copyright">Copyright &copy;<span class="year">${year}</span><span class="company"> Diasync Services</span>. All rights reserved.</p>
        <ul class="links">
          <li><a href="/terms">Terms of Service</a></li>
          <li><a href="mailto:isfescii@gmail.com">Developer</a></li>
          <li><a href="/privacy">Privacy</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </footer>
    `;
  }

  getToast = (status, text) => {
    return /* html */`
      <div id="toast" class="${status === true ? 'success' : 'error'}">
        <div id="img">${status === true ? this.getSuccesToast() : this.getErrorToast()}</div>
        <div id="desc">${text}</div>
      </div>
    `;
  }

  getSuccesToast = () => {
    return /* html */`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/checkmark-circle-02-solid-standard.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.75 22.5C5.81294 22.5 1 17.6871 1 11.75C1 5.81294 5.81294 1 11.75 1C17.6871 1 22.5 5.81294 22.5 11.75C22.5 17.6871 17.6871 22.5 11.75 22.5ZM16.5182 9.39018C16.8718 8.9659 16.8145 8.33534 16.3902 7.98177C15.9659 7.62821 15.3353 7.68553 14.9818 8.10981L10.6828 13.2686L8.45711 11.0429C8.06658 10.6524 7.43342 10.6524 7.04289 11.0429C6.65237 11.4334 6.65237 12.0666 7.04289 12.4571L10.0429 15.4571C10.2416 15.6558 10.5146 15.7617 10.7953 15.749C11.076 15.7362 11.3384 15.606 11.5182 15.3902L16.5182 9.39018Z" fill="currentColor"></path>
      </svg>
    `;
  }

  getErrorToast = () => {
    return /* html */`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/cancel-circle-solid-standard.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25C6.06294 1.25 1.25 6.06294 1.25 12ZM8.29293 8.29286C8.68348 7.90235 9.31664 7.90239 9.70714 8.29293L12 10.586L14.2929 8.29293C14.6834 7.90239 15.3165 7.90235 15.7071 8.29286C16.0976 8.68336 16.0976 9.31652 15.7071 9.70707L13.4141 12.0003L15.7065 14.2929C16.097 14.6835 16.097 15.3166 15.7064 15.7071C15.3159 16.0976 14.6827 16.0976 14.2922 15.7071L12 13.4146L9.70779 15.7071C9.31728 16.0976 8.68412 16.0976 8.29357 15.7071C7.90303 15.3166 7.90299 14.6835 8.2935 14.2929L10.5859 12.0003L8.29286 9.70707C7.90235 9.31652 7.90239 8.68336 8.29293 8.29286Z" fill="currentColor"></path>
      </svg>
    `;
  }

  getLoader = () => {
    return /* html */`
      <div class="loader-container">
        <div id="loader" class="loader"></div>
      </div>
    `;
  }

  // Provider
  getProviderContainer = () => {
    return /* html */`
      <provider-page kind="org" owner="false" verified="true" name="Marketplace" desc="This section provides a detailed overview of all the products available in the marketplace.">
      </provider-page>
    `;
  }

  getProductFeed = () => {
    return /* html */`
      <products-feed name="Pharmacy Medicines" kind="pharmacy" all="124">
        <p>Browse medicines and over-the-counter (OTC) drugs available at partnered pharmacies. <br/> Search by brand, generic name, or active ingredient.</p>
        <p>Check real-time stock and availability at nearby pharmacies, view dosing information and safety warnings, and choose pickup or delivery options.
        <br/>Prescription-only medicines require a valid prescription. Request prescription verification and consult a pharmacist for interactions and guidance.</p>
      </products-feed>
    `;
  }

  getBookingsFeed = () => {
    return /* html */`
      <bookings-container name="Boookings" active="all" all="124"></bookings-container>
    `;
  }

  getServicesFeed = () => {
    return /* html */`
      <services-container name="Services" kind="pharmacy" all="124">
        <p>Browse medicines and over-the-counter (OTC) drugs available at partnered pharmacies. <br/> Search by brand, generic name, or active ingredient.</p>
        <p>Check real-time stock and availability at nearby pharmacies, view dosing information and safety warnings, and choose pickup or delivery options.
        <br/>Prescription-only medicines require a valid prescription. Request prescription verification and consult a pharmacist for interactions and guidance.</p>
      </services-container>
    `;
  }

  getSpecialistsFeed = () => {
    return /* html */`
      <specialists-container name="Specialists" kind="pharmacy" all="124">
        <p>Browse specialists available at partnered pharmacies. <br/> Search by name, specialty, or location.</p>
        <p>Check real-time availability at nearby pharmacies, view profiles and qualifications, and choose in-person or telehealth options.
        <br/>Prescription-only consultations require a valid prescription. Request prescription verification and consult a pharmacist for interactions and guidance.</p>
      </specialists-container>
    `;
  }

  // store
  getStoreContainer = () => {
    return /* html */`
      <store-container name="Marketplace" desc="This section provides a detailed overview of all the products available in the marketplace.">
      </store-container>
    `;
  }

  getCartContainer = () => {
    return /* html */`
      <cart-container empty="false" name="Shopping Cart" kind="all">
        <p>This section provides a detailed overview of all the items in your shopping cart, showing medicine names, dosages, quantities, individual prices and current stock at partner pharmacies.</p>
        <p>For prescription-only medicines, ensure you have a valid prescription ready for verification during checkout.</p>
      </cart-container>
    `;
  }

  getPickupContainer = () => {
    return /* html */`
      <pickup-container name="Pickup Station" kind="all" desc="This section provides a detailed overview of all the pickup stations available."></pickup-container>
    `;
  }

  getWalletAccount = () => {
    return /* html */`
      <wallet-account
        account="EAC65376462I" balance="76672.1" status="active" since="2021-09-12T12:00:00Z"
        last-spent="47894.65" last-deposited="695212.5" current-spent="98854.5" current-deposited="737512.5"
        last-earned="86687.54" current-earned="9357.43">
      </wallet-account>
    `;
  }

  getProductDetail = () => {
    return /* html */`
      <product-detail
        url="/product/AMX500"
        hex="AMX500-01" last="12.50"
        store="HealthPlus Pharmacy" average-review="4.5" wished="false"
        in-cart="0" quantity="120"
        main-image="/src/img/products/drug12.jpg"
        description="Amoxicillin 500mg capsules — a commonly prescribed penicillin antibiotic for treating a range of bacterial infections. Use exactly as directed by a healthcare professional."
        images="/src/img/products/drug12.jpg, /src/img/products/drug13.jpg, /src/img/products/drug14.jpg, /src/img/products/drug15.jpg, /src/img/products/drug16.jpg, /src/img/products/drug17.jpg, /src/img/products/drug18.jpg, /src/img/products/drug19.jpg, /src/img/products/drug20.jpg"
        previous-price="715.00"
        current-price="412.50"
        name="Amoxicillin 500mg Capsules"
        dosages='{
          "250mg": {"quantity": 40, "name": "250mg"},
          "500mg": {"quantity": 120, "name": "500mg"},
          "750mg": {"quantity": 0, "name": "750mg"}
        }'
        tags="antibiotic, amoxicillin, capsule, prescription"
        specifications='{
          "active_ingredient": "Amoxicillin",
          "strength": "500mg",
          "form": "capsule",
          "manufacturer": "HealthPlus Labs",
          "indications": "Bacterial infections - respiratory, urinary, skin",
          "contraindications": "Penicillin allergy"
        }'
        reviews="1248"
        reviews-distribution='{
          "one": 24,
          "two": 56,
          "three": 142,
          "four": 512,
          "five": 514
        }'
        store-name="HealthPlus Pharmacy"
        store-image="/src/img/products/drug1.jpg"
        store-url="/store/healthplus-001"
        store-location="Nairobi, Kenya"
        store-country="KE"
        store-hash="HPH001">
        <p>Amoxicillin 500mg capsules — a commonly prescribed penicillin antibiotic for treating a range of bacterial infections. Use exactly as directed by a healthcare professional.</p>
        <p>Prescription required for this medicine. Check dosage instructions, possible side effects, and interactions with other medicines. Consult your pharmacist if you have allergy history or are pregnant/breastfeeding.</p>
        <p>Store pickup and delivery available where permitted. For prescription verification, upload a valid prescription at checkout or visit the pharmacy for in-person verification.</p>
      </product-detail>
    `;
  }

  _expandDropdown(parentLi) {
    if (!parentLi) return;

    // Remove collapsed class and add active class to show vertical line
    parentLi.classList.remove('collapsed');
    parentLi.classList.add('active');

    // Get the dropdown and expand it
    const dropdown = parentLi.querySelector('ul.dropdown');
    if (dropdown) {
      // Set max height to scrollHeight to show the dropdown
      dropdown.style.maxHeight = (dropdown.scrollHeight + 7) + 'px';
    }

    // Close other dropdowns
    const specialNavUls = this.shadowRoot.querySelectorAll('section.nav > ul.nav.special');
    specialNavUls.forEach(ul => {
      const item = ul.querySelector('li');
      if (item && item !== parentLi) {
        item.classList.add('collapsed');
        item.classList.remove('active');
        const otherDropdown = item.querySelector('ul.dropdown');
        if (otherDropdown) {
          otherDropdown.style.maxHeight = '0px';
        }
      }
    });
  }

  getStyles() {
    return /* css */`
	    <style>
	      *,
	      *:after,
	      *:before {
	        box-sizing: border-box !important;
	        font-family: inherit;
	        -webkit-box-sizing: border-box !important;
	      }

	      *:focus {
	        outline: inherit !important;
	      }

	      *::-webkit-scrollbar {
	        width: 3px;
	      }

	      *::-webkit-scrollbar-track {
	        background: var(--scroll-bar-background);
	      }

	      *::-webkit-scrollbar-thumb {
	        width: 3px;
	        background: var(--scroll-bar-linear);
	        border-radius: 50px;
	      }

	      h1,
	      h2,
	      h3,
	      h4,
	      h5,
	      h6 {
	        font-family: inherit;
	      }

	      a {
	        text-decoration: none;
	      }

	      :host {
          font-size: 16px;
          width: 100%;
          min-width: 100%;
          max-width: 100%;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 20px;
        }

        div.loader-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          min-width: 100%;
        }

        div.loader-container > .loader {
          width: 20px;
          aspect-ratio: 1;
          border-radius: 50%;
          background: var(--accent-linear);
          display: grid;
          animation: l22-0 2s infinite linear;
        }

        div.loader-container > .loader:before {
          content: "";
          grid-area: 1/1;
          margin: 15%;
          border-radius: 50%;
          background: var(--second-linear);
          transform: rotate(0deg) translate(150%);
          animation: l22 1s infinite;
        }

        div.loader-container > .loader:after {
          content: "";
          grid-area: 1/1;
          margin: 15%;
          border-radius: 50%;
          background: var(--accent-linear);
          transform: rotate(0deg) translate(150%);
          animation: l22 1s infinite;
        }

        div.loader-container > .loader:after {
          animation-delay: -.5s
        }

        @keyframes l22-0 {
          100% {transform: rotate(1turn)}
        }

        @keyframes l22 {
          100% {transform: rotate(1turn) translate(150%)}
        }

        section.nav {
          width: 220px;
          display: flex;
          flex-flow: column;
          gap: 5px;
          padding: 10px 0 20px 10px;
          height: 100dvh;
          max-height: 100dvh;
          overflow-y: scroll;
          scrollbar-width: none;
          position: sticky;
          top: 0;
        }

        section.nav::-webkit-scrollbar {
          visibility: hidden;
          display: none;
        }

        section.nav > ul.nav.main {
          border-top: var(--border);
          padding: 10px 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          align-items: center;
          width: 100%;
          gap: 5px;
        }

        section.nav > ul.nav.main {
          border: none;
          padding: 0;
        }

        section.nav > ul.nav.logo {
          margin: 0;
          border: none;
          padding: 0;
        }

        section.nav > ul.main.nav > li {
          /* border: thin solid black; */
          padding: 0;
          width: 100%;
          display: flex;
          justify-content: start;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          color: var(--text-color);
          transition: all 0.3s ease;
          border-radius: 7px;
        }

        section.nav > ul.nav.main > li:hover,
        section.nav > ul.nav.main > li.active {
          color: var(--accent-color);
        }

        section.nav > ul.nav.main > li > a {
          padding: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          color: inherit;
          border-radius: 7px;
        }

        section.nav > ul.nav.main > li.active {
          background: var(--tab-background);
        }

        section.nav > ul.nav.main > li > a > svg {
          width: 22px;
          height: 22px;
        }

        section.nav > ul.nav.main > li > a > span.text {
          color: inherit;
          font-family: var(--font-text), sans-serif;
          font-size: 1rem;
          font-weight: 500;
        }

        /* External link styles */
        section.nav > ul.nav.main > li > a.external-link {
          justify-content: space-between;
          width: 100%;
          padding: 5px;
          display: flex;
          align-items: center;
          color: inherit;
          border-radius: 7px;
        }

        section.nav > ul.nav.main > li > a.external-link > .link-content {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        section.nav > ul.nav.main > li > a.external-link > .external-icon {
          width: 16px;
          height: 16px;
          opacity: 0.7;
          flex-shrink: 0;
        }

        section.nav > ul.nav > li.logo {
          gap: 10px;
          margin: 0;
          border-bottom: var(--border);
        }

        section.nav > ul.nav > li.logo > a {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        section.nav > ul.nav > li.logo > a > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        section.nav > ul.nav > li.logo > span.tooltip > span.text {
          font-family: var(--font-main), sans-serif;
          font-size: 1.5rem;
          padding: 0 0 0 5px;
          color: transparent;
          background: var(--accent-linear);
          font-weight: 700;
          line-height: 1.5;
          background-clip: text;
          -webkit-backdrop-clip: text;
          text-transform: capitalize;
        }

        /* special navs */
        section.nav > ul.nav.special {
          /* Container for a special nav group like Cache, Pricing */
          padding: 0;
          margin: 0; /* Adds space between different special nav groups */
          list-style-type: none;
          width: 100%;
        }

        section.nav > ul.nav.special > li {
          width: 100%;
          position: relative;
          border-radius: 7px;
        }

        section.nav > ul.nav.special > li > div.link-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 5px; /* Padding for the clickable header */
          cursor: pointer;
          color: var(--text-color);
          border-top: var(--border);
          border-bottom: var(--border);
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        section.nav > ul.nav.special > li > div.link-section:hover {
          color: var(--accent-color);
        }

        section.nav > ul.nav.special > li > div.link-section > span.left {
          display: flex;
          align-items: center;
          gap: 8px; /* Space between icon and text */
        }

        section.nav > ul.nav.special > li > div.link-section > span.left > svg {
          width: 22px;
          height: 22px;
          color: inherit;
        }

        section.nav > ul.nav.special > li > div.link-section > span.left > svg#other {
          width: 24px;
          height: 24px;
          color: inherit;
        }

        section.nav > ul.nav.special > li > div.link-section > span.left > span.text {
          color: inherit;
          display: inline-block;
          margin-top: 2px;
          font-family: var(--font-text), sans-serif;
          font-size: 1rem;
          font-weight: 500; /* Make header text slightly bolder */
        }

        section.nav > ul.nav.special > li > div.link-section > span.right > svg {
          width: 18px;
          height: 18px;
          color: inherit;
          transition: transform 0.3s ease-in-out;
        }

        section.nav > ul.nav.special > li > ul.dropdown {
          list-style-type: none;
          padding: 8px 5px 5px; /* Padding for the dropdown container */
          margin: 0;
          opacity: 1;
          position: relative; /* Added for ::before positioning */
          min-height: max-content;
          transition: max-height 0.35s ease-out-in, opacity 0.3s ease-out-in, padding 0.3s ease-out-in, margin 0.3s ease-out-in, border-color 0.3s ease-in-out;
        }

        /* the last dropdown item */
        section.nav > ul.nav.special > li > ul.dropdown.last {
          border-bottom: var(--border);
        }

        section.nav > ul.nav.special > li.collapsed > div.link-section > span.right > svg {
          transform: rotate(-90deg); /* Rotate icon when collapsed */
        }

        section.nav > ul.nav.special > li > ul.dropdown > li {
          width: calc(100% - 10px);
          padding: 0; /* Padding for sub-items */
          margin: 0; /* Indent sub-items */
          list-style-type: none;
          position: relative;
          display: flex;
        }

        section.nav > ul.nav.special > li > ul.dropdown > li > a {
          padding: 7px 14px 7px 18px; /* Padding for dropdown links */
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--gray-color);
          border-radius: 5px; /* Slightly smaller radius for sub-items */
          width: 100%;
          font-family: var(--font-text), sans-serif;
          font-size: 0.95rem; /* Slightly smaller font for sub-items */
          font-weight: 400;
          transition: background-color 0.2s ease, color 0.2s ease;
          box-sizing: border-box;
        }

        section.nav > ul.nav.special > li > ul.dropdown > li > a:hover {
          background: var(--gray-background); /* Consistent with normal nav item hover */
        }
        section.nav > ul.nav.special > li > ul.dropdown > li.active > a {
          color: var(--accent-color);
          background: var(--tab-background); /* Consistent with normal nav item active/hover */
        }

        section.nav > ul.nav.special > li > ul.dropdown > li::before {
          content: '';
          position: absolute;
          display: inline-block;
          width: 8px;
          height: 1px;
          left: 4px;
          top: 50%;
          background-color: var(--gray-color);
          transform: translateY(-50%);
          z-index: 1;
        }

        section.nav > ul.nav.special > li > ul.dropdown > li.active::before {
          background-color: var(--accent-color);
          transition: background-color 0.2s ease;
        }

        section.nav > ul.nav.special > li > ul.dropdown > li:hover::before {
          background-color: var(--gray-color);
          transition: background-color 0.2s ease;
        }

        section.nav > ul.nav.special > li > ul.dropdown > li > a > span.number.text {
          padding: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          /* border: 1px solid red; */
        }

        section.nav > ul.nav.special > li > ul.dropdown > li > a > span.number.text > span.number-items {
          padding: 1px 5px;
          display: flex;
          min-width: max-content;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          color: var(--rating-color);
          border-radius: 8px;
          border: var(--rating-border);
          font-family: var(--font-read), sans-serif;
        }

        section.nav > ul.nav.special > li > ul.dropdown > li > a > span.number.text.meeting > span.number-items {
          color: var(--accent-color);
          border: var(--action-border);
        }

        section.nav > ul.nav.special > li > ul.dropdown > li > a > span.number.text.booking > span.number-items {
          color: var(--anchor-color);
          border: var(--anchor-border);
        }

        section.flow {
          width: calc(100% - (240px + 500px + 20px));
          height: 100dvh;
          max-height: 100dvh;
          display: flex;
          flex-flow: column;
          max-height: max-content;
          gap: 0;
          padding: 0;
          overflow-y: auto;
          scrollbar-width: none;
          position: sticky;
          top: 0;
        }

        section.flow::-webkit-scrollbar {
          visibility: hidden;
          display: none;
        }


        /* Latency Panel Styles */
        section.sidebar {
          width: 500px;
          height: 100dvh;
          padding: 0;
          background: var(--background);
          /* border-left: var(--border); */
          display: flex;
          flex-flow: column;
          max-height: 100dvh;
          gap: 0;
          z-index: 10;
          overflow-y: auto;
          scrollbar-width: none;
          position: sticky;
          top: 0;
        }

        section.sidebar::-webkit-scrollbar {
          visibility: hidden;
          display: none;
        }

        section.flow > div#content-container {
          width: 100%;
          min-height: calc(100dvh - 70px);
          max-height: max-content;
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 0;
        }

        /* Mobile section unavailable */
        section.mobile {
          width: 100%;
          height: 100dvh;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 0 10px;
        }

        section.mobile > h1.mobile-title {
          width: 100%;
          padding: 0;
          margin: 0;
          text-align: center;
          font-family: var(--font-text), sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.5;
          color: var(--accent-color);
        }

        section.mobile > p.mobile-description {
          width: 100%;
          padding: 0;
          margin: 0;
          font-family: var(--font-main), sans-serif;
          font-size: 1rem;
          text-align: center;
          font-weight: 400;
          color: var(--text-color);
        }

        section.mobile > p.mobile-warning {
          width: 100%;
          padding: 10px 0;
          margin: 0;
          text-align: center;
          font-family: var(--font-read), sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          color: var(--alt-color);
        }

        footer.footer {
          height: 70px;
          max-height: 70px;
          border-top: var(--border);
          padding: 13px 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          align-items: center;
          width: 100%;
          gap: 3px;
        }

        footer.footer > p {
          margin: 0;
          text-align: center;
          padding: 0;
          font-family: var(--font-read), sans-serif;
          font-size: 1rem;
          color: var(--gray-color);
        }

        footer.footer > p > span.year {
          font-size: 1rem;
          font-family: var(--font-read), sans-serif;
        }

        footer.footer > p > span.company {
          font-size: 0.9rem;
          display: inline-block;
          padding: 0 0 0 5px;
          color: var(--alt-color);
          font-family: var(--font-text), sans-serif;
        }

        footer.footer > ul.links {
          text-align: center;
          padding: 0;
          margin: 0;
          display: flex;
          flex-flow: row;
          width: 100%;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }

        section.mobile > footer.footer {
          width: 100%;
          margin: 30px 0 0 0;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        section.mobile > footer.footer > ul.links {
          padding: 10px 0;
          flex-flow: row wrap;
          column-gap: 10px;
        }

        footer.footer > ul.links > li {
          padding: 0;
          margin: 0 0 0 12px;
          list-style-type: default;
          color: var(--gray-color);
        }

        footer.footer > ul.links > li > a {
          font-family: var(--font-read), sans-serif;
          font-size: 0.9rem;
          color: var(--gray-color);
        }

        footer.footer > ul.links > li > a:hover {
          color: var(--anchor-color);
        }

        /* Mobile Styles */
        @media all and (max-width: 700px) {
          section.flow {
            width: 100%;
            height: 100dvh;
            max-height: 100dvh;
            display: flex;
            flex-flow: column;
            max-height: max-content;
            gap: 0;
            padding: 0;
            overflow-y: auto;
            scrollbar-width: none;
            position: sticky;
            top: 0;
          }

          section.flow::-webkit-scrollbar {
            visibility: hidden;
            display: none;
          }

          /* Latency Panel Styles */
          section.sidebar {
            width: 100%;
            height: 100dvh;
            padding: 0;
            background: var(--background);
            /* border-left: var(--border); */
            display: flex;
            flex-flow: column;
            max-height: 100dvh;
            gap: 0;
            overflow-y: auto;
            scrollbar-width: none;
            position: sticky;
            top: 0;
          }

          section.sidebar::-webkit-scrollbar {
            visibility: hidden;
            display: none;
          }

          section.flow > div#content-container {
            width: 100%;
            min-height: calc(100dvh - 70px);
            max-height: max-content;
            display: flex;
            flex-flow: column;
            gap: 0;
            padding: 60px 0 0;
          }

          section.nav {
						/*border-top: var(--border);*/
						box-shadow: var(--footer-shadow);
						width: 100%;
						display: flex;
						padding: 0;
						flex-flow: row;
						gap: 0;
						position: fixed;
						bottom: 0;
						top: unset;
						height: 55px;
						left: 0;
						right: 0;
						z-index: 10;
						background: var(--background);
					}

					section.nav > div.mobile-nav {
						width: 100%;
						display: flex;
						flex-flow: row;
						justify-content: space-between;
						align-items: center;
						padding: 0 10px;
						height: 100%;
						gap: 0;
            border-top: var(--border);
						position: relative;
					}

					section.nav > div.mobile-nav > div.icons {
						display: flex;
						flex-flow: row;
						justify-content: space-between;
						align-items: center;
						gap: 0;
						width: 100%;
						height: 100%;
						position: relative;
					}

					section.nav > div.mobile-nav > div.icons > span.icon {
						display: flex;
						flex-flow: column;
						justify-content: center;
						align-items: center;
						gap: 0;
						width: max-content;
						height: 100%;
						color: var(--gray-color);
						position: relative;
					}

					section.nav > div.mobile-nav > div.icons > span.icon > span.bar {
						display: none;
					}

					section.nav > div.mobile-nav > div.icons > span.icon.active > span.bar {
						display: inline-block;
						width: 100%;
						height: 4px;
						border-radius: 5px;
						position: absolute;
						background: var(--accent-linear);
						top: -2.5px;
						left: 50%;
						z-index: 11;
						transform: translateX(-50%);
					}

					section.nav > div.mobile-nav > div.icons > span.icon.active {
						color: var(--accent-color);
					}

					section.nav > div.mobile-nav > div.icons > span.icon > svg {
						width: 26px;
						height: 26px;
						color: inherit;
					}

          section.nav > div.mobile-nav > div.icons > span.icon.more > svg {
						width: 26px;
						height: 26px;
            margin-bottom: 5px;
						color: inherit;
					}

					section.nav > div.mobile-nav > div.icons > span.icon > span.text {
						font-size: 0.8rem;
						font-family: var(--font-read), sans-serif;
						color: inherit;
						display: flex;
					}

					section.nav > div.mobile-nav > div.icons > span.icon.active > span.text {
						font-family: var(--font-text), sans-serif;
						font-weight: 500;
					}

					section.nav > div.mobile-nav > div.icons > span.icon.profile {
						display: flex;
						flex-flow: column;
						justify-content: center;
						align-items: center;
					}

					section.nav > div.mobile-nav > div.icons > span.icon.profile > div.avatar {
						width: 30px;
						height: 30px;
						border-radius: 50%;
						overflow: hidden;
					}

					section.nav > div.mobile-nav > div.icons > span.icon.profile > div.avatar > img {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}
        }
	    </style>
    `;
  }
}