export default class Book extends HTMLElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: 'open' });
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.selected = true;
    this.mql = window.matchMedia("(max-width: 700px)");
    this.owner = true;
    // specialists-only component (services removed)
    this._boundResize = this.handleResize.bind(this);
    this._boundSpecPrev = this.handleSpecPrev.bind(this);
    this._boundSpecNext = this.handleSpecNext.bind(this);
    this._boundSpecClick = this.handleSpecClick.bind(this);

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
    this.watchMql();
    // attach event listeners to the freshly rendered DOM
    this.attachListeners();
  }

  connectedCallback() {
    // when added to DOM, ensure listeners are attached
    this.attachListeners();
  }
  disconnectedCallback() {
    // clean up event listeners if any
    this.detachListeners();
  }

  handleResize() {
    // placeholder in case we want to react to resizes later
  }

  attachListeners() {
    // detach first to avoid duplicate listeners
    this.detachListeners();

    const root = this.shadowObj;
    if (!root) return;

    // specialists-specific elements (scoped)
    this.specsEl = root.querySelector('.specialists-content .specialists');
    this.specPrevEl = root.querySelector('.specialists-content .icon.prev');
    this.specNextEl = root.querySelector('.specialists-content .icon.next');

    if (this.specPrevEl) this.specPrevEl.addEventListener('click', this._boundSpecPrev);
    if (this.specNextEl) this.specNextEl.addEventListener('click', this._boundSpecNext);
    if (this.specsEl) this.specsEl.addEventListener('click', this._boundSpecClick);

    // keep track of resize if needed
    window.addEventListener('resize', this._boundResize);
  }

  detachListeners() {
    try {
      if (this.specPrevEl) this.specPrevEl.removeEventListener('click', this._boundSpecPrev);
      if (this.specNextEl) this.specNextEl.removeEventListener('click', this._boundSpecNext);
      if (this.specsEl) this.specsEl.removeEventListener('click', this._boundSpecClick);
      window.removeEventListener('resize', this._boundResize);
    } catch (e) {
      // ignore if already removed
    }
    this.specsEl = null;
    this.specPrevEl = null;
    this.specNextEl = null;
  }



  handleSpecPrev(e) {
    e?.preventDefault();
    this.scrollSpecialists('prev');
  }

  handleSpecNext(e) {
    e?.preventDefault();
    this.scrollSpecialists('next');
  }

  // Scroll specialists horizontally similar to services
  scrollSpecialists(direction = 'next') {
    const el = this.specsEl;
    if (!el) return;

    const first = el.querySelector('.specialist');
    if (!first) return;

    const itemRect = first.getBoundingClientRect();
    const itemWidth = Math.round(itemRect.width);

    let gap = 0;
    try {
      const cs = getComputedStyle(el);
      const gapVal = cs.getPropertyValue('gap') || cs.getPropertyValue('column-gap') || '';
      gap = gapVal ? Math.round(parseFloat(gapVal)) : 0;
    } catch (e) {
      gap = 0;
    }

    // scroll by two items for parity with services
    const delta = (itemWidth + gap) * 2;
    const left = direction === 'next' ? delta : -delta;

    el.scrollBy({ left, behavior: 'smooth' });
  }

  handleSpecClick(e) {
    const target = e.target;
    const specEl = target.closest ? target.closest('.specialist') : null;
    if (!specEl) return;

    // determine index
    const root = this.shadowObj;
    const all = Array.from(root.querySelectorAll('.specialist'));
    const idx = all.indexOf(specEl);
    if (idx === -1) return;

    this.updateSpecialistSelection(idx, specEl);
  }

  updateSpecialistSelection(index, specEl = null) {
    const root = this.shadowObj;
    if (!root) return;
    const all = Array.from(root.querySelectorAll('.specialist'));

    all.forEach((el, i) => {
      const is = i === index;
      if (is) {
        el.classList.add('selected');
        if (!el.querySelector('.checkbox-round')) {
          const span = document.createElement('span');
          span.className = 'checkbox-round';
          span.innerHTML = this.getActiveSvg();
          el.appendChild(span);
        }
      } else {
        el.classList.remove('selected');
        const cb = el.querySelector('.checkbox-round');
        if (cb) cb.remove();
      }
    });

    try {
      this.dispatchEvent(new CustomEvent('specialist-selected', { detail: { index }, bubbles: true }));
    } catch (e) {
      // ignore
    }
  }


  watchMql() {
    this.mql.addEventListener('change', () => {
      this.render();
    });
  }

  formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHour}:${mins.toString().padStart(2, '0')} ${period}`;
  }

  getTemplate() {
    return /* html */`
      ${this.getBody()}
      ${this.getStyles()}
    `
  }

  getBody = () => {
    return /* html */`
      <div class="content-container">
        <div class="content">
          ${this.getSpecialist()}
          <div class="charges">
            <p class="note">** By selecting a service, you agree to our <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>.</p>
          </div>
        </div>
        <div class="schedule">
          <week-schedule provider-name="HealthCare Plus Pharmacy"></week-schedule>
        </div>
      </div>
      ${this.getBookings()}
    `
  }

  getSpecialist = () => {
    return /* html */`
      <div class="specialists-content">
        ${this.getSpecialistHead()}
        <div class="specialists">
          <div class="specialist selected">
            <div class="specialist-content">
              <div class="avatar">
                <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Jane Clinic & Dental Care">
                ${this.checkVerified('true')}
              </div>
              <div class="info">
                <div class="name">
                  <span class="name">Allan Mc'Ayoo</span>
                  <span class="title">Cardiologist</span>
                </div>
                <div class="bottom">
                  <span class="rating">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                      <path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span class="number">4.7</span>
                    <span class="sp">•</span>
                    <span class="reviews">${this.number.shorten(15680)}</span>
                  </span>
                </div>
              </div>
            </div>
            <span class="rate">
              <span class="price">
                <span class="currency">Ksh</span>
                <span class="amount">${this.number.withCommas(5678)}</span>
              </span>
              <span class="separator">/</span>
              <span class="duration">30min</span>
            </span>
            <span class="checkbox-round">${this.getActiveSvg()}</span>
          </div>

          <div class="specialist">
            <div class="specialist-content">
              <div class="avatar">
                <img src="https://randomuser.me/api/portraits/women/2.jpg" alt="Jane Clinic & Dental Care">
                ${this.checkVerified('true')}
              </div>
              <div class="info">
                <div class="name">
                  <span class="name">Elizabeth Wanjiku</span>
                  <span class="title">General Practitioner</span>
                </div>
                <div class="bottom">
                  <span class="rating">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                      <path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span class="number">4.8</span>
                    <span class="sp">•</span>
                    <span class="reviews">${this.number.shorten(8420)}</span>
                  </span>
                </div>
              </div>
            </div>
            <span class="rate">
              <span class="price">
                <span class="currency">Ksh</span>
                <span class="amount">${this.number.withCommas(4500)}</span>
              </span>
              <span class="separator">/</span>
              <span class="duration">45min</span>
            </span>
          </div>

          <div class="specialist">
            <div class="specialist-content">
              <div class="avatar">
                <img src="https://randomuser.me/api/portraits/women/3.jpg" alt="Jane Clinic & Dental Care">
                ${this.checkVerified('false')}
              </div>
              <div class="info">
                <div class="name">
                  <span class="name">Dr. Amina Ali</span>
                  <span class="title">Pediatrician</span>
                </div>
                <div class="bottom">
                  <span class="rating">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                      <path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span class="number">4.6</span>
                    <span class="sp">•</span>
                    <span class="reviews">${this.number.shorten(4300)}</span>
                  </span>
                </div>
              </div>
            </div>
            <span class="rate">
              <span class="price">
                <span class="currency">Ksh</span>
                <span class="amount">${this.number.withCommas(3200)}</span>
              </span>
              <span class="separator">/</span>
              <span class="duration">30min</span>
            </span>
          </div>

          <div class="specialist">
            <div class="specialist-content">
              <div class="avatar">
                <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="Jane Clinic & Dental Care">
                ${this.checkVerified('true')}
              </div>
              <div class="info">
                <div class="name">
                  <span class="name">Dr. Michael Brown</span>
                  <span class="title">Dermatologist</span>
                </div>
                <div class="bottom">
                  <span class="rating">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                      <path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span class="number">4.5</span>
                    <span class="sp">•</span>
                    <span class="reviews">${this.number.shorten(1200)}</span>
                  </span>
                </div>
              </div>
            </div>
            <span class="rate">
              <span class="price">
                <span class="currency">Ksh</span>
                <span class="amount">${this.number.withCommas(1500)}</span>
              </span>
              <span class="separator">/</span>
              <span class="duration">20min</span>
            </span>
          </div>

          <div class="specialist">
            <div class="specialist-content">
              <div class="avatar">
                <img src="https://randomuser.me/api/portraits/women/5.jpg" alt="Jane Clinic & Dental Care">
                ${this.checkVerified('false')}
              </div>
              <div class="info">
                <div class="name">
                  <span class="name">Dr. Emily Clark</span>
                  <span class="title">Neurologist</span>
                </div>
                <div class="bottom">
                  <span class="rating">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                      <path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span class="number">4.9</span>
                    <span class="sp">•</span>
                    <span class="reviews">${this.number.shorten(23450)}</span>
                  </span>
                </div>
              </div>
            </div>
            <span class="rate">
              <span class="price">
                <span class="currency">Ksh</span>
                <span class="amount">${this.number.withCommas(7800)}</span>
              </span>
              <span class="separator">/</span>
              <span class="duration">60min</span>
            </span>
          </div>
        </div>
      </div>
    `;
  }

  getSpecialistHead = () => {
    return /* html */`
      <div class="head">
        <h3 class="title">Specialists</h3>
        <div class="icons">
          <span class="icon prev">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="icon next active">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    `;
  }

  checkVerified = verified => {
    if (verified !== 'true' || !verified) return '';
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

  getActiveSvg = () => /* html */`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" role="img" color="currentColor">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22.75C6.06294 22.75 1.25 17.9371 1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75ZM16.48 9.37756C16.9645 9.11257 17.1425 8.50493 16.8775 8.02038C16.6125 7.53582 16.0049 7.35782 15.5204 7.62282C13.6917 8.62286 12.1796 10.5529 11.1629 12.1096C10.7872 12.685 10.4662 13.2297 10.2094 13.6911C9.96984 13.4587 9.73258 13.257 9.52038 13.0892C9.2427 12.8697 8.99282 12.6965 8.81063 12.5772L8.49559 12.3815C8.01585 12.1079 7.40513 12.275 7.13152 12.7548C6.85797 13.2344 7.02493 13.8449 7.50442 14.1187L7.71471 14.2502C7.85752 14.3437 8.05764 14.4823 8.27997 14.6581C8.73753 15.0198 9.23126 15.494 9.54198 16.0135C9.73267 16.3323 10.0844 16.5191 10.4553 16.4987C10.8261 16.4782 11.1551 16.2536 11.3096 15.9159L11.4079 15.7105C11.4756 15.5721 11.577 15.3697 11.709 15.1204C11.9735 14.6207 12.3581 13.9372 12.8374 13.2032C13.8208 11.6975 15.1086 10.1275 16.48 9.37756Z" fill="currentColor"></path>
    </svg>
  `;

  getBookings = () => {
    return /* html */`
      <bookings-feed url="/bookings/example" kind="${this.getAttribute('kind')}" owner="${this.getAttribute('owner')}" name="Jane Clinic & Dental Care"></bookings-feed>
    `
  }

  getStyles() {
    return /* css */`
      <style>
        * {
          box-sizing: border-box !important;
        }

        :host {
          width: 100%;
          display: flex;
          flex-flow: column;
          align-items: flex-start;
          justify-content: start;
          gap: 10px;
          margin: 0;
          padding: 0;
        }

        div.content-container {
          width: 100%;
          display: flex;
          flex-flow: row nowrap;
          gap: 30px;
          margin: 0;
          padding: 0;
        }

        div.content {
          display: flex;
          flex-flow: column;
          align-items: flex-start;
          justify-content: start;
          gap: 10px;
          min-width: 50%;
          max-width: 50%;
          margin: 0;
          padding: 0;
        }

        div.schedule {
          display: flex;
          flex-flow: column;
          align-items: flex-start;
          justify-content: start;
          gap: 10px;
          width: 100%;
          padding: 0;
          min-width: calc(50% - 30px);
          max-width: calc(50% - 30px);
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

        div.specialists-content {
          display: flex;
          flex-flow: column;
          align-items: flex-start;
          justify-content: start;
          gap: 10px;
          padding: 0;
          width: 100%;
          margin: 5px 0 0;
        }

        /* Specialists Content */
        div.specialists-content > .head {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        div.specialists-content > .head > h3.title {
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

        div.specialists-content > .head > div.icons {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        div.specialists-content > .head > div.icons > span.icon {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: var(--border);
          background: var(--gray-background);
          /* border-width: 2px; */
          width: 25px;
          height: 25px;
          border-radius: 50%;
          color: var(--gray-color);
        }

        div.specialists-content > .head > div.icons > span.icon:hover {
          background: var(--gray-background);
        }

        div.specialists-content > .head > div.icons > span.icon.active {
          background: var(--icon-background);
          color: var(--text-color);
          border: var(--icon-border-active);
          /* border-width: 2px; */
        }

        div.specialists-content > .head > div.icons > span.icon.active:hover {
          background: var(--icon-background);
          border: var(--icon-border-active);
          color: var(--accent-color);
          /* border-width: 2px; */
        }

        div.specialists-content > .head > div.icons > span.icon > svg {
          width: 20px;
          height: 20px;
          display: inline-block;
          vertical-align: middle;
        }

        div.specialists-content > .head > div.icons > span.icon.next > svg {
          margin-left: 2px;
        }

        div.specialists-content div.specialists {
          /* Use a horizontal grid with two rows so items lay out in two rows
             while the grid grows horizontally and remains scrollable on the x-axis */
          display: grid;
          grid-auto-flow: column;
          grid-auto-rows: min-content;
          grid-template-rows: repeat(2, minmax(0, auto));
          align-items: start;
          justify-content: start;
          gap: 20px;
          width: 100%;
          max-width: 100%;
          padding: 10px 0;
          margin: 0;

          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;  /* Internet Explorer and Edge */
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;

          /* hide webkit scrollbar */
        }

        div.specialists-content div.specialists::-webkit-scrollbar {
          visibility: hidden;
          display: none;
          width: 0;
        }

        div.specialists > div.specialist {
          display: flex;
          flex-flow: column;
          background: var(--verified-background);
          border-radius: 12px;
          padding: 8px 8px;
          border: var(--border);
          border-width: 2px;
          cursor: pointer;
          min-width: 275px;
          width: 275px;
          gap: 10px;
          margin: 0;
          position: relative;
        }

        div.specialists > div.specialist.selected {
          border: var(--active-border);
          box-shadow: var(--box-shadow);
        }

        div.specialists > div.specialist > div.specialist-content {
          display: flex;
          flex-flow: row nowrap;
          width: 100%;
          gap: 10px;
          margin: 0;
        }

        div.specialist-content > div.avatar {
          display: flex;
          gap: 0;
          align-items: center;
          justify-content: center;
          position: relative;
          height: 70px;
          width: 70px;
          min-height: 70px;
          min-width: 70px;
          border-radius: 50%;
          border: var(--action-border);
          border-width: 2px;
          padding: 4px;
          margin: 0;
        }

        div.specialist-content > div.avatar > img {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          object-fit: cover;
          object-position: center;
        }

        div.specialist-content > div.avatar > span.verified {
          pointer-events: none;
          position: absolute;
          bottom: 0;
          right: -8px;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
        }

        div.specialist-content > div.avatar > span.verified > svg {
          width: 38px;
          height: 38px;
          margin-bottom: -1px;
          display: flex;
          justify-content: center;
          color: var(--verified-background);
          align-items: center;
        }

        div.specialist-content > div.avatar > span.verified > svg > path#top {
          color: var(--verified-background);
          fill: var(--verified-background);
        }

        div.specialist-content > div.info {
          display: flex;
          flex-flow: column;
          align-items: flex-start;
          justify-content: start;
          gap: 5px;
          margin: 0;
          padding: 3px 0 0;
        }

        div.specialist-content > div.info > div.name {
          display: flex;
          flex-flow: column;
          align-items: flex-start;
          justify-content: center;
          gap: 2px;
          margin: 0;
          padding: 0;
        }

        div.specialist-content > div.info > div.name > span.name {
          font-size: 1rem;
          display: inline-block;
          width: 100%;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          margin: 0;
          line-height: 1;

          /* truncate after 0ne line */
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        div.specialist-content > div.info > div.name > span.title {
          font-size: 0.9rem;
          font-weight: 400;
          display: inline-block;
          width: 100%;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          margin: 0;

          /* truncate after 0ne line */
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        div.specialist-content > div.info > div.bottom {
          display: flex;
          flex-flow: column;
          gap: 10px;
          width: 100%;
          margin: 0;
          padding: 0;
        }

        div.specialist-content > div.info > div.bottom > span.rating {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: flex-start;
          gap: 0;
          margin: 0;
          padding: 0;
        }

        div.specialist-content > div.info > div.bottom > span.rating > svg {
          width: 15px;
          height: 15px;
          display: inline-block;
          margin-right: 3px;
          margin-top: -1px;
          vertical-align: middle;
          color: var(--anchor-color);
        }

        div.specialist-content > div.info > div.bottom > span.rating > span.number {
          font-size: 1rem;
          font-weight: 500;
          color: var(--anchor-color);
          font-family: var(--font-read), sans-serif;
          margin: 0;
        }

        div.specialist-content > div.info > div.bottom > span.rating > span.sp {
          font-size: 1.2rem;
          font-weight: 400;
          display: inline-block;
          margin-top: 2px;
          padding: 0 5px;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
        }

        div.specialist-content > div.info > div.bottom > span.rating > span.reviews {
          font-size: 1rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          margin: 0;
        }

        div.specialists > div.specialist > span.rate {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: flex-start;
          gap: 5px;
          margin: 0;
          padding: 0;
        }

        div.specialists > div.specialist > span.rate > span.price {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: flex-start;
          gap: 5px;
          margin: 0;
          padding: 0;
        }

        div.specialists > div.specialist > span.rate > span.price > span.currency {
          color: var(--anchor-color);
          display: inline-block;
          /* margin: -2px 0 0 0; */
          font-size: 1rem;
          font-family: var(--font-read), sans-serif;
          font-weight: 500;
          letter-spacing: 0.2px;
        }

        div.specialists > div.specialist > span.rate > span.price > span.amount {
          color: var(--text-color);
          display: inline-block;
          font-size: 1rem;
          font-family: var(--font-read), sans-serif;
          font-weight: 600;
          letter-spacing: 0.2px;
        }

        div.specialists > div.specialist > span.rate > span.separator {
          color: var(--gray-color);
          display: inline-block;
          font-size: 1rem;
          font-family: var(--font-read), sans-serif;
          margin: 0;
        }

        div.specialists > div.specialist > span.rate > span.duration {
          color: var(--gray-color);
          display: inline-block;
          font-size: 1rem;
          font-family: var(--font-read), sans-serif;
          font-weight: 500;
          letter-spacing: 0.2px;
        }

        /* checkbox for selecting specialist */
        div.specialists > div.specialist > span.checkbox-round {
          position: absolute;
          right: -8px;
          top: -7px;
          color: var(--background);
          z-index: 1;
          background: var(--white-color);
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        div.specialists > div.specialist > span.checkbox-round > svg {
          width: 20px;
          height: 20px;
          color: var(--accent-color);
          display: inline-block;
          vertical-align: middle;
        }

        /* Charges and disclaimer */
        div.charges {
          border-top: var(--border);
          display: flex;
          flex-flow: column;
          align-items: flex-start;
          justify-content: start;
          width: 100%;
          padding: 5px 0;
          margin: 0;
        }

        div.charges > p.note {
          font-family: var(--font-read), sans-serif;
          color: var(--gray-color);
          font-size: 0.85rem;
          font-weight: 400;
          line-height: 1.4;
          margin: 0;
          padding: 0;
        }

        div.charges > p.note > a {
          color: var(--anchor-color);
          text-decoration: none;
        }

        div.charges > p.note > a:hover {
          text-decoration: underline;
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