import APIManager from "./api.js";
import formatNumber from "./number.js";
import uis from "./uis/index.js"

export default class AppMain extends HTMLElement {
  constructor() {
    super();
    this.content = this.getContent();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.registerComponents();
    this.api = new APIManager(this.getAttribute('api'), 9500, 'v1');
    window.app = this;
    this.format = formatNumber;
    this.mql = window.matchMedia('(max-width: 660px)');
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

  connectedCallback() {
    this.setUpEvents();
    this._setupSpecialNavs();
    this._setupNavLinks(); // Add navigation link event handlers
    this._loadInitialContent(); // Load content based on the current URL
  }

  _loadInitialContent() {
    // Get the current path from the browser
    const currentPath = window.location.pathname;

    // Update the active navigation item based on the current URL
    this._updateActiveNavItem(currentPath);

    // Load the content for this URL
    if (this.getNavContents[currentPath]) {
      const container = this.shadowObj.querySelector('section.flow > div#content-container.content-container');
      if (container) container.innerHTML = this.getNavContents[currentPath];
    } else if (currentPath !== '/' && currentPath !== '/dashboard') {
      // If a path is not in nav contents and not the root path, show 404/default
      const container = this.shadowObj.querySelector('section.flow > div#content-container.content-container');
      if (container) {
        container.innerHTML = this.getNavContents.default;
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
        const content = this.getNavContents[url] || this.getNavContents.default;

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
    if (container && (currentPath === '/' || !this.getNavContents[currentPath])) {
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
      this.setUpEvents();
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
    const content = state ? state : this.getNavContents[url] || this.getNavContents.default;
    this.push(url, content, url);
    // set the loader
    container.innerHTML = this.getLoader();
    window.scrollTo(0, 0);

    // Update current URL reference
    this.currentUrl = url;

    // check if the URL is in the nav contents
    if (this.getNavContents[url]) {
      this.updateHistory(this.getNavContents[url]);
      return;
    }

    // if the URL is not in the nav contents, show the 404 page
    this.updateHistory(this.getNavContents.default);
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
      const content = this.getNavContents[url] || this.getNavContents.default;
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

  registerComponents = () => {
    // Register all components here
    uis('Apps registered');
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

  getNavContents = {
    "/": /* HTML */`<health-home></health-home>`,
    "/providers": /* HTML */`<provider-directory api="/providers/directory"></provider-directory>`,
    "/bookings": /* HTML */`<booking-management api="/bookings/all"></booking-management>`,
    "/meetings": /* HTML */`<meeting-management api="/meetings/dashboard"></meeting-management>`,
    "/pharmacy": /* HTML */`<pharmacy-orders api="/pharmacy/orders"></pharmacy-orders>`,
    "/ambulance": /* HTML */`<ambulance-dispatch api="/ambulance/dispatch"></ambulance-dispatch>`,
    "/dependents": /* HTML */`<dependent-management api="/dependents/all"></dependent-management>`,
    "/payments": /* HTML */`<payment-history api="/payments/history"></payment-history>`,
    "/subscriptions": /* HTML */`<subscription-management api="/subscriptions/active"></subscription-management>`,
    "/settings": /* HTML */`<user-settings api="/settings/profile"></user-settings>`,

    /* Enhanced Health Platform Routes */
    "/bookings/telemedicine": /* HTML */`<telemedicine-bookings api="/bookings/telemedicine"></telemedicine-bookings>`,
    "/bookings/in-person": /* HTML */`<in-person-bookings api="/bookings/in-person"></in-person-bookings>`,
    "/bookings/video-calls": /* HTML */`<video-call-management api="/bookings/video-calls"></video-call-management>`,

    /* Meeting & Video Call Routes */
    "/meetings/upcoming": /* HTML */`<upcoming-meetings api="/meetings/upcoming"></upcoming-meetings>`,
    "/meetings/live": /* HTML */`<live-sessions api="/meetings/live"></live-sessions>`,
    "/meetings/scheduled": /* HTML */`<scheduled-meetings api="/meetings/scheduled"></scheduled-meetings>`,
    "/meetings/completed": /* HTML */`<completed-meetings api="/meetings/completed"></completed-meetings>`,
    "/meetings/recordings": /* HTML */`<meeting-recordings api="/meetings/recordings"></meeting-recordings>`,
    "/meetings/transcripts": /* HTML */`<meeting-transcripts api="/meetings/transcripts"></meeting-transcripts>`,
    "/meetings/join-room": /* HTML */`<meeting-room api="/meetings/join-room"></meeting-room>`,
    "/meetings/test-connection": /* HTML */`<connection-test api="/meetings/test-connection"></connection-test>`,

    "/providers/kmpdc-verified": /* HTML */`<kmpdc-verified-providers api="/providers/kmpdc-verified"></kmpdc-verified-providers>`,
    "/providers/verification-status": /* HTML */`<provider-verification api="/providers/verification-status"></provider-verification>`,
    "/providers/ratings": /* HTML */`<provider-ratings api="/providers/ratings"></provider-ratings>`,
    "/providers/compliance": /* HTML */`<provider-compliance api="/providers/compliance"></provider-compliance>`,
    "/pharmacy/prescriptions": /* HTML */`<prescription-management api="/pharmacy/prescriptions"></prescription-management>`,
    "/pharmacy/otc-products": /* HTML */`<otc-products api="/pharmacy/otc-products"></otc-products>`,
    "/dependents/health-records": /* HTML */`<health-records api="/dependents/health-records"></health-records>`,
    "/dependents/medical-history": /* HTML */`<medical-history api="/dependents/medical-history"></medical-history>`,
    "/dependents/emergency-contacts": /* HTML */`<emergency-contacts api="/dependents/emergency-contacts"></emergency-contacts>`,
    "/dependents/elderly-care": /* HTML */`<elderly-care-management api="/dependents/elderly-care"></elderly-care-management>`,
    "/dependents/chronic-conditions": /* HTML */`<chronic-conditions api="/dependents/chronic-conditions"></chronic-conditions>`,
    "/settings/timezone": /* HTML */`<timezone-settings api="/settings/timezone"></timezone-settings>`,
    "/settings/privacy": /* HTML */`<privacy-settings api="/settings/privacy"></privacy-settings>`,

    /* Health Reports & Analytics Routes */
    "/reports/health-analytics": /* HTML */`<health-analytics api="/reports/health-analytics"></health-analytics>`,
    "/reports/family-health": /* HTML */`<family-health-report api="/reports/family-health"></family-health-report>`,
    "/reports/spending-summary": /* HTML */`<health-spending-report api="/reports/spending-summary"></health-spending-report>`,
    "/reports/appointment-history": /* HTML */`<appointment-history-report api="/reports/appointment-history"></appointment-history-report>`,
    "/reports/medication-tracking": /* HTML */`<medication-tracking-report api="/reports/medication-tracking"></medication-tracking-report>`,
    "/reports/provider-performance": /* HTML */`<provider-performance-report api="/reports/provider-performance"></provider-performance-report>`,
    "/reports/remittance-impact": /* HTML */`<remittance-impact-report api="/reports/remittance-impact"></remittance-impact-report>`,

    /* Provider Admin Routes */
    "/provider/dashboard": /* HTML */`<provider-dashboard api="/provider/dashboard"></provider-dashboard>`,
    "/provider/profile": /* HTML */`<provider-profile api="/provider/profile"></provider-profile>`,
    "/provider/staff": /* HTML */`<staff-management api="/provider/staff"></staff-management>`,
    "/provider/schedule": /* HTML */`<schedule-management api="/provider/schedule"></schedule-management>`,
    "/provider/appointments": /* HTML */`<appointment-management api="/provider/appointments"></appointment-management>`,
    "/provider/orders": /* HTML */`<provider-orders api="/provider/pharmacy/orders"></provider-orders>`,
    "/provider/ambulance": /* HTML */`<ambulance-requests api="/provider/ambulance/requests"></ambulance-requests>`,
    "/provider/financials": /* HTML */`<provider-financials api="/provider/financials"></provider-financials>`,
    "/provider/compliance": /* HTML */`<compliance-documents api="/provider/compliance"></compliance-documents>`,

    /* Provider Staff Routes */
    "/staff/appointments": /* HTML */`<staff-appointments api="/staff/appointments"></staff-appointments>`,
    "/staff/availability": /* HTML */`<staff-availability api="/staff/availability"></staff-availability>`,
    "/staff/profile": /* HTML */`<staff-profile api="/staff/profile"></staff-profile>`,
    "/staff/earnings": /* HTML */`<staff-earnings api="/staff/earnings"></staff-earnings>`,

    /* Platform Admin Routes */
    "/admin/dashboard": /* HTML */`<admin-dashboard api="/admin/dashboard"></admin-dashboard>`,
    "/admin/users": /* HTML */`<admin-users api="/admin/users"></admin-users>`,
    "/admin/verification": /* HTML */`<admin-verification api="/admin/verification"></admin-verification>`,
    "/admin/complaints": /* HTML */`<admin-complaints api="/admin/complaints"></admin-complaints>`,
    "/admin/audit": /* HTML */`<admin-audit api="/admin/audit"></admin-audit>`,
    "/admin/content": /* HTML */`<admin-content api="/admin/content"></admin-content>`,

    /* Support & Help */
    "/support": /* HTML */`<support-center api="/support/center"></support-center>`,
    "/help": /* HTML */`<help-center api="/help/center"></help-center>`,
    "/about": /* HTML */`<about-page api="/about"></about-page>`,
    "/contact": /* HTML */`<contact-page api="/contact"></contact-page>`,

    default: /* HTML */`<health-home></health-home>`,
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
        <section class="mobile">
          <h1 class="mobile-title">Diasync Health Platform</h1>
          <p class="mobile-description">Diasync is a health services platform that connects diaspora communities with trusted healthcare providers in Kenya.</p>
          <p class="mobile-warning">The mobile version is not available yet. Please use the desktop or tablet version for the best experience.</p>
          ${this.getFooter()}
        </section>
      `;
    }
    else {
      // Only show navigation if authenticated
      return /* html */`
        ${this.getMainNav()}
        <section class="flow">
          <div id="content-container" class="content-container">
            ${this.getLoader()}
          </div>
          ${this.getFooter()}
        </section>
        ${this.getSidebar()}
      `;
    }
  }

  setContent = container => {
    setTimeout(() => {
      // set the content
      container.innerHTML = this.content;
    }, 1000);
  }

  getMainNav = () => {
    return /* html */`
      <section class="nav">
        ${this.getLogoNav()}
        ${this.getMainLinksNav()}
        ${this.getBookingsNav()}
        ${this.getMeetingsNav()}
        ${this.getProvidersNav()}
        ${this.getPharmacyNav()}
        ${this.getAmbulanceNav()}
        ${this.getOrdersNav()}
        ${this.getPaymentsNav()}
        ${this.getSubscriptionsNav()}
        ${this.getDependentsNav()}
        ${this.getHealthReportsNav()}
        ${this.getSettingsNav()}
        ${this.getSupportNav()}
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
         <li class="metrics">
          <a href="/metrics">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <circle cx="12" cy="18" r="3" stroke="currentColor" stroke-width="1.8"></circle>
              <path d="M12 15V10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M22 13C22 7.47715 17.5228 3 12 3C6.47715 3 2 7.47715 2 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            </svg>
            <span class="text">Metrics</span>
          </a>
        </li>
        <li class="performance">
          <a href="/performance">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M20 13V8H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M20 8L15 13C14.1174 13.8826 13.6762 14.3238 13.1346 14.3726C13.045 14.3807 12.955 14.3807 12.8654 14.3726C12.3238 14.3238 11.8826 13.8826 11 13C10.1174 12.1174 9.67615 11.6762 9.13457 11.6274C9.04504 11.6193 8.95496 11.6193 8.86543 11.6274C8.32385 11.6762 7.88256 12.1174 7 13L4 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <span class="text">Performance</span>
          </a>
        </li>
      </ul>
    `;
  }

  getBookingsNav = () => {
    return /* html */`
      <ul class="special nav opened">
        <li class="bookings active">
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
            <span class="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
          <ul class="dropdown">
            <li class="no-show">
              <a href="/bookings/missed"><span class="text">Missed</span></a>
            </li>
            <li class="in-person">
              <a href="/bookings/in-person"><span class="text">Physical</span></a>
            </li>
            <li class="pending">
              <a href="/bookings/pending"><span class="text">Pending</span></a>
            </li>
            <li class="cancelled">
              <a href="/bookings/cancelled"><span class="text">Cancelled</span></a>
            </li>
            <li class="confirmed">
              <a href="/bookings/confirmed"><span class="text">Confirmed</span></a>
            </li>
            <li class="completed">
              <a href="/bookings/completed"><span class="text">Completed</span></a>
            </li>
            <li class="rescheduled">
              <a href="/bookings/rescheduled"><span class="text">Rescheduled</span></a>
            </li>
            <li class="telemedicine">
              <a href="/bookings/telemedicine"><span class="text">Telemedicine</span></a>
            </li>
          </ul>
        </li>
      </ul>
    `;
  }

  getMeetingsNav = () => {
    return /* html */`
      <ul class="special nav">
        <li class="meetings">
          <div class="link-section">
            <span class="left">
              <svg id="other" width="24" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M19.398 9.42123C18.5435 9.86645 17.5071 10.5551 16.6173 11.2605C16.2927 11.5178 15.821 11.4633 15.5637 11.1387C15.3064 10.8141 15.3609 10.3424 15.6855 10.085C16.6338 9.33326 17.7498 8.58861 18.7048 8.09098C19.1775 7.84472 19.6454 7.64054 20.0517 7.53579C20.2531 7.48389 20.4795 7.44558 20.704 7.459C20.9262 7.47229 21.234 7.54337 21.4725 7.80062C21.611 7.94964 21.6971 8.12576 21.7533 8.26498C21.8136 8.41456 21.8623 8.58071 21.9028 8.75081C21.9839 9.09127 22.046 9.50567 22.0933 9.95535C22.1882 10.8582 22.2306 11.9738 22.2264 13.0756C22.2222 14.1778 22.1712 15.2873 22.0742 16.1785C22.026 16.6224 21.9646 17.0289 21.887 17.3598C21.8484 17.5249 21.8022 17.6862 21.7455 17.8306C21.694 17.9616 21.6111 18.1391 21.4718 18.2885C21.2241 18.5556 20.9016 18.6118 20.6929 18.6179C20.4747 18.6242 20.2539 18.5816 20.0577 18.5273C19.6604 18.4174 19.1971 18.2118 18.7249 17.9646C17.771 17.4651 16.6476 16.7248 15.6903 15.9786C15.3636 15.7239 15.3052 15.2527 15.5599 14.926C15.8145 14.5993 16.2858 14.5409 16.6125 14.7955C17.5123 15.4969 18.5603 16.1852 19.4207 16.6357C19.8308 16.8505 20.1695 16.9958 20.4141 17.0691C20.4182 17.0527 20.4224 17.0356 20.4266 17.0177C20.4846 16.7701 20.538 16.4306 20.583 16.0164C20.6727 15.1916 20.7223 14.1368 20.7264 13.0699C20.7305 12.0027 20.689 10.9445 20.6015 10.1122C20.5576 9.69433 20.5038 9.35084 20.4436 9.09852C20.4342 9.05907 20.425 9.02327 20.4161 8.99093C20.1717 9.05537 19.8242 9.19911 19.398 9.42123ZM20.3321 17.321C20.3321 17.321 20.3325 17.3203 20.3332 17.319C20.3325 17.3204 20.3322 17.321 20.3321 17.321Z" fill="currentColor"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.55499 8.15787C3.69851 9.01709 3.2644 10.4818 3.2644 13.037C3.2644 15.5916 3.69849 17.0564 4.55502 17.9157C5.41083 18.7744 6.86928 19.2098 9.41536 19.2098C11.9609 19.2098 13.4191 18.7744 14.2748 17.9158C15.1313 17.0564 15.5654 15.5916 15.5654 13.037C15.5654 10.4818 15.1313 9.01707 14.2749 8.15784C13.4192 7.29934 11.961 6.86411 9.41536 6.86411C6.86919 6.86411 5.41077 7.29935 4.55499 8.15787ZM3.49263 7.09891C4.79328 5.7941 6.78533 5.36411 9.41536 5.36411C12.0449 5.36411 14.0368 5.79411 15.3373 7.09894C16.6371 8.40304 17.0654 10.3997 17.0654 13.037C17.0654 15.6738 16.6371 17.6704 15.3373 18.9746C14.0368 20.2795 12.045 20.7098 9.41536 20.7098C6.78524 20.7098 4.79322 20.2796 3.4926 18.9746C2.1927 17.6704 1.7644 15.6738 1.7644 13.037C1.7644 10.3997 2.19268 8.40302 3.49263 7.09891Z" fill="currentColor"></path>
              </svg>
              <span class="text">Meetings</span>
            </span>
            <span class="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
          <ul class="dropdown">
            <li class="live">
              <a href="/meetings/live"><span class="text">Live</span></a>
            </li>
            <li class="hitory">
              <a href="/meetings/history"><span class="text">History</span></a>
            </li>
            <li class="upcoming">
              <a href="/meetings/upcoming"><span class="text">Upcoming</span></a>
            </li>
            <li class="scheduled">
              <a href="/meetings/scheduled"><span class="text">Scheduled</span></a>
            </li>
            <li class="completed">
              <a href="/meetings/completed"><span class="text">Completed</span></a>
            </li>
            <li class="recordings">
              <a href="/meetings/recordings"><span class="text">Recordings</span></a>
            </li>
            <li class="transcripts">
              <a href="/meetings/transcripts"><span class="text">Transcripts</span></a>
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
            <span class="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
          <ul class="dropdown">
            <li class="verification-status">
              <a href="/providers/status"><span class="text">Status</span></a>
            </li>
            <li class="clinics">
              <a href="/providers/clinics"><span class="text">Clinics</span></a>
            </li>
            <li class="ratings">
              <a href="/providers/ratings"><span class="text">Ratings</span></a>
            </li>
            <li class="doctors">
              <a href="/providers/doctors"><span class="text">Doctors</span></a>
            </li>
            <li class="kmpdc-verified">
              <a href="/providers/verified"><span class="text">Verified</span></a>
            </li>
            <li class="directory">
              <a href="/providers/directory"><span class="text">Directory</span></a>
            </li>
            <li class="hospitals">
              <a href="/providers/hospitals"><span class="text">Hospitals</span></a>
            </li>
            <li class="specialists">
              <a href="/providers/specialists"><span class="text">Specialists</span></a>
            </li>
            <li class="compliance">
              <a href="/providers/compliance"><span class="text">Compliance</span></a>
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
            <span class="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
          <ul class="dropdown">
            <li class="orders">
              <a href="/pharmacy/orders"><span class="text">Orders</span></a>
            </li>
            <li class="pending">
              <a href="/pharmacy/pending"><span class="text">Pending</span></a>
            </li>
            <li class="fulfilled">
              <a href="/pharmacy/fulfilled"><span class="text">Fulfilled</span></a>
            </li>
            <li class="delivered">
              <a href="/pharmacy/delivered"><span class="text">Delivered</span></a>
            </li>
            <li class="processing">
              <a href="/pharmacy/processing"><span class="text">Processing</span></a>
            </li>
            <li class="pharmacies">
              <a href="/pharmacy/pharmacies"><span class="text">Pharmacies</span></a>
            </li>
            <li class="prescriptions">
              <a href="/pharmacy/prescriptions"><span class="text">Prescriptions</span></a>
            </li>
          </ul>
        </li>
      </ul>
    `;
  }

  getAmbulanceNav = () => {
    return /* html */`
      <ul class="special nav">
        <li class="ambulance">
          <div class="link-section">
            <span class="left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M11 18H15M13.5 8H14.4429C15.7533 8 16.4086 8 16.9641 8.31452C17.5196 8.62904 17.89 9.20972 18.6308 10.3711C19.1502 11.1854 19.6955 11.7765 20.4622 12.3024C21.2341 12.8318 21.6012 13.0906 21.8049 13.506C22 13.9038 22 14.375 22 15.3173C22 16.5596 22 17.1808 21.651 17.5755C21.636 17.5925 21.6207 17.609 21.6049 17.625C21.2375 18 20.6594 18 19.503 18H19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M5 18C3.58579 18 2.87868 18 2.43934 17.5607C2 17.1213 2 16.4142 2 15V8C2 6.58579 2 5.87868 2.43934 5.43934C2.87868 5 3.58579 5 5 5H10.5C11.9142 5 12.6213 5 13.0607 5.43934C13.5 5.87868 13.5 6.58579 13.5 8V18H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M22 15H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M8 9V13M10 11L6 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <circle cx="17" cy="18" r="2" stroke="currentColor" stroke-width="1.8"></circle>
                <circle cx="7" cy="18" r="2" stroke="currentColor" stroke-width="1.8"></circle>
              </svg>
              <span class="text">Ambulance</span>
            </span>
            <span class="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
          <ul class="dropdown">
            <li class="dispatch">
              <a href="/ambulance/dispatch"><span class="text">Dispatch</span></a>
            </li>
            <li class="requests">
              <a href="/ambulance/requests"><span class="text">Requests</span></a>
            </li>
            <li class="en-route">
              <a href="/ambulance/en-route"><span class="text">En Route</span></a>
            </li>
            <li class="on-scene">
              <a href="/ambulance/on-scene"><span class="text">On Scene</span></a>
            </li>
            <li class="transport">
              <a href="/ambulance/transport"><span class="text">Transport</span></a>
            </li>
            <li class="completed">
              <a href="/ambulance/completed"><span class="text">Completed</span></a>
            </li>
            <li class="emergency">
              <a href="/ambulance/emergency"><span class="text">Emergency</span></a>
            </li>
          </ul>
        </li>
      </ul>
    `;
  }

  getOrdersNav = () => {
    return /* html */`
      <ul class="special nav">
        <li class="orders">
          <div class="link-section">
            <span class="left">
              <svg id="other" width="24" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.43787 7.4209C7.44386 4.91878 9.47628 2.8949 11.9793 2.8997C14.4811 2.90569 16.5052 4.93856 16.4999 7.44022C16.4999 7.44065 16.4999 7.44107 16.4999 7.44149L15.7499 7.4397L16.4999 7.44022V10.4717C16.4999 10.8859 16.1641 11.2217 15.7499 11.2217C15.3357 11.2217 14.9999 10.8859 14.9999 10.4717V7.4397L14.9999 7.4379C15.0039 5.76426 13.6501 4.4039 11.9764 4.39969C10.3019 4.39668 8.94233 5.75028 8.93787 7.42364V10.4717C8.93787 10.8859 8.60208 11.2217 8.18787 11.2217C7.77365 11.2217 7.43787 10.8859 7.43787 10.4717L7.43787 7.4209Z" fill="currentColor"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.38521 10.2834C4.24823 11.1733 3.69995 12.6443 3.69995 15.2075C3.69995 17.7702 4.2482 19.2409 5.38518 20.1307C6.57922 21.0652 8.60338 21.5155 11.969 21.5155C15.3345 21.5155 17.3587 21.0652 18.5527 20.1307C19.6897 19.2409 20.238 17.7702 20.238 15.2075C20.238 12.6443 19.6897 11.1733 18.5527 10.2834C17.3587 9.34881 15.3345 8.8985 11.969 8.8985C8.60338 8.8985 6.57924 9.34881 5.38521 10.2834ZM4.46069 9.10214C6.08517 7.83069 8.57053 7.3985 11.969 7.3985C15.3674 7.3985 17.8527 7.83069 19.4772 9.10214C21.1587 10.4182 21.738 12.4767 21.738 15.2075C21.738 17.9378 21.1587 19.996 19.4772 21.312C17.8527 22.5833 15.3674 23.0155 11.969 23.0155C8.57052 23.0155 6.08519 22.5833 4.46072 21.312C2.7792 19.996 2.19995 17.9378 2.19995 15.2075C2.19995 12.4767 2.77918 10.4182 4.46069 9.10214Z" fill="currentColor"></path>
              </svg>
              <span class="text">Orders</span>
            </span>
            <span class="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
          <ul class="dropdown">
            <li class="all">
              <a href="/orders/all"><span class="text">All</span></a>
            </li>
            <li class="basket">
              <a href="/orders/basket"><span class="text">Basket</span></a>
            </li>
             <li class="shipped">
              <a href="/orders/shipped"><span class="text">Shipped</span></a>
            </li>
            <li class="pending">
              <a href="/orders/pending"><span class="text">Pending</span></a>
            </li>
            <li class="delivered">
              <a href="/orders/delivered"><span class="text">Delivered</span></a>
            </li>
            <li class="refunded">
              <a href="/orders/refunded"><span class="text">Refunded</span></a>
            </li>
            <li class="cancelled">
              <a href="/orders/cancelled"><span class="text">Cancelled</span></a>
            </li>
            <li class="confirmed">
              <a href="/orders/confirmed"><span class="text">Confirmed</span></a>
            </li>
            <li class="completed">
              <a href="/orders/completed"><span class="text">Completed</span></a>
            </li>
            <li class="processing">
              <a href="/orders/processing"><span class="text">Processing</span></a>
            </li>
          </ul>
        </li>
      </ul>
    `;
  }

  getPaymentsNav = () => {
    return /* html */`
      <ul class="special nav">
        <li class="payments">
          <div class="link-section">
            <span class="left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M3 8.5H15C17.8284 8.5 19.2426 8.5 20.1213 9.37868C21 10.2574 21 11.6716 21 14.5V15.5C21 18.3284 21 19.7426 20.1213 20.6213C19.2426 21.5 17.8284 21.5 15 21.5H9C6.17157 21.5 4.75736 21.5 3.87868 20.6213C3 19.7426 3 18.3284 3 15.5V8.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15 8.49833V4.1103C15 3.22096 14.279 2.5 13.3897 2.5C13.1336 2.5 12.8812 2.56108 12.6534 2.67818L3.7623 7.24927C3.29424 7.48991 3 7.97203 3 8.49833" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M17.5 15.5C17.7761 15.5 18 15.2761 18 15C18 14.7239 17.7761 14.5 17.5 14.5M17.5 15.5C17.2239 15.5 17 15.2761 17 15C17 14.7239 17.2239 14.5 17.5 14.5M17.5 15.5V14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="text">Payments</span>
            </span>
            <span class="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
          <ul class="dropdown">
            <li class="failed">
              <a href="/payments/failed"><span class="text">Failed</span></a>
            </li>
            <li class="history">
              <a href="/payments/history"><span class="text">History</span></a>
            </li>
            <li class="refunds">
              <a href="/payments/refunds"><span class="text">Refunds</span></a>
            </li>
            <li class="methods">
              <a href="/payments/methods"><span class="text">Methods</span></a>
            </li>
            <li class="pending">
              <a href="/payments/pending"><span class="text">Pending</span></a>
            </li>
            <li class="receipts">
              <a href="/payments/receipts"><span class="text">Receipts</span></a>
            </li>
            <li class="completed">
              <a href="/payments/completed"><span class="text">Completed</span></a>
            </li>
          </ul>
        </li>
      </ul>
    `;
  }

  getSubscriptionsNav = () => {
    return /* html */`
      <ul class="special nav">
        <li class="subscriptions">
          <div class="link-section">
            <span class="left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M3.3457 16.1976L16.1747 3.36866M18.6316 11.0556L16.4321 13.2551M14.5549 15.1099L13.5762 16.0886" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                <path d="M3.17467 16.1411C1.60844 14.5749 1.60844 12.0355 3.17467 10.4693L10.4693 3.17467C12.0355 1.60844 14.5749 1.60844 16.1411 3.17467L20.8253 7.85891C22.3916 9.42514 22.3916 11.9645 20.8253 13.5307L13.5307 20.8253C11.9645 22.3916 9.42514 22.3916 7.85891 20.8253L3.17467 16.1411Z" stroke="currentColor" stroke-width="1.8" />
                <path d="M4 22H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
              <span class="text">Subscriptions</span>
            </span>
            <span class="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
          <ul class="dropdown">
            <li class="plans">
              <a href="/subscriptions/plans"><span class="text">Plans</span></a>
            </li>
            <li class="active">
              <a href="/subscriptions/active"><span class="text">Active</span></a>
            </li>
            <li class="billing">
              <a href="/subscriptions/billing"><span class="text">Billing</span></a>
            </li>
            <li class="history">
              <a href="/subscriptions/history"><span class="text">History</span></a>
            </li>
            <li class="expired">
              <a href="/subscriptions/expired"><span class="text">Expired</span></a>
            </li>
            <li class="pending">
              <a href="/subscriptions/pending"><span class="text">Pending</span></a>
            </li>
            <li class="cancelled">
              <a href="/subscriptions/cancelled"><span class="text">Cancelled</span></a>
            </li>
          </ul>
        </li>
      </ul>
    `;
  }

  getDependentsNav = () => {
    return /* html */`
      <ul class="special nav">
        <li class="dependents">
          <div class="link-section">
            <span class="left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M13 11C13 8.79086 11.2091 7 9 7C6.79086 7 5 8.79086 5 11C5 13.2091 6.79086 15 9 15C11.2091 15 13 13.2091 13 11Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M11.0386 7.55773C11.0131 7.37547 11 7.18927 11 7C11 4.79086 12.7909 3 15 3C17.2091 3 19 4.79086 19 7C19 9.20914 17.2091 11 15 11C14.2554 11 13.5584 10.7966 12.9614 10.4423" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15 21C15 17.6863 12.3137 15 9 15C5.68629 15 3 17.6863 3 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M21 17C21 13.6863 18.3137 11 15 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="text">Dependents</span>
            </span>
            <span class="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
          <ul class="dropdown">
            <li class="family">
              <a href="/dependents/family"><span class="text">Family</span></a>
            </li>
            <li class="elderly-care">
              <a href="/dependents/elderly"><span class="text">Elderly</span></a>
            </li>
            <li class="manage">
              <a href="/dependents/manage"><span class="text">Manage</span></a>
            </li>
            <li class="history">
              <a href="/dependents/history"><span class="text">History</span></a>
            </li>
            <li class="health-records">
              <a href="/dependents/records"><span class="text">Records</span></a>
            </li>
            <li class="chronic-conditions">
              <a href="/dependents/chronic"><span class="text">Chronic</span></a>
            </li>
            <li class="insurance">
              <a href="/dependents/insurance"><span class="text">Insurance</span></a>
            </li>
            <li class="emergency-contacts">
              <a href="/dependents/contacts"><span class="text">Emergency</span></a>
            </li>
          </ul>
        </li>
      </ul>
    `;
  }

  getSettingsNav = () => {
    return /* html */`
      <ul class="special nav">
        <li class="settings">
          <div class="link-section">
            <span class="left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M16.3083 4.38394C15.7173 4.38394 15.4217 4.38394 15.1525 4.28405C15.1151 4.27017 15.0783 4.25491 15.042 4.23828C14.781 4.11855 14.5721 3.90959 14.1541 3.49167C13.1922 2.52977 12.7113 2.04882 12.1195 2.00447C12.04 1.99851 11.96 1.99851 11.8805 2.00447C11.2887 2.04882 10.8077 2.52977 9.84585 3.49166C9.42793 3.90959 9.21897 4.11855 8.95797 4.23828C8.92172 4.25491 8.88486 4.27017 8.84747 4.28405C8.57825 4.38394 8.28273 4.38394 7.69171 4.38394H7.58269C6.07478 4.38394 5.32083 4.38394 4.85239 4.85239C4.38394 5.32083 4.38394 6.07478 4.38394 7.58269V7.69171C4.38394 8.28273 4.38394 8.57825 4.28405 8.84747C4.27017 8.88486 4.25491 8.92172 4.23828 8.95797C4.11855 9.21897 3.90959 9.42793 3.49166 9.84585C2.52977 10.8077 2.04882 11.2887 2.00447 11.8805C1.99851 11.96 1.99851 12.04 2.00447 12.1195C2.04882 12.7113 2.52977 13.1922 3.49166 14.1541C3.90959 14.5721 4.11855 14.781 4.23828 15.042C4.25491 15.0783 4.27017 15.1151 4.28405 15.1525C4.38394 15.4217 4.38394 15.7173 4.38394 16.3083V16.4173C4.38394 17.9252 4.38394 18.6792 4.85239 19.1476C5.32083 19.6161 6.07478 19.6161 7.58269 19.6161H7.69171C8.28273 19.6161 8.57825 19.6161 8.84747 19.716C8.88486 19.7298 8.92172 19.7451 8.95797 19.7617C9.21897 19.8815 9.42793 20.0904 9.84585 20.5083C10.8077 21.4702 11.2887 21.9512 11.8805 21.9955C11.96 22.0015 12.0399 22.0015 12.1195 21.9955C12.7113 21.9512 13.1922 21.4702 14.1541 20.5083C14.5721 20.0904 14.781 19.8815 15.042 19.7617C15.0783 19.7451 15.1151 19.7298 15.1525 19.716C15.4217 19.6161 15.7173 19.6161 16.3083 19.6161H16.4173C17.9252 19.6161 18.6792 19.6161 19.1476 19.1476C19.6161 18.6792 19.6161 17.9252 19.6161 16.4173V16.3083C19.6161 15.7173 19.6161 15.4217 19.716 15.1525C19.7298 15.1151 19.7451 15.0783 19.7617 15.042C19.8815 14.781 20.0904 14.5721 20.5083 14.1541C21.4702 13.1922 21.9512 12.7113 21.9955 12.1195C22.0015 12.0399 22.0015 11.96 21.9955 11.8805C21.9512 11.2887 21.4702 10.8077 20.5083 9.84585C20.0904 9.42793 19.8815 9.21897 19.7617 8.95797C19.7451 8.92172 19.7298 8.88486 19.716 8.84747C19.6161 8.57825 19.6161 8.28273 19.6161 7.69171V7.58269C19.6161 6.07478 19.6161 5.32083 19.1476 4.85239C18.6792 4.38394 17.9252 4.38394 16.4173 4.38394H16.3083Z" stroke="currentColor" stroke-width="1.8" />
                <path d="M15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12Z" stroke="currentColor" stroke-width="1.8" />
              </svg>
              <span class="text">Settings</span>
            </span>
            <span class="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
          <ul class="dropdown">
            <li class="data">
              <a href="/settings/data"><span class="text">Export</span></a>
            </li>
            <li class="profile">
              <a href="/settings/profile"><span class="text">Profile</span></a>
            </li>
            <li class="privacy">
              <a href="/settings/privacy"><span class="text">Privacy</span></a>
            </li>
            <li class="security">
              <a href="/settings/security"><span class="text">Security</span></a>
            </li>
            <li class="account">
              <a href="/settings/account"><span class="text">Account</span></a>
            </li>
            <li class="preferences">
              <a href="/settings/preferences"><span class="text">Preferences</span></a>
            </li>
             <li class="notifications">
              <a href="/settings/notifications"><span class="text">Notifications</span></a>
            </li>
          </ul>
        </li>
      </ul>
    `;
  }

  getSupportNav = () => {
    return /* html */`
      <ul class="special nav">
        <li class="support">
          <div class="link-section">
            <span class="left">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M17 11.8045C17 11.4588 17 11.286 17.052 11.132C17.2032 10.6844 17.6018 10.5108 18.0011 10.3289C18.45 10.1244 18.6744 10.0222 18.8968 10.0042C19.1493 9.98378 19.4022 10.0382 19.618 10.1593C19.9041 10.3198 20.1036 10.6249 20.3079 10.873C21.2513 12.0188 21.7229 12.5918 21.8955 13.2236C22.0348 13.7334 22.0348 14.2666 21.8955 14.7764C21.6438 15.6979 20.8485 16.4704 20.2598 17.1854C19.9587 17.5511 19.8081 17.734 19.618 17.8407C19.4022 17.9618 19.1493 18.0162 18.8968 17.9958C18.6744 17.9778 18.45 17.8756 18.0011 17.6711C17.6018 17.4892 17.2032 17.3156 17.052 16.868C17 16.714 17 16.5412 17 16.1955V11.8045Z" stroke="currentColor" stroke-width="1.8"></path>
                <path d="M7 11.8046C7 11.3694 6.98778 10.9782 6.63591 10.6722C6.50793 10.5609 6.33825 10.4836 5.99891 10.329C5.55001 10.1246 5.32556 10.0224 5.10316 10.0044C4.43591 9.9504 4.07692 10.4058 3.69213 10.8732C2.74875 12.019 2.27706 12.5919 2.10446 13.2237C1.96518 13.7336 1.96518 14.2668 2.10446 14.7766C2.3562 15.6981 3.15152 16.4705 3.74021 17.1856C4.11129 17.6363 4.46577 18.0475 5.10316 17.996C5.32556 17.978 5.55001 17.8757 5.99891 17.6713C6.33825 17.5167 6.50793 17.4394 6.63591 17.3281C6.98778 17.0221 7 16.631 7 16.1957V11.8046Z" stroke="currentColor" stroke-width="1.8"></path>
                <path d="M20 10.5V9C20 5.13401 16.4183 2 12 2C7.58172 2 4 5.13401 4 9V10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M20 17.5C20 22 16 22 12 22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
              <span class="text">Support</span>
            </span>
            <span class="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
          <ul class="dropdown">
            <li class="help">
              <a href="/support/help"><span class="text">Help</span></a>
            </li>
            <li class="faq">
              <a href="/support/faq"><span class="text">Learn</span></a>
            </li>
            <li class="guides">
              <a href="/support/guides"><span class="text">Guides</span></a>
            </li>
            <li class="tickets">
              <a href="/support/tickets"><span class="text">Tickets</span></a>
            </li>
             <li class="contact">
              <a href="/support/contact"><span class="text">Contact</span></a>
            </li>
            <li class="feedback">
              <a href="/support/feedback"><span class="text">Feedback</span></a>
            </li>
          </ul>
        </li>
      </ul>
    `;
  }

  getHealthReportsNav = () => {
    return /* html */`
      <ul class="special nav">
        <li class="health-reports">
          <div class="link-section">
            <span class="left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M7 17L7 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                <path d="M12 17L12 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                <path d="M17 17L17 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              </svg>
              <span class="text">Reports</span>
            </span>
            <span class="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
          <ul class="dropdown">
            <li class="family-health">
              <a href="/reports/family-health"><span class="text">Family</span></a>
            </li>
            <li class="remittance-impact">
              <a href="/reports/remittance-impact"><span class="text">Impact</span></a>
            </li>
            <li class="health-analytics">
              <a href="/reports/health-analytics"><span class="text">Analytics</span></a>
            </li>
            <li class="spending-summary">
              <a href="/reports/spending-summary"><span class="text">Spending</span></a>
            </li>
            <li class="medication-tracking">
              <a href="/reports/medication-tracking"><span class="text">Medication</span></a>
            </li>
            <li class="provider-performance">
              <a href="/reports/provider-performance"><span class="text">Performance</span></a>
            </li>
            <li class="appointment-history">
              <a href="/reports/appointment-history"><span class="text">Appointments</span></a>
            </li>
          </ul>
        </li>
      </ul>
    `;
  }

  getTweakNav = () => {
    return /* html */`
      <ul class="main user nav">
        <li class="updates">
          <a href="/updates">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path d="M22 5.5C22 7.433 20.433 9 18.5 9C16.567 9 15 7.433 15 5.5C15 3.567 16.567 2 18.5 2C20.433 2 22 3.567 22 5.5Z" stroke="currentColor" stroke-width="1.8" />
              <path d="M21.9506 11C21.9833 11.3289 22 11.6625 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C12.3375 2 12.6711 2.01672 13 2.04938" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M8 10H12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8 15H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="text">Updates</span>
          </a>
        </li>
        <li class="themes">
          <a href="/themes">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path d="M14 19L11.1069 10.7479C9.76348 6.91597 9.09177 5 8 5C6.90823 5 6.23652 6.91597 4.89309 10.7479L2 19M4.5 12H11.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M21.9692 13.9392V18.4392M21.9692 13.9392C22.0164 13.1161 22.0182 12.4891 21.9194 11.9773C21.6864 10.7709 20.4258 10.0439 19.206 9.89599C18.0385 9.75447 17.1015 10.055 16.1535 11.4363M21.9692 13.9392L19.1256 13.9392C18.6887 13.9392 18.2481 13.9603 17.8272 14.0773C15.2545 14.7925 15.4431 18.4003 18.0233 18.845C18.3099 18.8944 18.6025 18.9156 18.8927 18.9026C19.5703 18.8724 20.1955 18.545 20.7321 18.1301C21.3605 17.644 21.9692 16.9655 21.9692 15.9392V13.9392Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="text">Themes</span>
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
        <div id="img">${status === true ? this.getSuccessToast() : this.getErrorToast()}</div>
        <div id="desc">${text}</div>
      </div>
    `;
  }

  getSuccessToast = () => {
    return /* html */`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/checkmark-circle-02-solid-standard.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.75 22.5C5.81294 22.5 1 17.6871 1 11.75C1 5.81294 5.81294 1 11.75 1C17.6871 1 22.5 5.81294 22.5 11.75C22.5 17.6871 17.6871 22.5 11.75 22.5ZM16.5182 9.39018C16.8718 8.9659 16.8145 8.33534 16.3902 7.98177C15.9659 7.62821 15.3353 7.68553 14.9818 8.10981L10.6828 13.2686L8.45711 11.0429C8.06658 10.6524 7.43342 10.6524 7.04289 11.0429C6.65237 11.4334 6.65237 12.0666 7.04289 12.4571L10.0429 15.4571C10.2416 15.6558 10.5146 15.7617 10.7953 15.749C11.076 15.7362 11.3384 15.606 11.5182 15.3902L16.5182 9.39018Z" fill="currentColor"></path>
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

  getAccess = () => {
    return /*html*/`
      <access-popup api="/auth/login" next="${this.getAttribute('url')}"></access-popup>
    `
  }

  getDelete = (items, url) => {
    return /*html*/`
      <delete-popup url="${url}">${items}</delete-popup>
    `
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
          padding: 10px 0 0 10px;
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

        section.nav > ul.nav.main > li.hubspot.active,
        section.nav > ul.nav.main > li.hubspot:hover {
          background: var(--hubspot-background);
          color: var(--hubspot-color);
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
          margin: 5px 0;
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
          color: transparent;
          background: var(--second-linear);
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
          /* This is the main li for the group (e.g., li.cache) which will get the 'collapsed' class */
          width: 100%;
          position: relative;
          border-radius: 7px;
          /* background: var(--background-offset); /* Optional: if group needs a distinct background */
          /* box-shadow: var(--shadow-sm); /* Optional: subtle shadow for separation */
        }

        section.nav > ul.nav.special > li > div.link-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px; /* Padding for the clickable header */
          cursor: pointer;
          color: var(--text-color);
          border-radius: 7px; /* Rounded corners for the clickable area */
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        section.nav > ul.nav.special > li > div.link-section:hover {
          color: var(--accent-color);
          background: var(--tab-background); /* Consistent with normal nav item hover */
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
          padding: 5px 5px 5px 10px; /* Padding for the dropdown container */
          margin: 0;
          /* max-height: 600px; /* Set a sufficiently large max-height for open state content */
          overflow: hidden;
          transition: max-height 0.35s ease-in-out, opacity 0.3s ease-in-out, padding 0.3s ease-in-out, margin 0.3s ease-in-out, border-color 0.3s ease-in-out;
          opacity: 1;
          position: relative; /* Added for ::before positioning */
          /* border-top: 1px solid var(--border-color, #e0e0e0); /* Optional separator line */
          /* margin-top: 4px; /* Optional space between header and dropdown */
        }

        section.nav > ul.nav.special > li.collapsed > ul.dropdown {
          max-height: 0;
          opacity: 0;
          padding-top: 0;
          padding-bottom: 0;
          margin-top: 0;
          margin-bottom: 0;
          /* border-top-color: transparent; /* Hide border when collapsed */
        }

        section.nav > ul.nav.special > li.collapsed > div.link-section > span.right > svg {
          transform: rotate(-90deg); /* Rotate icon when collapsed */
        }

        section.nav > ul.nav.special > li > ul.dropdown > li {
          width: calc(100% - 10px);
          padding: 0; /* Padding for sub-items */
          margin: 0 0 0 5px; /* Indent sub-items */
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

        section.nav > ul.nav.special > li.active {
          /* border-left: 3px solid var(--accent-color); */ /* Vertical line for active item */
          /* Instead of border, we use a pseudo-element for animation */
        }

        section.nav > ul.nav.special > li > ul.dropdown > li::before {
          content: '-';
          position: absolute;
          left: 5px;
          top: 50%;
          color: var(--gray-color);
          transform: translateY(-50%);
          z-index: 1;
        }

        section.nav > ul.nav.special > li > ul.dropdown > li.active::before {
          color: var(--accent-color);
          transition: color 0.2s ease;
        }

        section.nav > ul.nav.special > li > ul.dropdown > li:hover::before {
          color: var(--gray-color);
          transition: color 0.2s ease;
        }

        section.flow {
          width: calc(100% - (240px + 500px + 20px));
          display: flex;
          flex-flow: column;
          max-height: max-content;
          gap: 0;
          padding: 0;
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
          min-height: calc(100dvh - 140px);
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
	    </style>
    `;
  }
}
