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
    this.ownerKind = this.getAttribute('owner') || 'false';
    this.owner = this.ownerKind === 'true';
    this.kind = this.getAttribute('kind') || 'org';
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
    this.watchMql();
  }

  connectedCallback() {
    this.setHeader(this.mql);
    // add some events
    this.activateTabs();
  }

  disconnectedCallback() {
    // remove some events
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
        sectionTitle: 'Provider',
        description: 'Jane Clinic & Dental Care',
      });
    }
  }

  activateTabs = () => {
    const tabsContainer = this.shadowObj.querySelector('ul.tabs');
    if (!tabsContainer) return;
    const tabs = Array.from(tabsContainer.querySelectorAll('li.tab'));
    const indicator = tabsContainer.querySelector('ul.tabs > .tab-indicator');
    if (!tabs.length || !indicator) return;

    // cache content container for switching without full re-render
    this.contentEl = this.shadowObj.querySelector('.content-container');

    // attach listeners
    tabs.forEach(tab => {
      // set initial indicator if tab is active
      if (tab.classList.contains('active')) {
        this.adjustTabIndicatorWidth(tabsContainer, tab, indicator);
      }

      tab.addEventListener('click', (ev) => {
        const section = tab.getAttribute('section') || tab.dataset.section;
        this.setActiveTab(tabs, tab);
        this.adjustTabIndicatorWidth(tabsContainer, tab, indicator);
        this.setSection(section);
      });
    });

    // initialize content based on the active tab (or first tab)
    const initial = tabs.find(t => t.classList.contains('active')) || tabs[0];
    if (initial) {
      const initialSection = initial.getAttribute('section') || initial.dataset.section;
      // ensure active class is present
      this.setActiveTab(tabs, initial);
      this.adjustTabIndicatorWidth(tabsContainer, initial, indicator);
      this.setSection(initialSection);
    }
  }

  // Set the current section and update the content container without re-rendering
  setSection = (section) => {
    if (!section) return;
    this.activeSection = section;
    if (!this.contentEl) this.contentEl = this.shadowObj.querySelector('.content-container');
    if (!this.contentEl) return;
    // Use existing getters to build the innerHTML for the section
    try {
      this.contentEl.innerHTML = this.getSectionContent(section);
    } catch (e) {
      // fallback to reviews if something fails
      this.contentEl.innerHTML = this.getReviews();
    }
  }

  getSectionContent = (section) => {
    switch (section) {
      case 'highlights':
        return this.getHighlights();
      case 'schedule':
        return this.getSchedule();
      case 'services':
        return this.getServices();
      case 'doctors':
        return this.getDoctors();
      case 'education':
        // for specialist kind
        return this.getHighlights();
      case 'reviews':
      default:
        return this.getReviews();
    }
  }

  adjustTabIndicatorWidth = (tabsContainer, activeTab, indicator) => {
    if (!tabsContainer || !activeTab || !indicator) return;
    const width = activeTab.offsetWidth;
    const left = activeTab.offsetLeft - tabsContainer.scrollLeft;
    window.requestAnimationFrame(() => {
      indicator.style.width = `${width}px`;
      indicator.style.transform = `translateX(${left}px)`;
    });
  }

  setActiveTab = (tabs, activeTab) => {
    if (!tabs || !activeTab) return;
    tabs.forEach(tab => tab.classList.remove('active'));
    activeTab.classList.add('active');
  }

  getTemplate() {
    return /* html */`
      ${this.getBody()}
      ${this.getStyles()}
    `
  }

  getBody = () => {
    return /* html */`
      ${this.getBanner(this.owner, this.mql)}
      ${this.getTabs(this.kind)}
      <div class="content-container">
        ${this.getReviews()}
      </div>
    `
  }

  getBanner = (owner, mql) => {
    if (mql && mql.matches) {
      return /* html */`
        <div class="banner">
          ${this.getBannerEdit(owner)}
          <img src="https://images.unsplash.com/photo-1579684453423-f84349ef60b0?q=80&w=1491&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="pharmacy interior">
          <div class="banner-info">
            <div class="logo">
              <div class="image">
                ${this.checkVerified(this.getAttribute('verified'))}
                <img src="https://plus.unsplash.com/premium_photo-1664304327468-82cfd5886b55?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9jdG9yJTIwc3F1YXJlJTIwaW1hZ2V8ZW58MHx8MHx8fDA%3D" alt="pharmacy logo">
              </div>
            </div>
            <div class="provider-info">
              <h2 class="name">Jane Clinic & Dental</h2>
              <div class="location">
                <span class="address">1245 Kileleshwa Drive</span>
                <span class="since">Operating since 2011</span>
              </div>
            </div>
          </div>
        </div>
      `
    }
    else {
      return /* html */`
        <div class="banner">
          ${this.getBannerEdit(owner)}
          <img src="https://images.unsplash.com/photo-1579684453423-f84349ef60b0?q=80&w=1491&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="pharmacy interior">
          <div class="logo">
            <div class="image">
              ${this.checkVerified(this.getAttribute('verified'))}
              <img src="https://plus.unsplash.com/premium_photo-1664304327468-82cfd5886b55?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9jdG9yJTIwc3F1YXJlJTIwaW1hZ2V8ZW58MHx8MHx8fDA%3D" alt="pharmacy logo">
            </div>
            <div class="rating">
              <span class="number">4.7</span>
              <span class="out-of">/</span>
              <span class="total">5.0</span>
            </div>
          </div>
          <div class="banner-info">
            <div class="provider-info">
              <h2 class="name">Jane Clinic & Dental</h2>
              <div class="location">
                <span class="address">1245 Kileleshwa Drive</span>
                <span class="since">Operating since 2011</span>
              </div>
            </div>
            ${this.getTopStats()}
          </div>
        </div>
      `
    }
  }

  getBannerEdit = owner => {
    if (!owner) return '';
    return /*html*/`
      <div class="action-card">
        <svg class="action-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.0002 2.75012C5.06324 2.75012 2.75024 5.06312 2.75024 12.0001C2.75024 18.9371 5.06324 21.2501 12.0002 21.2501C18.9372 21.2501 21.2502 18.9371 21.2502 12.0001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M19.5285 4.30388V4.30388C18.5355 3.42488 17.0185 3.51688 16.1395 4.50988C16.1395 4.50988 11.7705 9.44488 10.2555 11.1579C8.73853 12.8699 9.85053 15.2349 9.85053 15.2349C9.85053 15.2349 12.3545 16.0279 13.8485 14.3399C15.3435 12.6519 19.7345 7.69288 19.7345 7.69288C20.6135 6.69988 20.5205 5.18288 19.5285 4.30388Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M15.009 5.80078L18.604 8.98378" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
        <span class="action-text">Modify</span>
      </div>
    `
  }

  checkVerified = verified => {
    if (verified !== 'true') return '';
    return /*html*/`
      <span class="verified" title="Verified Account">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.3592 1.41412C15.9218 0.966482 15.3993 0.610789 14.8224 0.367944C14.2455 0.125098 13.6259 0 13 0C12.3741 0 11.7545 0.125098 11.1776 0.367944C10.6007 0.610789 10.0782 0.966482 9.64079 1.41412L8.62993 2.45091L7.18354 2.43304C6.55745 2.42563 5.93619 2.54347 5.35631 2.77964C4.77642 3.01581 4.24962 3.36554 3.80687 3.80826C3.36413 4.25098 3.01438 4.77775 2.77819 5.3576C2.542 5.93744 2.42415 6.55866 2.43156 7.18472L2.44781 8.63102L1.41421 9.64181C0.966543 10.0792 0.610827 10.6017 0.367967 11.1785C0.125106 11.7554 0 12.3749 0 13.0008C0 13.6267 0.125106 14.2462 0.367967 14.8231C0.610827 15.3999 0.966543 15.9224 1.41421 16.3598L2.44944 17.3706L2.43156 18.8169C2.42415 19.443 2.542 20.0642 2.77819 20.644C3.01438 21.2239 3.36413 21.7506 3.80687 22.1934C4.24962 22.6361 4.77642 22.9858 5.35631 23.222C5.93619 23.4582 6.55745 23.576 7.18354 23.5686L8.62993 23.5523L9.64079 24.5859C10.0782 25.0335 10.6007 25.3892 11.1776 25.6321C11.7545 25.8749 12.3741 26 13 26C13.6259 26 14.2455 25.8749 14.8224 25.6321C15.3993 25.3892 15.9218 25.0335 16.3592 24.5859L17.3701 23.5507L18.8165 23.5686C19.4426 23.576 20.0638 23.4582 20.6437 23.222C21.2236 22.9858 21.7504 22.6361 22.1931 22.1934C22.6359 21.7506 22.9856 21.2239 23.2218 20.644C23.458 20.0642 23.5758 19.443 23.5684 18.8169L23.5522 17.3706L24.5858 16.3598C25.0335 15.9224 25.3892 15.3999 25.632 14.8231C25.8749 14.2462 26 13.6267 26 13.0008C26 12.3749 25.8749 11.7554 25.632 11.1785C25.3892 10.6017 25.0335 10.0792 24.5858 9.64181L23.5506 8.63102L23.5684 7.18472C23.5758 6.55866 23.458 5.93744 23.2218 5.3576C22.9856 4.77775 22.6359 4.25098 22.1931 3.80826C21.7504 3.36554 21.2236 3.01581 20.6437 2.77964C20.0638 2.54347 19.4426 2.42563 18.8165 2.43304L17.3701 2.44929L16.3592 1.41412Z" fill="currentColor"
            id="top"/>
          <path d="M15.3256 4.97901C15.0228 4.6691 14.661 4.42285 14.2616 4.25473C13.8623 4.08661 13.4333 4 13 4C12.5667 4 12.1377 4.08661 11.7384 4.25473C11.339 4.42285 10.9772 4.6691 10.6744 4.97901L9.97457 5.69678L8.97322 5.68441C8.53977 5.67928 8.10967 5.76086 7.70821 5.92437C7.30675 6.08787 6.94204 6.32999 6.63553 6.63649C6.32901 6.94298 6.08688 7.30767 5.92336 7.70911C5.75985 8.11054 5.67826 8.54061 5.68339 8.97403L5.69464 9.97532L4.97907 10.6751C4.66914 10.9779 4.42288 11.3396 4.25475 11.739C4.08661 12.1383 4 12.5673 4 13.0006C4 13.4339 4.08661 13.8628 4.25475 14.2621C4.42288 14.6615 4.66914 15.0232 4.97907 15.326L5.69577 16.0258L5.68339 17.0271C5.67826 17.4605 5.75985 17.8906 5.92336 18.292C6.08688 18.6935 6.32901 19.0581 6.63553 19.3646C6.94204 19.6711 7.30675 19.9133 7.70821 20.0768C8.10967 20.2403 8.53977 20.3218 8.97322 20.3167L9.97457 20.3055L10.6744 21.021C10.9772 21.3309 11.339 21.5771 11.7384 21.7453C12.1377 21.9134 12.5667 22 13 22C13.4333 22 13.8623 21.9134 14.2616 21.7453C14.661 21.5771 15.0228 21.3309 15.3256 21.021L16.0254 20.3043L17.0268 20.3167C17.4602 20.3218 17.8903 20.2403 18.2918 20.0768C18.6932 19.9133 19.058 19.6711 19.3645 19.3646C19.671 19.0581 19.9131 18.6935 20.0766 18.292C20.2402 17.8906 20.3217 17.4605 20.3166 17.0271L20.3054 16.0258L21.0209 15.326C21.3309 15.0232 21.5771 14.6615 21.7453 14.2621C21.9134 13.8628 22 13.4339 22 13.0006C22 12.5673 21.9134 12.1383 21.7453 11.739C21.5771 11.3396 21.3309 10.9779 21.0209 10.6751L20.3042 9.97532L20.3166 8.97403C20.3217 8.54061 20.2402 8.11054 20.0766 7.70911C19.9131 7.30767 19.671 6.94298 19.3645 6.63649C19.058 6.32999 18.6932 6.08787 18.2918 5.92437C17.8903 5.76086 17.4602 5.67928 17.0268 5.68441L16.0254 5.69566L15.3256 4.97901ZM15.6485 11.7113L12.2732 15.0864C12.2209 15.1388 12.1588 15.1803 12.0905 15.2087C12.0222 15.2371 11.9489 15.2517 11.8749 15.2517C11.8009 15.2517 11.7276 15.2371 11.6593 15.2087C11.5909 15.1803 11.5289 15.1388 11.4766 15.0864L9.78893 13.3988C9.73662 13.3465 9.69513 13.2844 9.66683 13.2161C9.63852 13.1478 9.62395 13.0745 9.62395 13.0006C9.62395 12.9266 9.63852 12.8534 9.66683 12.785C9.69513 12.7167 9.73662 12.6546 9.78893 12.6023C9.84123 12.55 9.90333 12.5085 9.97166 12.4802C10.04 12.4519 10.1132 12.4373 10.1872 12.4373C10.2612 12.4373 10.3344 12.4519 10.4028 12.4802C10.4711 12.5085 10.5332 12.55 10.5855 12.6023L11.8749 13.8927L14.8519 10.9147C14.9576 10.8091 15.1008 10.7498 15.2502 10.7498C15.3996 10.7498 15.5429 10.8091 15.6485 10.9147C15.7542 11.0204 15.8135 11.1636 15.8135 11.313C15.8135 11.4624 15.7542 11.6056 15.6485 11.7113Z"
             fill="url(#gradient)" id="bottom"/>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1" gradientUnits="userSpaceOnUse">
              <stop offset="-6.72%" stop-color="var(--alt-color)" />
              <stop offset="109.77%" stop-color="var(--accent-color)" />
            </linearGradient>
          </defs>
        </svg>
      </span>
		`
  }

  getTabs = kind => {
    return /* html */`
      <ul class="tabs">
        <li class="tab highlights active" section="highlights">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z" stroke="currentColor" stroke-width="1.8" />
              <path d="M11.9955 3H12.0045M11.9961 21H12.0051M18.3588 5.63599H18.3678M5.63409 18.364H5.64307M5.63409 5.63647H5.64307M18.3582 18.3645H18.3672M20.991 12.0006H21M3 12.0006H3.00898" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="text">About</span>
        </li>
        <li class="tab services" section="services">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M19.4173 15.7133C23.368 10.7038 22.3007 5.73508 19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801L11.9998 4.84158M19.4173 15.7133C18.469 16.9156 17.2317 18.1204 15.6605 19.2834C14.1143 20.4278 13.3412 21 12 21C10.6588 21 9.88572 20.4278 8.33953 19.2834C0.22172 13.2749 1.01807 6.15293 4.53744 3.99415C7.21909 2.34923 9.55962 3.01211 10.9656 4.06801L11.9998 4.84158M19.4173 15.7133L13.8921 9.44479C13.6659 9.1882 13.2873 9.13296 12.9972 9.31424L10.8111 10.6806C10.0418 11.1614 9.04334 11.0532 8.3949 10.4187C7.53837 9.58062 7.62479 8.17769 8.5777 7.45106L11.9998 4.84158" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </span>
          <span class="text">Services</span>
        </li>
        ${this.getSpecialistTabs(kind)}
        <li class="tab reviews" section="reviews">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </span>
          <span class="text">Reviews</span>
        </li>
        <span class="tab-indicator"></span>
      </ul>
    `
  }

  getSpecialistTabs = kind => {
    if (kind === 'specialist') {
      return /* html */`
        <li class="tab education" section="education">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M21.1609 9.92846C22.1928 9.54155 22.2858 7.69292 21.3685 5.79943C20.4512 3.90594 18.8711 2.68462 17.8391 3.07154M21.1609 9.92846C20.1289 10.3154 18.5488 9.09406 17.6315 7.20057C16.7142 5.30708 16.8072 3.45845 17.8391 3.07154M21.1609 9.92846L6.16089 18.9285C5.12895 19.3154 3.54878 18.0941 2.6315 16.2006C1.71421 14.3071 1.80716 12.4584 2.83911 12.0715L17.8391 3.07154" stroke="currentColor" stroke-width="1.8" />
              <path d="M15 13.6072C13.6383 13.0342 10.9233 10.9509 10.9574 7.20117M11.5 15.7012C10.3333 15.1444 7.9 13.0787 7.5 9.26966" stroke="currentColor" stroke-width="1.8" />
              <path d="M15.43 14C16.0276 15.1302 16.639 18.1124 14.5498 21L13.5632 19.584L11 20.8103C11 20.8103 12.8249 18.8868 11.9528 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="text">Education</span>
        </li>
      `
    } else {
      return /* html */`
        <li class="tab doctors" section="doctors">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M13 11C13 8.79086 11.2091 7 9 7C6.79086 7 5 8.79086 5 11C5 13.2091 6.79086 15 9 15C11.2091 15 13 13.2091 13 11Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M11.0386 7.55773C11.0131 7.37547 11 7.18927 11 7C11 4.79086 12.7909 3 15 3C17.2091 3 19 4.79086 19 7C19 9.20914 17.2091 11 15 11C14.2554 11 13.5584 10.7966 12.9614 10.4423" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M15 21C15 17.6863 12.3137 15 9 15C5.68629 15 3 17.6863 3 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M21 17C21 13.6863 18.3137 11 15 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </span>
          <span class="text">Specialists</span>
        </li>
      `
    }
  }

  getTopStats = () => {
    return /* html */`
      <div class="top-stats">
        <div class="stat">
          <span class="experience">
            <span class="number">${this.number.withCommas(10)}+</span>
            <span class="label">Years</span>
          </span>
          <span class="label">Experience</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M18.9905 19H19M18.9905 19C18.3678 19.6175 17.2393 19.4637 16.4479 19.4637C15.4765 19.4637 15.0087 19.6537 14.3154 20.347C13.7251 20.9374 12.9337 22 12 22C11.0663 22 10.2749 20.9374 9.68457 20.347C8.99128 19.6537 8.52349 19.4637 7.55206 19.4637C6.76068 19.4637 5.63218 19.6175 5.00949 19C4.38181 18.3776 4.53628 17.2444 4.53628 16.4479C4.53628 15.4414 4.31616 14.9786 3.59938 14.2618C2.53314 13.1956 2.00002 12.6624 2 12C2.00001 11.3375 2.53312 10.8044 3.59935 9.73817C4.2392 9.09832 4.53628 8.46428 4.53628 7.55206C4.53628 6.76065 4.38249 5.63214 5 5.00944C5.62243 4.38178 6.7556 4.53626 7.55208 4.53626C8.46427 4.53626 9.09832 4.2392 9.73815 3.59937C10.8044 2.53312 11.3375 2 12 2C12.6625 2 13.1956 2.53312 14.2618 3.59937C14.9015 4.23907 15.5355 4.53626 16.4479 4.53626C17.2393 4.53626 18.3679 4.38247 18.9906 5C19.6182 5.62243 19.4637 6.75559 19.4637 7.55206C19.4637 8.55858 19.6839 9.02137 20.4006 9.73817C21.4669 10.8044 22 11.3375 22 12C22 12.6624 21.4669 13.1956 20.4006 14.2618C19.6838 14.9786 19.4637 15.4414 19.4637 16.4479C19.4637 17.2444 19.6182 18.3776 18.9905 19Z" stroke="currentColor" stroke-width="1.8"></path>
            <path d="M9 12.8929C9 12.8929 10.2 13.5447 10.8 14.5C10.8 14.5 12.6 10.75 15 9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </div>
        <div class="stat">
          <span class="number">${this.number.withCommas(8)}</span>
          <span class="label">Services</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M19.4173 15.7133C23.368 10.7038 22.3007 5.73508 19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801L11.9998 4.84158M19.4173 15.7133C18.469 16.9156 17.2317 18.1204 15.6605 19.2834C14.1143 20.4278 13.3412 21 12 21C10.6588 21 9.88572 20.4278 8.33953 19.2834C0.22172 13.2749 1.01807 6.15293 4.53744 3.99415C7.21909 2.34923 9.55962 3.01211 10.9656 4.06801L11.9998 4.84158M19.4173 15.7133L13.8921 9.44479C13.6659 9.1882 13.2873 9.13296 12.9972 9.31424L10.8111 10.6806C10.0418 11.1614 9.04334 11.0532 8.3949 10.4187C7.53837 9.58062 7.62479 8.17769 8.5777 7.45106L11.9998 4.84158" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="stat">
          <span class="number">${this.number.withCommas(15680)}</span>
          <span class="label">Reviews</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M13 11C13 8.79086 11.2091 7 9 7C6.79086 7 5 8.79086 5 11C5 13.2091 6.79086 15 9 15C11.2091 15 13 13.2091 13 11Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M11.0386 7.55773C11.0131 7.37547 11 7.18927 11 7C11 4.79086 12.7909 3 15 3C17.2091 3 19 4.79086 19 7C19 9.20914 17.2091 11 15 11C14.2554 11 13.5584 10.7966 12.9614 10.4423" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M15 21C15 17.6863 12.3137 15 9 15C5.68629 15 3 17.6863 3 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M21 17C21 13.6863 18.3137 11 15 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </div>
        <div class="stat">
          <span class="number">4.7</span>
          <span class="label">Rating</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    `
  }

  getHighlights = () => {
    return /* html */`
      <provider-highlights kind="${this.getAttribute('kind')}" owner="${this.getAttribute('owner')}" provider-name="Jane Clinic & Dental Care"></provider-highlights>
    `
  }

  getSchedule = () => {
    return /* html */`
      <book-schedule kind="${this.getAttribute('kind')}" owner="${this.getAttribute('owner')}" provider-name="Jane Clinic & Dental Care"></book-schedule>
    `
  }

  getServices = () => {
    return /* html */`
      <services-feed url="/services/example" kind="${this.getAttribute('kind')}" owner="${this.getAttribute('owner')}" name="Jane Clinic & Dental Care"></services-feed>
    `
  }

  getDoctors = () => {
    return /* html */`
      <doctors-feed url="/services/example" kind="${this.getAttribute('kind')}" owner="${this.getAttribute('owner')}" name="Jane Clinic & Dental Care"></doctors-feed>
    `
  }

  getReviews = () => {
    return /* html */`
      <reviews-feed  url="/services/example" kind="${this.getAttribute('kind')}" owner="${this.getAttribute('owner')}" name="Jane Clinic & Dental Care"
        reviews="1248" reviews-distribution='{ "one": 24, "two": 56, "three": 142, "four": 512, "five": 514 }' average-review="4.7">
      </reviews-feed>
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
          width: 100%;
          margin: 0;
        }

        div.banner {
          width: 100%;
          height: 300px;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }

        div.banner > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        div.banner > div.logo {
          position: absolute;
          bottom: 10px;
          right: 20px;
          margin: 0;
          background: var(--verified-background);
          display: flex;
          flex-flow: column;
          gap: 20px;
          padding: 10px;
          box-sizing: border-box;
          justify-content: center;
          align-items: center;
          border: var(--border);
          border-width: 2px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 12px;
          box-shadow: var(--box-shadow);
        }

        div.banner > div.logo > div.image {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 50%;
          position: relative;
          background: var(--verified-background);
        }

        div.banner > div.logo > div.image > img {
          width: 112px;
          height: 112px;
          padding: 4px;
          object-fit: cover;
          border-radius: 50%;
          overflow: hidden;
          border: var(--action-border);
          border-color: var(--accent-color);
          border-width: 4px;
        }

        div.banner > div.logo > div.image > span.verified {
          pointer-events: none;
          position: absolute;
          bottom: 6px;
          right: 6px;
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
        }

        div.banner > div.logo > div.image > span.verified > svg {
          width: 38px;
          height: 38px;
          margin-bottom: -1px;
          display: flex;
          justify-content: center;
          color: var(--verified-background);
          align-items: center;
        }

        div.banner > div.logo > div.image > span.verified > svg > path#top {
          color: var(--verified-background);
          fill: var(--verified-background);
        }

        div.banner > div.logo > div.rating {
          padding: 5px 10px;
          border-radius: 12px;
          background: var(--accent-linear);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: var(--box-shadow);
          display: flex;
          flex-flow: row;
          align-items: center;
          width: calc(100% - 20px);
          min-width: 120px;
          max-width: calc(100% - 20px);
          justify-content: center;
          gap: 5px;
          font-family: var(--font-main), sans-serif;
          line-height: 1.3;
        }

        div.banner > div.logo > div.rating > span.number {
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--white-color);
          font-family: var(--font-read), sans-serif;
          margin: 0;
        }

        div.banner > div.logo > div.rating > span.out-of {
          font-size: 0.9rem;
          font-weight: 400;
          color: var(--white-color);
          opacity: 0.8;
          margin: 0;
        }

        div.banner > div.logo > div.rating > span.total {
          font-size: 1.3rem;
          font-weight: 500;
          font-family: var(--font-read), sans-serif;
          color: var(--white-color);
          opacity: 0.8;
          margin: 0;
        }

        /* banner info */
        div.banner > div.banner-info {
          position: absolute;
          bottom: 10px;
          left: 0;
          border-radius: 12px;
          padding: 10px 15px;
          display: flex;
          flex-flow: column;
          gap: 15px;
        }

        div.banner > div.banner-info > div.top-stats {
          display: flex;
          flex-flow: row nowrap;
          gap: 15px;
        }

        div.banner > div.banner-info > div.top-stats > div.stat {
          display: flex;
          flex-flow: column;
          align-items: start;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          /* add glass morphism effect */
          background: var(--morph-background);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 10px 12px;
          min-width: 120px;
          max-width: max-content;
          height: 70px;
          margin: 0;
          position: relative;
          box-shadow: var(--box-shadow);
        }

        div.banner > div.banner-info > div.top-stats > div.stat > svg {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 20px;
          height: 20px;
          opacity: 0.8;
          color: var(--white-color);
        }

        div.banner > div.banner-info > div.top-stats > div.stat > .experience {
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 5px;
          padding-right: 30px;
        }

        div.banner > div.banner-info > div.top-stats > div.stat > .experience > .number {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          color: var(--white-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.3;
        }

        div.banner > div.banner-info > div.top-stats > div.stat > .experience > .label {
          font-size: 0.9rem;
          font-weight: 400;
          margin: 0;
          color: var(--white-color);
          opacity: 0.8;
          font-family: var(--font-read), sans-serif;
          line-height: 1.3;
        }

        div.banner > div.banner-info > div.top-stats > div.stat > .number {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          color: var(--white-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.3;
        }

        div.banner > div.banner-info > div.top-stats > div.stat > .label {
          font-size: 0.9rem;
          font-weight: 400;
          margin: 0;
          color: var(--white-color);
          opacity: 0.8;
          font-family: var(--font-read), sans-serif;
          line-height: 1.3;
        }

        div.banner > div.banner-info > div.provider-info {
          display: flex;
          flex-flow: column;
          gap: 5px;
          margin: 0;
          background: var(--morph-background);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 10px 12px;
        }

        div.banner > div.banner-info > div.provider-info > .name {
          font-size: 1.4rem;
          font-weight: 500;
          line-height: 1.3;
          font-family: var(--font-main), sans-serif;
          color: var(--white-color);
          margin: 0;
        }

        div.banner > div.banner-info > div.provider-info > .location {
          display: flex;
          flex-flow: column;
          gap: 2px;
          margin: 0;
        }

        div.banner > div.banner-info > div.provider-info > .location > .address {
          font-size: 0.9rem;
          font-weight: 400;
          color: var(--white-color);
          opacity: 0.8;
          font-family: var(--font-main), sans-serif;
          line-height: 1.3;
        }

        div.banner > div.banner-info > div.provider-info > .location > .since {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--white-color);
          opacity: 0.6;
          font-family: var(--font-read), sans-serif;
          line-height: 1.3;
        }

        /* action */
        .action-card {
          position: absolute;
          top: 10px;
          right: 20px;
          z-index: 100;
          border-radius: 10px;
          background-color: var(--morph-background);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: var(--box-shadow);
          font-family: var(--font-main), sans-serif;
          font-weight: 500;
          color: var(--white-color);
          font-size: 1rem;
          padding: 3px 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          width: max-content;
          min-width: fit-content;
        }

        .action-card:hover {
          border-color: #8b5cf6;
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.25);
        }

        .action-card:active {
          transform: translateY(-2px) scale(0.98);
        }

        /* Action Icons */
        .action-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white-color);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .action-card:hover {
          transform: rotate(5deg) scale(1.1);
        }

        .action-card > .action-text {
          font-size: 0.9rem;
          font-weight: 500;
          color: inherit;
          margin: 0;
          padding: 0;
          line-height: 1.3;
          user-select: none;
        }

        /* Tabs Styles */
        ul.tabs {
          list-style: none;
          display: flex;
          flex-flow: row nowrap;
          gap: 8px;
          padding: 0;
          width: 100%;
          max-width: 100%;
          border-bottom: var(--border);
          position: relative;
          overflow-x: scroll;
          scrollbar-width: none;
          padding: 15px 0 0;
          margin: 0;
          position: sticky;
          top: 0;
          background: var(--background);
          z-index: 10;
        }

        ul.tabs::-webkit-scrollbar {
          visibility: hidden;
          display: none;
        }

        ul.tabs > li.tab {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          gap: 8px;
          padding: 12px 10px 12px 2px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.3;
          white-space: nowrap;
          position: relative;
        }

        ul.tabs > li.tab > span.icon {
          display: flex;
          justify-content: center;
          align-items: center;
          color: inherit;
        }

        ul.tabs > li.tab > span.icon > svg {
          width: 20px;
          height: 20px;
          color: inherit;
          transition: color 0.3s ease-in-out;
        }

        ul.tabs > li.tab.reviews > span.icon > svg {
          width: 18px;
          height: 18px;
        }

        ul.tabs > li.tab.services > span.icon > svg {
          width: 19px;
          height: 19px;
        }

        ul.tabs > li.tab.active,
        ul.tabs > li.tab:hover {
          color: var(--accent-color);
          font-weight: 600;
        }

        ul.tabs > li.tab:hover {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: background 0.3s ease-in-out;
        }

        ul.tabs > span.tab-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100px;
          height: 3px;
          background: var(--accent-color);
          border-radius: 3px 3px 0 0;
          transition: all 0.3s ease-in-out;
        }

        /* Content Container Styles */
        div.content-container {
          width: 100%;
          padding: 10px 0 0;
          margin: 0;
        }

        /* Mobile Styles */
        @media screen and (max-width: 700px) {
          :host {
            border: none;
            width: 100%;
            max-width: 100%;
            min-width: 100%;
            max-height: unset;
            height: unset;
            min-height: unset;
            max-height: unset;
            padding: 10px 10px 65px;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: start;
          }

          div.banner {
            width: 100%;
            height: 180px;
            border-radius: 10px;
            overflow: hidden;
            position: relative;
          }

          div.banner > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          /* banner info */
          div.banner > div.banner-info {
            position: absolute;
            bottom: 5px;
            left: 5px;
            width: calc(100% - 10px);
            padding: 5px 10px;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: space-between;
            gap: 5px;
            background: var(--morph-background);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 12px;
          }

          div.banner > div.banner-info > div.logo {
            display: flex;
            flex-flow: column;
            gap: 20px;
            padding: 0;
            box-sizing: border-box;
            justify-content: center;
            align-items: center;
          }

          div.banner > div.banner-info > div.logo > div.image {
            width: 68px;
            height: 68px;
            object-fit: cover;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            background: var(--verified-background);
          }

          div.banner > div.banner-info > div.logo > div.image > img {
            width: 64px;
            height: 64px;
            padding: 2px;
            object-fit: cover;
            border-radius: 50%;
            overflow: hidden;
            border: var(--action-border);
            border-color: var(--accent-color);
            border-width: 3px;
          }

          div.banner > div.banner-info > div.logo > div.image > span.verified {
            pointer-events: none;
            position: absolute;
            bottom: 5px;
            right: 0;
            width: 22px;
            height: 22px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
          }

          div.banner > div.banner-info> div.logo > div.image > span.verified > svg {
            width: 38px;
            height: 38px;
            margin-bottom: -1px;
            display: flex;
            justify-content: center;
            color: var(--verified-background);
            align-items: center;
          }

          div.banner > div.banner-info > div.logo > div.image > span.verified > svg > path#top {
            color: var(--verified-background);
            fill: var(--verified-background);
          }
          
          div.banner > div.banner-info > div.provider-info {
            display: flex;
            flex-flow: column;
            align-items: start;
            justify-content: center;
            width: calc(100% - 60px);
            height: fit-content;
            gap: 5px;
            margin: 0;
            padding: 0 0 0 8px;
            background: transparent;
            backdrop-filter: unset;
            -webkit-backdrop-filter: unset;
            border-radius: unset;
            border-left: var(--action-border);
            border-left-style: solid;
            border-color: var(--white-color);
          }

          div.banner > div.banner-info > div.provider-info > .name {
            font-size: 1.2rem;
            width: 100%;
            font-weight: 500;
            line-height: 1;
            font-family: var(--font-main), sans-serif;
            color: var(--white-color);
            margin: 0;

            /* add ellipsis */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          div.banner > div.banner-info > div.provider-info > .location {
            display: flex;
            flex-flow: column;
            gap: 2px;
            margin: 0;
            width: 100%;
          }

          div.banner > div.banner-info > div.provider-info > .location > .address {
            font-size: 0.8rem;
            font-weight: 400;
            color: var(--white-color);
            opacity: 0.8;
            font-family: var(--font-main), sans-serif;
            line-height: 1;

            /* add ellipsis */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          div.banner > div.banner-info > div.provider-info > .location > .since {
            font-size: 0.8rem;
            font-weight: 500;
            color: var(--white-color);
            opacity: 0.6;
            font-family: var(--font-read), sans-serif;
            line-height: 1.3;
          }

          /* Tabs Styles */
          ul.tabs {
            list-style: none;
            display: flex;
            flex-flow: row nowrap;
            gap: 8px;
            width: 100%;
            max-width: 100%;
            padding: 0;
            border-bottom: var(--border);
            position: relative;
            overflow-x: scroll;
            overflow-y: visible;
            scrollbar-width: none;
            padding: 10px 0 0;
            margin: 0;
            position: sticky;
            top: 48px;
            background: var(--background);
            z-index: 10;
          }

          ul.tabs::-webkit-scrollbar {
            visibility: hidden;
            display: none;
          }

          ul.tabs > li.tab {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            gap: 8px;
            padding: 12px 10px 12px 2px;
            cursor: default !important;
            font-size: 0.9rem;
            font-weight: 500;
            color: var(--text-color);
            font-family: var(--font-main), sans-serif;
            line-height: 1.3;
            white-space: nowrap;
            position: relative;
          }

          ul.tabs > li.tab > span.icon {
            display: flex;
            justify-content: center;
            align-items: center;
            color: inherit;
          }

          ul.tabs > li.tab > span.icon > svg {
            width: 17px;
            height: 17px;
            color: inherit;
            transition: color 0.3s ease-in-out;
          }

          ul.tabs > li.tab.reviews > span.icon > svg {
            width: 16px;
            height: 16px;
          }

          ul.tabs > li.tab.services > span.icon > svg {
            width: 16px;
            height: 16px;
          }

          ul.tabs > li.tab.active,
          ul.tabs > li.tab:hover {
            color: var(--accent-color);
            font-weight: 600;
          }

          ul.tabs > li.tab:hover {
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            transition: background 0.3s ease-in-out;
          }

          ul.tabs > span.tab-indicator {
            position: absolute;
            bottom: 0; /* adjust this */
            left: 0;
            width: 100px;
            height: 4px;
            background: var(--accent-color);
            border-radius: 3px 3px 0 0;
            transition: all 0.3s ease-in-out;
          }
        }
      </style>
    `
  }
}