export default class Provider extends HTMLElement {
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
    `
  }

  getHeader = mql => {
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
          </div>
          <div class="details">
            <div class="tab">
              Tab
            </div>
            <div class="content-container">
              ${this.getAvailability()}
            </div>
          </div>
        </div>
      </div>
    `
  }

  getAvailability = () => {
    return /* html */`
      <div class="availability-contanier">
        <div class="stats-content">
          <div class="head">
            <h3 class="title">Stats</h3>
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
        </div>
        <div class="schedule">
          <div is="week-schedule" provider-name="HealthCare Plus Pharmacy"></div>
        </div>
      </div>
    `
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

        div.details {
          display: flex;
          flex-flow: column;
          gap: 4px;
          margin: 0;
        }

        /* Pharmacy Stats Styles */
        div.availability-contanier {
          border-top: var(--border);
          border-bottom: var(--border);
          display: flex;
          flex-flow: row nowrap;
          gap: 4px;
          margin: 15px 0;
          padding: 15px 0;
        }

        div.stats-content {
          display: flex;
          flex-flow: column;
          align-items: flex-start;
          justify-content: start;
          gap: 10px;
          padding: 0;
          width: 100%;
        }

        div.stats-content > .head {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        div.stats-content > .head > h3.title {
          display: flex;
          align-items: center;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          font-size: 1.2rem;
          font-weight: 600;
          line-height: 1;
          margin: 0;
          padding: 0;
        }

        div.stats-content div.stats {
          display: flex;
          flex-flow: row;
          align-items: flex-start;
          justify-content: start;
          gap: 20px;
          width: 100%;
          padding: 10px 0;
          margin: 0;
        }

        div.stats > div.stat {
          display: flex;
          flex-flow: column;
          background: var(--gray-background);
          border-radius: 12px;
          padding: 12px 16px;
          min-width: 120px;
          gap: 0;
          margin: 0;
        }

        div.stats > div.stat > .number {
          font-size: 1.15rem;
          font-weight: 500;
          margin: 0;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.3;
        }

        div.stats > div.stat > .label {
          font-size: 1rem;
          font-weight: 400;
          margin: 0;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          line-height: 1.3;
        }

        div.stats > .line {
          display: inline-block;
          width: 2px;
          height: 30px;
          border-radius: 2px;
          background: var(--tab-background);
        }

        /* Mobile Styles */
        @media all and (max-width: 700px) {
          :host {
            padding: 70px 10px;
          }
        }
      </style>
    `
  }
}