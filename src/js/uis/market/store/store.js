export default class StoreContainer extends HTMLElement {
  constructor() {
    super();

    // lets create our shadow root
    this.shadowObj = this.attachShadow({ mode: 'open' });
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.selected = true;
    this.activeSection = 'products';
    this.mql = window.matchMedia("(max-width: 700px)");
    this.owner = true;
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
    this.watchMql();
  }

  connectedCallback() {
    this.activateSectionController(this.shadowObj.querySelector(".modern-tabs"));
    this.setHeader(this.mql);

    // Initialize tab indicator position after render
    setTimeout(() => {
      const tabs = this.shadowObj.querySelector(".modern-tabs");
      if (tabs) this.updateTabIndicator(tabs);
    }, 0);

    // Handle window resize to recalculate indicator position
    this.resizeHandler = () => {
      const tabs = this.shadowObj.querySelector(".modern-tabs");
      if (tabs) this.updateTabIndicator(tabs);
    };
    window.addEventListener('resize', this.resizeHandler);
  }

  disconnectedCallback() {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
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
        sectionTitle: 'Pharmacy',
        description: 'HealthCare Plus Pharmacy',
      });
    }
  }

  activateSectionController = tabs => {
    if (!tabs) return;

    // Initialize the sliding indicator position
    this.updateTabIndicator(tabs);

    // Show content for the initially active tab
    const activeTab = tabs.querySelector(".tab-item.active");
    if (activeTab) {
      this.activeSection = activeTab.dataset.section;
      this.updateSectionContent();
    }

    // add click event listener to the modern tabs
    tabs.querySelectorAll(".tab-item").forEach(tab => {
      tab.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();

        // remove active class from all tabs
        tabs.querySelectorAll(".tab-item").forEach(t => t.classList.remove("active"));

        // set the new active section
        tab.classList.add("active");
        this.activeSection = tab.dataset.section;

        // Update sliding indicator position
        this.updateTabIndicator(tabs);

        // Update content based on active section
        this.updateSectionContent();
      });
    });
  }

  updateTabIndicator = (tabs) => {
    const activeTab = tabs.querySelector(".tab-item.active");
    const indicator = tabs.querySelector(".tab-indicator");

    if (activeTab && indicator) {
      const tabsContainer = tabs;
      const containerRect = tabsContainer.getBoundingClientRect();
      const activeRect = activeTab.getBoundingClientRect();

      const leftOffset = activeRect.left - containerRect.left - 4; // Account for container padding
      const width = activeRect.width;

      indicator.style.transform = `translateX(${leftOffset}px)`;
      indicator.style.width = `${width}px`;
    }
  }

  updateSectionContent = () => {
    const contentContainer = this.shadowObj.querySelector(".section-content");
    if (contentContainer) {
      contentContainer.innerHTML = this.getSectionContent();
    }
  }

  getStoreStatus = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute; // Current time in minutes

    // Store hours: Monday-Friday: 8:00-22:00, Saturday: 9:00-20:00, Sunday: Closed
    const storeHours = {
      0: null, // Sunday - Closed
      1: { open: 8 * 60, close: 22 * 60 }, // Monday
      2: { open: 8 * 60, close: 22 * 60 }, // Tuesday
      3: { open: 8 * 60, close: 22 * 60 }, // Wednesday
      4: { open: 8 * 60, close: 22 * 60 }, // Thursday
      5: { open: 8 * 60, close: 22 * 60 }, // Friday
      6: { open: 9 * 60, close: 20 * 60 }  // Saturday
    };

    const todayHours = storeHours[currentDay];

    // If closed today (Sunday)
    if (!todayHours) {
      // Find next opening day (Monday)
      const nextDay = 1; // Monday
      const nextOpen = storeHours[nextDay];
      const daysUntilOpen = (nextDay - currentDay + 7) % 7 || 7;

      if (daysUntilOpen === 1) {
        const hoursUntilOpen = 24 - currentHour + Math.floor(nextOpen.open / 60);
        const minutesUntilOpen = (60 - currentMinute + (nextOpen.open % 60)) % 60;
        return {
          isOpen: false,
          status: 'closed',
          message: `Closed - Opens tomorrow at ${this.formatTime(nextOpen.open)}`,
          timeUntil: `${hoursUntilOpen}h ${minutesUntilOpen}m`
        };
      } else {
        return {
          isOpen: false,
          status: 'closed',
          message: `Closed - Opens Monday at ${this.formatTime(nextOpen.open)}`,
          timeUntil: `${daysUntilOpen} days`
        };
      }
    }

    // If store is open today
    if (currentTime >= todayHours.open && currentTime < todayHours.close) {
      const minutesUntilClose = todayHours.close - currentTime;
      const hoursUntilClose = Math.floor(minutesUntilClose / 60);
      const minsUntilClose = minutesUntilClose % 60;

      return {
        isOpen: true,
        status: 'open',
        message: `Open - Closes at ${this.formatTime(todayHours.close)}`,
        timeUntil: hoursUntilClose > 0 ? `${hoursUntilClose}h ${minsUntilClose}m` : `${minsUntilClose}m`
      };
    }

    // If store is closed but will open today
    if (currentTime < todayHours.open) {
      const minutesUntilOpen = todayHours.open - currentTime;
      const hoursUntilOpen = Math.floor(minutesUntilOpen / 60);
      const minsUntilOpen = minutesUntilOpen % 60;

      return {
        isOpen: false,
        status: 'closed',
        message: `Closed - Opens at ${this.formatTime(todayHours.open)}`,
        timeUntil: hoursUntilOpen > 0 ? `${hoursUntilOpen}h ${minsUntilOpen}m` : `${minsUntilOpen}m`
      };
    }

    // If store is closed for the day
    return {
      isOpen: false,
      status: 'closed',
      message: 'Closed for today',
      timeUntil: 'Opens tomorrow'
    };
  }

  formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHour}:${mins.toString().padStart(2, '0')} ${period}`;
  }

  getStoreStatusDisplay = () => {
    const status = this.getStoreStatus();
    const statusClass = status.isOpen ? 'open' : 'closed';
    const statusIcon = status.isOpen ?
      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
         <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
       </svg>` :
      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
         <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
       </svg>`;

    return /* html */`
      <div class="status-indicator ${statusClass}">
        <div class="status-icon">${statusIcon}</div>
        <div class="status-content">
          <div class="status-main">${status.message}</div>
          <div class="status-time">${status.isOpen ? 'Closing in' : 'Opening in'} ${status.timeUntil}</div>
        </div>
      </div>
    `;
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
      <div class="search-section">
        ${this.getMore(this.mql)}
      </div>
      <div class="section-content">
        ${this.getSectionContent()}
      </div>
    `
  }

  getHeader = mql => {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    return /* html */`
      <div class="pharmacy-header">
        <div class="cover-section">
          <div class="store-banner">
            <img src="https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=2126&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="pharmacy interior">
            <div class="pharmacy-logo">
              <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="pharmacy logo">
            </div>
          </div>
          <div class="pharmacy-info">
            <h3 class="pharmacy-name">HealthCare Plus Pharmacy</h3>
            <div class="location-info">
              <span class="address">1245 Medical Center Drive</span>
              <span class="city">Karen, Nairobi 10001</span>
            </div>
            <p class="pharmacy-description">
              Your trusted neighborhood pharmacy providing quality medications, health consultations,
              and wellness services. We're committed to your health and well-being with 24/7 emergency services.
            </p>
            <div class="pharmacy-credentials">
              <span class="license">License: #PHM2024-NY-1245</span>
              <div class="opening-hours">
                <div class="store-status">
                  ${this.getStoreStatusDisplay()}
                </div>
                <div class="hours-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M12 7V12L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="hours-title">Weekly Schedule</span>
                </div>
                <div class="hours-table">
                  <ul class="opening-schedule">
                    <li class="schedule-day holiday ${today === 0 ? 'current-day' : ''}">
                      <div class="day-name">SUN</div>
                      <div class="day-hours">
                        <div class="closed-indicator">Closed</div>
                      </div>
                    </li>
                    <li class="schedule-day regular ${today === 1 ? 'current-day' : ''}">
                      <div class="day-name">MON</div>
                      <div class="day-hours">
                        <div class="open-time">8:00 AM</div>
                        <div class="close-time">10:00 PM</div>
                      </div>
                    </li>
                    <li class="schedule-day regular ${today === 2 ? 'current-day' : ''}">
                      <div class="day-name">TUE</div>
                      <div class="day-hours">
                        <div class="open-time">8:00 AM</div>
                        <div class="close-time">10:00 PM</div>
                      </div>
                    </li>
                    <li class="schedule-day regular ${today === 3 ? 'current-day' : ''}">
                      <div class="day-name">WED</div>
                      <div class="day-hours">
                        <div class="open-time">8:00 AM</div>
                        <div class="close-time">10:00 PM</div>
                      </div>
                    </li>
                    <li class="schedule-day regular ${today === 4 ? 'current-day' : ''}">
                      <div class="day-name">THU</div>
                      <div class="day-hours">
                        <div class="open-time">8:00 AM</div>
                        <div class="close-time">10:00 PM</div>
                      </div>
                    </li>
                    <li class="schedule-day regular ${today === 5 ? 'current-day' : ''}">
                      <div class="day-name">FRI</div>
                      <div class="day-hours">
                        <div class="open-time">8:00 AM</div>
                        <div class="close-time">10:00 PM</div>
                      </div>
                    </li>
                    <li class="schedule-day holiday ${today === 6 ? 'current-day' : ''}">
                      <div class="day-name">SAT</div>
                      <div class="day-hours">
                        <div class="open-time">9:00 AM</div>
                        <div class="close-time">8:00 PM</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="stats">
          <div class="stat">
            <span class="number">${this.number.withCommas(12450)}</span>
            <span class="label">Medications</span>
          </div>
          <div class="stat">
            <span class="number">${this.number.withCommas(8)}</span>
            <span class="label">Services</span>
          </div>
          <div class="stat">
            <span class="number">${this.number.withCommas(15680)}</span>
            <span class="label">Customers</span>
          </div>
          <div class="stat">
            <span class="number">4.8</span>
            <span class="label">Rating</span>
          </div>
        </div>
        ${mql.matches ? this.getActions(this.owner) : ""}
      </div>
    `
  }

  getActions = owner => {
    if (owner) {
      return /* html */`
        <div class="pharmacy-actions">
          <button class="action-btn primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M2.5 9.5H6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M2.5 14.5H6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M2.5 19.5H18.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M18.5355 13.0355L21.5 16M20 9.5C20 6.73858 17.7614 4.5 15 4.5C12.2386 4.5 10 6.73858 10 9.5C10 12.2614 12.2386 14.5 15 14.5C17.7614 14.5 20 12.2614 20 9.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="action-label">Inventory</span>
          </button>
          <button class="action-btn secondary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M14.5 17.5V7.5H7.5001C5.1431 7.5 3.9646 7.5 3.23237 8.23222C2.50013 8.96445 2.50012 10.1429 2.5001 12.5L2.50006 16.5C2.50004 18.857 2.50003 20.0355 3.23226 20.7678C3.9645 21.5 5.14302 21.5 7.50006 21.5H10.5C12.3856 21.5 13.3284 21.5 13.9142 20.9142C14.5 20.3284 14.5 19.3856 14.5 17.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M14.4999 16.5H16.4999C18.8569 16.5 20.0355 16.5 20.7677 15.7678C21.4999 15.0355 21.4999 13.857 21.4999 11.5V7.5C21.4999 5.14298 21.4999 3.96447 20.7677 3.23223C20.0355 2.5 18.8569 2.5 16.4999 2.5H9.50006L9.5002 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M5.50006 12.5H9.00006M5.50006 16.5H11.5001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M9.50006 2.5L14.5001 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="action-label">Orders</span>
          </button>
          <button class="action-btn secondary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <circle cx="12" cy="18" r="3" stroke="currentColor" stroke-width="1.5"></circle>
              <path d="M12 15V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
              <path d="M22 13C22 7.47715 17.5228 3 12 3C6.47715 3 2 7.47715 2 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
            </svg>
            <span class="action-label">Analytics</span>
          </button>
        </div>
      `
    } else {
      return /* html */`
        <div class="pharmacy-actions">
          <button class="action-btn primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.62 10.79C6.76 8.82 7.95 7.26 9.58 6.56C10.72 6.05 12.05 6.05 13.19 6.56C14.82 7.26 16.01 8.82 16.15 10.79C16.21 11.64 16.18 12.5 16.06 13.35C15.93 14.2 15.71 15.03 15.41 15.84L12 20.22L8.59 15.84C8.29 15.03 8.07 14.2 7.94 13.35C7.82 12.5 7.79 11.64 7.85 10.79H6.62ZM12 9C11.45 9 11 9.45 11 10S11.45 11 12 11 13 10.55 13 10 12.55 9 12 9Z" fill="currentColor"/>
            </svg>
            Visit Store
          </button>
          <button class="action-btn secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.5 10.5C6.5 11.61 5.61 12.5 4.5 12.5S2.5 11.61 2.5 10.5 3.39 8.5 4.5 8.5 6.5 9.39 6.5 10.5ZM21.5 10.5C21.5 11.61 20.61 12.5 19.5 12.5S17.5 11.61 17.5 10.5 18.39 8.5 19.5 8.5 21.5 9.39 21.5 10.5ZM14.09 10.95L13 7.95C12.66 7.04 11.54 6.5 10.5 6.5S8.34 7.04 8 7.95L6.91 10.95L5 17H19L17.09 10.95H14.09Z" fill="currentColor"/>
            </svg>
            Call Pharmacy
          </button>
          <button class="action-btn secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
            </svg>
            Consult
          </button>
        </div>
      `
    }
  }

  getMore = mql => {
    return /* html */`
      <div class="more-container">
        <div class="tabs-section">
          ${this.getModernTabs()}
        </div>
        ${!mql.matches ? this.getActions(this.owner) : ''}
      </div>
      ${mql.matches ? this.getActions(this.owner) : ''}
    `;
  }

  getModernTabs = () => {
    return /* html */`
      <div class="modern-tabs">
        <div class="tab-indicator"></div>
        <div class="tab-item" data-section="products">
          <span class="tab-label">Products</span>
          <span class="tab-count">${this.number.shorten(12450)}</span>
        </div>
        <div class="tab-item active" data-section="services">
          <span class="tab-label">Services</span>
          <span class="tab-count">${this.number.shorten(13)}</span>
        </div>
      </div>
    `;
  }

  getSectionContent = () => {
    if (this.activeSection === 'services') {
      return `<div class="services-container">${this.getServices()}</div>`;
    }
    return `<div class="products">${this.getProducts()}</div>`;
  }

  getServices = () => {
    return /* html */`
      <div class="services">
        <service-wrapper image="/src/img/products/drug27.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="consultation" reviews="32894" average-review="4.7" name="Prescription Consultation" description="Expert consultation with licensed pharmacists for medication guidance and drug interactions." price="0" last="0"></service-wrapper>
        <service-wrapper image="/src/img/products/drug28.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="screening" reviews="894" average-review="3.7" name="Health Screening" description="Blood pressure monitoring, diabetes screening, and basic health assessments." price="25" last="13"></service-wrapper>
        <service-wrapper image="/src/img/products/drug29.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="vaccination" reviews="1200" average-review="4.8" name="Vaccination Services" description="Flu shots, COVID-19 vaccines, and other immunizations administered by certified professionals." price="450" last="700"></service-wrapper>
        <service-wrapper image="/src/img/products/drug30.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="medication" reviews="0" average-review="0" name="Medication Synchronization" description="Coordinate all your prescriptions to be ready on the same day for convenient pickup." price="4673" last="9678"></service-wrapper>
        <service-wrapper image="/src/img/products/drug31.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="delivery" reviews="79" average-review="3.5" name="Home Delivery" description="Free prescription delivery service within 5-mile radius, same-day delivery available." price="236" last="138"></service-wrapper>
        <service-wrapper image="/src/img/products/drug32.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="information" reviews="432" average-review="4.0" name="Drug Information" description="Comprehensive medication information, side effects, and drug interaction database access." price="3766" last="9670"></service-wrapper>
        <service-wrapper image="/src/img/products/drug33.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="emergency" reviews="100" average-review="4.5" name="24/7 Emergency Support" description="Round-the-clock emergency prescription services and urgent medication needs." price="400" last="328"></service-wrapper>
        <service-wrapper image="/src/img/products/drug34.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="insurance" reviews="6" average-review="5.0" name="Insurance Verification" description="Quick insurance verification and prior authorization assistance for prescriptions." price="0" last="0"></service-wrapper>
        <service-wrapper image="/src/img/products/drug35.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="telehealth" reviews="200" average-review="4.9" name="Telehealth Consultation" description="Virtual consultations with healthcare professionals from the comfort of your home." price="3620" last="5050"></service-wrapper>
        <service-wrapper image="/src/img/products/drug37.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="consultation" reviews="32894" average-review="4.7" name="Prescription Consultation" description="Expert consultation with licensed pharmacists for medication guidance and drug interactions." price="0" last="0"></service-wrapper>
        <service-wrapper image="/src/img/products/drug38.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="screening" reviews="894" average-review="3.7" name="Health Screening" description="Blood pressure monitoring, diabetes screening, and basic health assessments." price="25" last="13"></service-wrapper>
        <service-wrapper image="/src/img/products/drug39.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="vaccination" reviews="1200" average-review="4.8" name="Vaccination Services" description="Flu shots, COVID-19 vaccines, and other immunizations administered by certified professionals." price="4570" last="7000"></service-wrapper>
        <service-wrapper image="/src/img/products/drug50.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="medication" reviews="0" average-review="0" name="Medication Synchronization" description="Coordinate all your prescriptions to be ready on the same day for convenient pickup." price="600" last="9678"></service-wrapper>
        <service-wrapper image="/src/img/products/drug61.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="delivery" reviews="79" average-review="3.5" name="Home Delivery" description="Free prescription delivery service within 5-mile radius, same-day delivery available." price="2360" last="1380"></service-wrapper>
        <service-wrapper image="/src/img/products/drug12.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="information" reviews="432" average-review="4.0" name="Drug Information" description="Comprehensive medication information, side effects, and drug interaction database access." price="0" last="0"></service-wrapper>
        <service-wrapper image="/src/img/products/drug13.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="emergency" reviews="100" average-review="4.5" name="24/7 Emergency Support" description="Round-the-clock emergency prescription services and urgent medication needs." price="4000" last="3200"></service-wrapper>
        <service-wrapper image="/src/img/products/drug14.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="insurance" reviews="6" average-review="5.0" name="Insurance Verification" description="Quick insurance verification and prior authorization assistance for prescriptions." price="0" last="0"></service-wrapper>
        <service-wrapper image="/src/img/products/drug15.jpg" owner="${this.getAttribute('owner')}" store-name="HealthCare Plus Pharmacy" kind="telehealth" reviews="200" average-review="4.9" name="Telehealth Consultation" description="Virtual consultations with healthcare professionals from the comfort of your home." price="300" last="500"></service-wrapper>
      </div>
    `;
  }

  getProducts = () => {
    return /* html */`
      <product-wrapper product-image="/src/img/products/drug1.jpg" name="Paracetamol 500mg Tablets - Pain & Fever Relief" last="5048.50" store="HealthCare Plus Pharmacy" reviews="32894" average-review="4.7" wished="true" in-cart="0" quantity="150" price="4598.50" store-country="Kenya"></product-wrapper>
      <product-wrapper product-image="/src/img/products/drug2.jpg" name="Ibuprofen 400mg Capsules - Anti-inflammatory" last="712.25" store="HealthCare Plus Pharmacy" reviews="185" average-review="4.3" wished="false" in-cart="2" quantity="89" price="152.25" store-country="Kenya"></product-wrapper>
      <product-wrapper product-image="/src/img/products/drug3.jpg" name="Amoxicillin 250mg Syrup - Antibiotic" last="824.75" store="HealthCare Plus Pharmacy" reviews="9546" average-review="4.5" wished="true" in-cart="0" quantity="45" price="247.75" store-country="Kenya"></product-wrapper>
      <product-wrapper product-image="/src/img/products/drug4.jpg" name="Dextromethorphan Cough Syrup - Respiratory Relief" last="215.80" store="HealthCare Plus Pharmacy" reviews="142" average-review="4.2" wished="false" in-cart="1" quantity="67" price="15.80" store-country="Kenya"></product-wrapper>
      <product-wrapper product-image="/src/img/products/drug5.jpg" name="Multivitamin Complex Tablets - Daily Nutrition" last="8628.50" store="HealthCare Plus Pharmacy" reviews="489" average-review="4.6" wished="true" in-cart="0" quantity="200" price="28.50" store-country="Kenya"></product-wrapper>
      <product-wrapper product-image="/src/img/products/drug6.jpg" name="Antiseptic Solution 100ml - Wound Care" last="995.90" store="HealthCare Plus Pharmacy" reviews="176" average-review="4.4" wished="false" in-cart="0" quantity="120" price="995.90" store-country="Kenya"></product-wrapper>
      <product-wrapper product-image="/src/img/products/drug7.jpg" name="Adhesive Bandages Pack - First Aid" last="8766.75" store="HealthCare Plus Pharmacy" reviews="234" average-review="4.8" wished="true" in-cart="0" quantity="85" price="6.75" store-country="Kenya"></product-wrapper>
      <product-wrapper product-image="/src/img/products/drug8.jpg" name="Cetirizine 10mg Tablets - Allergy Relief" last="418.40" store="HealthCare Plus Pharmacy" reviews="167" average-review="4.1" wished="false" in-cart="0" quantity="0" price="188.40" store-country="Kenya"></product-wrapper>
      <product-wrapper product-image="/src/img/products/drug9.jpg" name="Insulin Injection Pen - Diabetes Management" last="1825.00" store="HealthCare Plus Pharmacy" reviews="89" average-review="4.9" wished="true" in-cart="0" quantity="12" price="7125.00" store-country="Kenya"></product-wrapper>
      <product-wrapper product-image="/src/img/products/drug10.jpg" name="Aspirin 325mg Tablets - Cardiovascular Health" last="191.30" store="HealthCare Plus Pharmacy" reviews="29468" average-review="4.0" wished="false" in-cart="0" quantity="156" price="181.30" store-country="Kenya"></product-wrapper>
      <product-wrapper product-image="/src/img/products/drug12.jpg" name="Calcium Carbonate Antacid - Digestive Health" last="7814.60" store="HealthCare Plus Pharmacy" reviews="203" average-review="3.8" wished="true" in-cart="3" quantity="78" price="128974.60" store-country="Kenya"></product-wrapper>
      <product-wrapper product-image="/src/img/products/drug13.jpg" name="Lubricating Eye Drops - Vision Care" last="8722.90" store="HealthCare Plus Pharmacy" reviews="134" average-review="4.3" wished="false" in-cart="1" quantity="54" price="22.90" store-country="Kenya"></product-wrapper>
      <product-wrapper product-image="/src/img/products/drug16.jpg" name="Digital Thermometer - Health Monitoring" last="1435.75" store="HealthCare Plus Pharmacy" reviews="112" average-review="4.5" wished="true" in-cart="0" quantity="28" price="6435.75" store-country="Kenya"></product-wrapper>
      <product-wrapper product-image="/src/img/products/drug14.jpg" name="Probiotic Capsules 30ct - Gut Health" last="1742.20" store="HealthCare Plus Pharmacy" reviews="91" average-review="3.9" wished="false" in-cart="0" quantity="63" price="42.20" store-country="Kenya"></product-wrapper>
      <product-wrapper product-image="/src/img/products/drug15.jpg" name="Hand Sanitizer 250ml - Hygiene Protection" last="187.45" store="HealthCare Plus Pharmacy" reviews="456" average-review="4.2" wished="true" in-cart="0" quantity="0" price="7.45" store-country="Kenya"></product-wrapper>
      <product-wrapper product-image="/src/img/products/drug11.jpg" name="Omega-3 Fish Oil Capsules - Heart Health" last="3431.80" store="HealthCare Plus Pharmacy" reviews="178" average-review="4.4" wished="false" in-cart="0" quantity="94" price="31.80" store-country="Kenya"></product-wrapper>
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

        /* Pharmacy Header Styles */
        .pharmacy-header {
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 100%;
          padding: 0;
          margin: 0;
        }

        .pharmacy-header > .cover-section {
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 100%;
          min-width: 100%;
          padding: 0;
          margin: 0;
        }

        .pharmacy-header > .cover-section > .store-banner {
          width: 100%;
          height: 180px;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }

        .pharmacy-header > .cover-section > .store-banner > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pharmacy-header > .cover-section .pharmacy-logo {
          width: 120px;
          height: 120px;
          position: absolute;
          top: 50%;
          left: 20px;
          transform: translateY(-50%);
          border-radius: 50%;
          overflow: hidden;
          margin: 0;
          background: var(--background);
          display: flex;
          justify-content: center;
          align-items: center;
          border: 4px solid var(--background);
          box-shadow: var(--box-shadow);
        }

        .pharmacy-header > .cover-section .pharmacy-logo > img {
          width: calc(100% - 8px);
          height: calc(100% - 8px);
          object-fit: cover;
          border-radius: 50%;
        }

        .pharmacy-header > .cover-section > .pharmacy-info {
          width: 100%;
          padding: 10px 0 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          gap: 8px;
        }

        .pharmacy-header > .cover-section > .pharmacy-info > .pharmacy-name {
          font-size: 1.6rem;
          font-weight: 600;
          line-height: 1.3;
          font-family: var(--font-main), sans-serif;
          color: var(--title-color);
          margin: 0;
        }

        .pharmacy-header > .cover-section > .pharmacy-info > .location-info {
          display: flex;
          flex-flow: column;
          gap: 2px;
          margin: 0;
        }

        .pharmacy-header > .cover-section > .pharmacy-info > .location-info > .address {
          font-size: 1rem;
          font-weight: 400;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.3;
        }

        .pharmacy-header > .cover-section > .pharmacy-info > .location-info > .city {
          font-size: 1rem;
          font-weight: 500;
          color: var(--accent-color);
          font-family: var(--font-read), sans-serif;
          line-height: 1.3;
        }

        .pharmacy-header > .cover-section > .pharmacy-info > .pharmacy-description {
          font-size: 1rem;
          font-weight: 400;
          margin: 5px 0;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.4;
        }

        .pharmacy-header > .cover-section > .pharmacy-info > .pharmacy-credentials {
          display: flex;
          flex-flow: column;
          gap: 4px;
          margin: 0;
        }

        .pharmacy-header > .cover-section > .pharmacy-info > .pharmacy-credentials > span {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-text), sans-serif;
        }

        .pharmacy-header > .cover-section > .pharmacy-info > .pharmacy-credentials > .license {
          color: var(--accent-color);
        }

        /* Store Status and Opening Hours Styles */
        .opening-hours {
          display: flex;
          flex-flow: column;
          gap: 12px;
          margin-top: 20px;
        }

        .store-status {
          margin-bottom: 15px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .status-indicator.open {
          background: var(--upvote-background);
          border: var(--action-border);
          color: var(--action-color);
        }

        .status-indicator.closed {
          background: var(--warn-background);
          border: var(--error-border);
          color: var(--text-color);
        }

        .status-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .status-indicator.open .status-icon {
          background: var(--revenue-background);
          color: var(--action-color);
        }

        .status-indicator.closed .status-icon {
          background: var(--error-color);
          color: var(--white-color);
        }

        .status-indicator.open .status-icon svg {
          width: 24px;
          height: 24px;
        }

        .status-content {
          display: flex;
          flex-flow: column;
          gap: 2px;
          flex: 1;
        }

        .status-main {
          font-size: 1rem;
          font-weight: 600;
          font-family: var(--font-main), sans-serif;
          line-height: 1.2;
        }

        .status-time {
          font-size: 0.875rem;
          font-weight: 400;
          font-family: var(--font-text), sans-serif;
          opacity: 0.8;
          line-height: 1.2;
        }

        .hours-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          color: var(--text-color);
        }

        .hours-header svg {
          width: 18px;
          height: 18px;
          color: var(--accent-color);
        }

        .hours-title {
          font-size: 0.95rem;
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
        }

        .hours-table {
          width: 100%;
          padding: 0 0 0 5px;
          margin: 8px 0 15px;
        }

        .opening-schedule {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: space-between;
        }

        .schedule-day {
          flex: 1;
          min-width: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 8px;
          border-radius: 0;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .schedule-day.regular {
          border-right: var(--action-border);
          color: var(--action-color);
        }

        .schedule-day:first-child {
          border-left: var(--rating-border);
        }

        .schedule-day.holiday {
          border-right: var(--rating-border);
          color: var(--rating-color);
        }

        .schedule-day.current-day {
          transform: scale(1.05);
          z-index: 2;
        }

        .day-name {
          font-size: 0.8rem;
          font-weight: 600;
          font-family: var(--font-main), sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .day-hours {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .open-time, .close-time {
          font-size: 0.75rem;
          font-weight: 500;
          font-family: var(--font-text), sans-serif;
          line-height: 1.1;
          opacity: 0.9;
        }

        .closed-indicator {
          font-size: 0.8rem;
          font-weight: 600;
          font-family: var(--font-main), sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* Pharmacy Stats Styles */
        .pharmacy-header > .stats {
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: start;
          gap: 20px;
          width: 100%;
          padding: 30px 0 12px;
          margin: 0;
        }

        .pharmacy-header > .stats > div {
          display: flex;
          flex-flow: column;
          background: var(--gray-background);
          border-radius: 12px;
          padding: 12px 16px;
          min-width: 120px;
          gap: 0;
          margin: 0;
        }

        .pharmacy-header > .stats > div > .number {
          font-size: 1.15rem;
          font-weight: 500;
          margin: 0;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.3;
        }

        .pharmacy-header > .stats > div > .label {
          font-size: 1rem;
          font-weight: 400;
          margin: 0;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          line-height: 1.3;
        }

        .pharmacy-header > .stats > .line {
          display: inline-block;
          width: 2px;
          height: 30px;
          border-radius: 2px;
          background: var(--tab-background);
        }

        /* More Container Styles */
        .more-container {
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: var(--border);
          margin: 0;
          padding: 0;
          position: sticky;
          top: 90px;
          background: var(--background);
          z-index: 10;
        }

        /* Modern Tabs Styles */
        .modern-tabs {
          position: relative;
          display: flex;
          padding: 0;
          gap: 20px;
          width: fit-content;
          margin: 0;
          border-bottom: 2px solid var(--border-color);
        }

        .modern-tabs > .tab-indicator {
          position: absolute;
          bottom: -2px;
          left: 0;
          height: 3px;
          border-radius: 5px;
          background: var(--accent-color);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
        }

        .modern-tabs > .tab-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0;
          padding: 10px 0;
          font-family: var(--font-main), sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--gray-color);
          z-index: 2;
          background: transparent;
          border: none;
        }

        .modern-tabs > .tab-item.active {
          color: var(--accent-color);
          font-weight: 600;
        }

        .modern-tabs > .tab-item:not(.active):hover {
          color: var(--text-color);
        }

        .modern-tabs > .tab-item > .tab-label {
          font-size: 1.15rem;
          transition: all 0.2s ease;
        }

        .modern-tabs > .tab-item > .tab-count {
          font-size: 0.8rem;
          font-weight: 500;
         /* background: var(--gray-background); */
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          display: inline-block;
          padding: 2px 8px 0;
          border-radius: 0;
          text-align: center;
          transition: all 0.2s ease;
        }

        .modern-tabs > .tab-item.active > .tab-count {
          color: var(--accent-color);
        }

        /* Pharmacy Actions Styles */
        .pharmacy-actions {
          display: flex;
          flex-flow: row;
          gap: 15px;
          padding: 0;
        }

        .pharmacy-actions > .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 12px 6px;
          border-radius: 12px;
          border: none;
          font-size: 0.9rem;
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .pharmacy-actions > .action-btn {
          background: var(--gray-background);
          color: var(--text-color);
          border: var(--border);
        }

        .pharmacy-actions > .action-btn:hover {
          background: var(--tab-background);
          border-color: var(--accent-color);
        }

        .pharmacy-actions > .action-btn svg {
          width: 18px;
          height: 18px;
        }

        /* Services Container Styles */
        .services-container {
          padding: 20px 0;
          width: 100%;
        }

        .services {
          padding: 0;
          max-width: 100%;
          display: block;
          columns: 300px auto;
          column-gap: 10px;
          row-gap: 20px;
          margin: 0;
        }

        .services > * {
          break-inside: avoid;
          margin-bottom: 10px;
          display: block;
        }

        /* Products Styles */
        .products {
          padding: 20px 0;
          max-width: 100%;
          display: block;
          columns: 230px auto;
          column-gap: 10px;
          margin: 0;
        }

        .products > * {
          break-inside: avoid;
          margin-bottom: 10px;
          display: block;
          width: 100%;
        }

        .section-content {
          padding: 0;
          margin: 0;
          width: 100%;
        }

        /* Mobile Styles */
        @media all and (max-width: 700px) {
          :host {
            padding: 70px 10px;
          }

          /* Reset cursors for mobile */
          .pharmacy-actions > .action-btn,
          .modern-tabs > .tab-item {
            cursor: default !important;
          }

          .search-section {
            position: sticky;
            top: 60px;
            padding: 15px 0 10px;
          }

          .tabs-section {
            position: sticky;
            top: 135px;
            padding: 0 0 10px;
          }

          .search-container-wrapper {
            flex-direction: column;
            gap: 10px;
          }

          .pharmacy-actions {
            display: flex;
            flex-flow: row;
            gap: 10px;
            padding: 0;
            margin: 0;
            width: 100%;
            justify-content: center;
          }

          .modern-tabs {
            width: 100%;
            margin: 0;
          }

          .modern-tabs > .tab-item {
            flex: 1;
            justify-content: center;
            padding: 10px 16px;
          }

          .pharmacy-header > .pharmacy-stats {
            display: flex;
            flex-flow: row;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            padding: 12px 15px;
          }

          .pharmacy-header > .pharmacy-stats > .stat-item > .stat-number {
            font-size: 1.1rem;
          }

          .pharmacy-header > .pharmacy-stats > .stat-item > .stat-label {
            font-size: 0.8rem;
          }

          .services-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .products {
            padding: 20px 0;
            max-width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin: 0;
          }

          /* Mobile Opening Hours Styles */
          .status-indicator {
            padding: 10px 12px;
            gap: 10px;
          }

          .status-main {
            font-size: 0.9rem;
          }

          .status-time {
            font-size: 0.8rem;
          }

          .hours-table {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .opening-schedule {
            gap: 6px;
            min-width: 500px;
            padding: 0 4px;
          }

          .schedule-day {
            min-width: 65px;
            padding: 10px 6px;
          }

          .day-name {
            font-size: 0.75rem;
            margin-bottom: 6px;
          }

          .open-time, .close-time {
            font-size: 0.7rem;
          }

          .closed-indicator {
            font-size: 0.75rem;
          }
        }

        @media (max-width: 480px) {

          .pharmacy-header > .pharmacy-stats {
            gap: 10px;
            padding: 10px 12px;
          }

          .pharmacy-actions {
            flex-wrap: wrap;
            gap: 8px;
          }

          .pharmacy-actions > .action-btn {
            padding: 8px 12px;
            font-size: 0.85rem;
            flex: 1;
            min-width: calc(50% - 4px);
          }

          .modern-tabs > .tab-item {
            padding: 8px 12px;
          }

          .modern-tabs > .tab-item > .tab-label {
            font-size: 0.9rem;
          }

          .products {
            grid-template-columns: 1fr 1fr;
          }

          /* Extra Small Mobile Opening Hours */
          .status-indicator {
            padding: 8px 10px;
            gap: 8px;
            flex-direction: column;
            text-align: center;
          }

          .status-content {
            align-items: center;
          }

          .status-main {
            font-size: 0.85rem;
          }

          .status-time {
            font-size: 0.75rem;
          }

          .hours-header {
            padding: 6px 0;
            margin-bottom: 8px;
          }

          .hours-title {
            font-size: 0.85rem;
          }

          .opening-schedule {
            gap: 4px;
            min-width: 450px;
            flex-wrap: nowrap;
          }

          .schedule-day {
            min-width: 55px;
            padding: 8px 4px;
          }

          .day-name {
            font-size: 0.7rem;
            margin-bottom: 4px;
          }

          .open-time, .close-time {
            font-size: 0.65rem;
          }

          .closed-indicator {
            font-size: 0.7rem;
          }
        }
      </style>
    `
  }
}