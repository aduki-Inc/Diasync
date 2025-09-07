export default class Week extends HTMLElement {
  constructor() {
    super();
    this.app = window.app;
    this.shadowObj = this.attachShadow({ mode: 'open' });
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.weekOffset = 0; // number of weeks to shift (0 = current week)
    this.selectedDate = null;
    // map of iso-date => { period, time }
    this.selectionMap = {};
    // hardcoded time slots per period (will be fetched from backend later)
    this.periodSlots = {
      morning: ['8:00 AM', '9:00 AM', '10:30 AM', '11:30 AM'],
      afternoon: ['1:00 PM', '2:00 PM', '3:00 PM', '4:30 PM'],
      evening: ['5:00 PM', '6:00 PM', '7:30 PM'],
      night: ['9:00 PM', '10:30 PM', '11:30 PM', '12:30 AM']
    };
    this.activePeriod = 'afternoon';
    // default selected time (string)
    this.selectedTime = this.periodSlots[this.activePeriod][1] || this.periodSlots[this.activePeriod][0];
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // initialize listeners for prev/next and other interactions
    this.addDatesListeners();
    this.addInteractionListeners();
    // run default selection once on initial mount
    this.setDefaultSelection();
    this._initialSelectionDone = true;
  }


  addDatesListeners = () => {
    // attach prev/next handlers once, then toggle prev availability via CSS
    try {
      const prev = this.shadowObj.querySelector('.months .nav.prev');
      const next = this.shadowObj.querySelector('.months .nav.next');
      if (!prev || !next) return;

      // attach handlers only once
      if (!this._datesListenersAttached) {
        this._datesListenersAttached = true;
        this._prevHandler = () => this.prevWeek();
        this._nextHandler = () => this.nextWeek();
        prev.addEventListener('click', this._prevHandler);
        next.addEventListener('click', this._nextHandler);
      }

      // disable prev nav when at or before the current week
      if (this.weekOffset <= 0) {
        prev.style.pointerEvents = 'none';
        prev.style.opacity = '0.6';
      } else {
        prev.style.pointerEvents = 'auto';
        prev.style.opacity = '';
      }
    } catch (e) {
      console.warn('Error adding date listeners', e);
    }
  }

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `
  }

  getBody = () => {
    return /* html */`
      <section class="container">
        ${this.getDates()}
        ${this.getTimes()}
        ${this.getBookingActions()}
      </section>
    `
  }

  getTimes() {
    return /* html */`
      <div class="times">
        <div class="head">
          <h3 class="title">Choose Time</h3>
        </div>
        <div class="schedules">
          ${this.getPeriodes()}
          ${this.getPeriodTimes()}
        </div>
      </div>
    `
  }

  getPeriodes = () => {
    return /* html */`
      <ul class="periods">
        <li class="period morning ${this.activePeriod === 'morning' ? 'selected' : ''}">Morning</li>
        <li class="period afternoon ${this.activePeriod === 'afternoon' ? 'selected' : ''}">Afternoon</li>
        <li class="period evening ${this.activePeriod === 'evening' ? 'selected' : ''}">Evening</li>
        <li class="period night ${this.activePeriod === 'night' ? 'selected' : ''}">Night</li>
      </ul>
    `
  }

  getPeriodTimes = () => {
    const times = this.periodSlots[this.activePeriod] || [];
    return /* html */`
      <ul class="period-times">
        ${times.map(t => {
      const isSelected = (t === this.selectedTime) ? 'selected' : '';
      const checkbox = isSelected ? `<span class="checkbox-round">${this.checkboxSvg()}</span>` : '';
      return `<li class="time ${isSelected}">${t}${checkbox}</li>`;
    }).join('')}
      </ul>
    `
  }

  getDates() {
    const base = new Date(Date.now());
    base.setHours(0, 0, 0, 0);
    // apply week offset
    const baseShifted = new Date(base);
    baseShifted.setDate(baseShifted.getDate() + (this.weekOffset * 7));
    const day = baseShifted.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayHeaders = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const weekDates = this.getWeekDates(baseShifted);
    const monthText = this.getMonthText(weekDates);

    return /* html */`
      <div class="dates">
        <div class="head">
          <h3 class="title">Select Date</h3>
          <div class="months">
            <span class="nav prev">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" stroke-width="2.0" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
            <span class="selected">${monthText}</span>
            <span class="nav next active">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
        </div>
        <div class="week">
          ${this.getDays({ weekDates, dayHeaders })}
        </div>
      </div>
    `
  }

  // returns array of Date objects for the current week (Sun..Sat) adjusted by weekOffset
  getWeekDates = (baseDate) => {
    const dates = [];
    const base = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
    const baseDayIndex = base.getDay();
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + (i - baseDayIndex));
      dates.push(d);
    }
    return dates;
  }

  getDays = data => {
    const outerThis = this;
    return /* html */`
      <ul class="days">
        ${data.dayHeaders.map((value, index) => {
      const dateObj = data.weekDates[index];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isToday = dateObj.getTime() === today.getTime();
      const isSelctable = dateObj.getTime() >= today.getTime();
      return outerThis.getDay(value, dateObj, isToday, isSelctable)
    }).join('')}
		</ul>
    `;
  }

  getDay = (day, date, isToday, isSelctable) => {
    const unSelectable = isSelctable === false ? 'unselctable' : '';
    const todayClass = isToday === true ? 'today' : '';
    const iso = date.toISOString().slice(0, 10);
    return /* html */`
      <li class="day ${day} ${unSelectable} ${todayClass}" data-date="${iso}">
        <span class="head">${day?.toUpperCase()}</span>
        <span class="date">${date.getDate()}</span>
            </li>
    `;
  }

  // format month text: if all dates same month -> 'Month', else 'Mon/Mon'
  getMonthText = (dates) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (!dates || dates.length === 0) return '';
    const firstMonth = dates[0].getMonth();
    const lastMonth = dates[dates.length - 1].getMonth();
    const monthFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (firstMonth === lastMonth) return monthFull[firstMonth];
    return `${monthShort[firstMonth]}/${monthShort[lastMonth]}`;
  }

  // update rendered dates (re-render and reattach listeners)
  updateDates = () => {
    // avoid full re-render: update month label and ensure listeners exist
    try {
      const base = new Date(Date.now());
      base.setHours(0, 0, 0, 0);
      const baseShifted = new Date(base);
      baseShifted.setDate(baseShifted.getDate() + (this.weekOffset * 7));
      const weekDates = this.getWeekDates(baseShifted);
      const monthText = this.getMonthText(weekDates);
      const monthEl = this.shadowObj.querySelector('.months .selected');
      if (monthEl) monthEl.textContent = monthText;

      // Ensure prev/next listeners are attached and prev nav styled correctly
      this.addDatesListeners();
      // reattach day/period/time listeners (these should be idempotent)
      this.addInteractionListeners();
      // ensure a selected day exists
      this.setDefaultSelection();
    } catch (e) {
      console.warn('Error updating dates', e);
      // fallback to full re-render
      this.render();
      this.addDatesListeners();
      this.addInteractionListeners();
      this.setDefaultSelection();
    }
  }

  // update only the dates DOM (no full render) — updates month label and the 7 day <li>
  handleDateChange = () => {
    try {
      const base = new Date(Date.now());
      base.setHours(0, 0, 0, 0);
      const baseShifted = new Date(base);
      baseShifted.setDate(baseShifted.getDate() + (this.weekOffset * 7));
      const weekDates = this.getWeekDates(baseShifted);
      const monthText = this.getMonthText(weekDates);

      const monthEl = this.shadowObj.querySelector('.months .selected');
      if (monthEl) monthEl.textContent = monthText;

      const dayEls = Array.from(this.shadowObj.querySelectorAll('.days .day'));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dayHeaders = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

      // preserve selection if same date exists in new week
      const prevSelected = this.shadowObj.querySelector('.days .day.selected');
      const prevSelectedDate = prevSelected?.dataset?.date;
      let foundSelected = false;

      for (let i = 0; i < 7; i++) {
        const d = weekDates[i];
        const el = dayEls[i];
        if (!el) continue;
        // update dataset for quick comparisons (YYYY-MM-DD)
        const iso = d.toISOString().slice(0, 10);
        el.dataset.date = iso;

        // update head and date text
        const head = el.querySelector('.head');
        const dateSpan = el.querySelector('.date');
        if (head) head.textContent = dayHeaders[i].toUpperCase();
        if (dateSpan) dateSpan.textContent = d.getDate();

        // today class
        if (d.getTime() === today.getTime()) {
          el.classList.add('today');
        } else {
          el.classList.remove('today');
        }

        // selectable: only allow dates >= today
        if (d.getTime() < today.getTime()) {
          el.classList.add('unselctable');
        } else {
          el.classList.remove('unselctable');
        }

        // keep selection if same iso date
        if (prevSelectedDate && prevSelectedDate === iso) {
          el.classList.add('selected');
          foundSelected = true;
        } else {
          // if it was previously selected but not matching, remove
          if (el.classList.contains('selected') && prevSelectedDate !== iso) el.classList.remove('selected');
        }
      }

      // update nav/button listeners state
      this.addDatesListeners();

      // if no selected day remains, do NOT auto-select on week switches
      // only run default selection when component first mounts
      if (!foundSelected && !this._initialSelectionDone) this.setDefaultSelection();
    } catch (e) {
      console.warn('Error handling date change', e);
      // fallback to full render
      this.updateDates();
    }
  }

  // choose default day on render: prefer today (if present), else first selectable day
  setDefaultSelection = () => {
    try {
      const root = this.shadowObj;
      if (!root) return;
      const todayEl = root.querySelector('.days .day.today');
      let target = null;
      if (todayEl && !todayEl.classList.contains('unselctable')) target = todayEl;
      if (!target) target = root.querySelector('.days .day:not(.unselctable)');
      if (target) this.onDayClick(target);
    } catch (e) {
      console.warn('Error setting default selection', e);
    }
  }

  // small SVG used for the checkbox-round
  checkboxSvg = () => /* html */`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" role="img" color="currentColor">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22.75C6.06294 22.75 1.25 17.9371 1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75ZM16.48 9.37756C16.9645 9.11257 17.1425 8.50493 16.8775 8.02038C16.6125 7.53582 16.0049 7.35782 15.5204 7.62282C13.6917 8.62286 12.1796 10.5529 11.1629 12.1096C10.7872 12.685 10.4662 13.2297 10.2094 13.6911C9.96984 13.4587 9.73258 13.257 9.52038 13.0892C9.2427 12.8697 8.99282 12.6965 8.81063 12.5772L8.49559 12.3815C8.01585 12.1079 7.40513 12.275 7.13152 12.7548C6.85797 13.2344 7.02493 13.8449 7.50442 14.1187L7.71471 14.2502C7.85752 14.3437 8.05764 14.4823 8.27997 14.6581C8.73753 15.0198 9.23126 15.494 9.54198 16.0135C9.73267 16.3323 10.0844 16.5191 10.4553 16.4987C10.8261 16.4782 11.1551 16.2536 11.3096 15.9159L11.4079 15.7105C11.4756 15.5721 11.577 15.3697 11.709 15.1204C11.9735 14.6207 12.3581 13.9372 12.8374 13.2032C13.8208 11.6975 15.1086 10.1275 16.48 9.37756Z" fill="currentColor"></path>
    </svg>
  `;

  // attach listeners for days, periods and times
  addInteractionListeners = () => {
    try {
      const days = this.shadowObj.querySelectorAll('.days .day');
      days.forEach(d => {
        d.removeEventListener('click', d._dayHandler);
        d._dayHandler = (e) => this.onDayClick(e.currentTarget);
        d.addEventListener('click', d._dayHandler);
      });

      const periods = this.shadowObj.querySelectorAll('.periods .period');
      periods.forEach(p => {
        p.removeEventListener('click', p._periodHandler);
        p._periodHandler = (e) => this.activatePeriod(e.currentTarget);
        p.addEventListener('click', p._periodHandler);
      });

      const times = this.shadowObj.querySelectorAll('.period-times .time');
      times.forEach(t => {
        t.removeEventListener('click', t._timeHandler);
        t._timeHandler = (e) => this.activateTime(e.currentTarget);
        t.addEventListener('click', t._timeHandler);
      });
    } catch (e) {
      console.warn('Error adding interaction listeners', e);
    }
  }

  onDayClick = (el) => {
    if (!el || el.classList.contains('unselctable')) return;
    const prev = this.shadowObj.querySelector('.days .day.selected');
    if (prev) prev.classList.remove('selected');
    el.classList.add('selected');

    // set selectedDate from element dataset
    const iso = el.dataset?.date;
    if (iso) this.selectedDate = iso;

    const isToday = el.classList.contains('today');
    // if there's a saved selection for this date, restore its period; otherwise pick default
    const saved = iso ? this.selectionMap[iso] : null;
    const periodName = saved?.period || (isToday ? this.getCurrentPeriod() : (this.shadowObj.querySelector('.periods .period.selected')?.classList.value.split(' ').find(c => ['morning', 'afternoon', 'evening', 'night'].includes(c)) || 'afternoon'));
    this.activatePeriodByName(periodName);
  }

  getCurrentPeriod = () => {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 16) return 'afternoon';
    if (h < 20) return 'evening';
    return 'night';
  }

  activatePeriodByName = (name) => {
    const el = this.shadowObj.querySelector(`.periods .period.${name}`);
    if (el) this.activatePeriod(el);
  }

  activatePeriod = (el) => {
    if (!el) return;
    // update active period state and UI
    const prev = this.shadowObj.querySelector('.periods .period.selected');
    if (prev) prev.classList.remove('selected');
    el.classList.add('selected');
    const cls = Array.from(el.classList).find(c => ['morning', 'afternoon', 'evening', 'night'].includes(c));
    this.activePeriod = cls || 'afternoon';

    // re-render times for the new period (keeps DOM refresh minimal)
    this.renderTimes();

    // if there's a saved selection for this date & period, restore it
    const iso = this.selectedDate;
    const saved = iso ? this.selectionMap[iso] : null;
    if (saved && saved.period === this.activePeriod) {
      const times = this.shadowObj.querySelectorAll('.period-times .time');
      const match = Array.from(times).find(tt => tt.textContent.trim() === saved.time);
      if (match) return this.activateTime(match);
    }

    // otherwise select a sensible default index for the period
    const map = { morning: 0, afternoon: 1, evening: 1, night: 0 };
    const idx = map[this.activePeriod] ?? 0;
    const times = this.shadowObj.querySelectorAll('.period-times .time');
    const t = times[idx] || times[0];
    if (t) this.activateTime(t);
  }

  // rebuild the .period-times list from this.periodSlots and current selectedTime
  renderTimes = () => {
    const container = this.shadowObj.querySelector('.period-times');
    if (!container) return;
    const times = this.periodSlots[this.activePeriod] || [];
    // determine if the current selected date has a saved selection for this period
    const saved = this.selectedDate ? this.selectionMap[this.selectedDate] : null;
    const selectedForThisPeriod = (saved && saved.period === this.activePeriod) ? saved.time : null;

    container.innerHTML = times.map(t => {
      const isSelected = (t === selectedForThisPeriod) ? 'selected' : '';
      const checkbox = isSelected ? `<span class="checkbox-round">${this.checkboxSvg()}</span>` : '';
      return `<li class="time ${isSelected}">${t}${checkbox}</li>`;
    }).join('');
    // reattach time click handlers for the new items
    const newTimes = container.querySelectorAll('.time');
    newTimes.forEach(nt => {
      nt.removeEventListener('click', nt._timeHandler);
      nt._timeHandler = (e) => this.activateTime(e.currentTarget);
      nt.addEventListener('click', nt._timeHandler);
    });
  }

  activateTime = (el) => {
    if (!el || el.classList.contains('unselctable')) return;
    const prev = this.shadowObj.querySelector('.period-times .time.selected');
    if (prev) {
      prev.classList.remove('selected');
      const cb = prev.querySelector('.checkbox-round');
      if (cb) cb.remove();
    }
    el.classList.add('selected');
    // capture selectedTime string
    const timeStr = el.textContent.trim();
    this.selectedTime = timeStr;
    // persist selection per-date
    if (this.selectedDate) {
      this.selectionMap[this.selectedDate] = { period: this.activePeriod, time: timeStr };
    }
    const span = document.createElement('span');
    span.className = 'checkbox-round';
    span.innerHTML = this.checkboxSvg();
    el.appendChild(span);
  }

  nextWeek = () => {
    this.weekOffset += 1;
    // update only date DOM
    this.handleDateChange();
    // keep times/periods intact but re-evaluate default selection
    this.addInteractionListeners();
  }

  prevWeek = () => {
    // Do not allow navigating to weeks earlier than the current week (weekOffset 0)
    if (this.weekOffset <= 0) return;
    this.weekOffset -= 1;
    this.handleDateChange();
    this.addInteractionListeners();
  }

  getBookingActions = () => {
    return /* html */`
      <div class="actions">
        <button type="button" class="action cancel">Cancel</button>
        <button type="button" class="action text">Message</button>
        <button type="submit" class="action book disabled">Confirm</button>
      </div>
    `
  }

  getStyles() {
    return /* css */`
      <style>
        * {
          box-sizing: border-box !important;
          /* disable user select */
          user-select: none;
          /* disable text selection */
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -o-user-select: none;
          -khtml-user-select: none;
        }

        :host {
          width: 100%;
          gap: 0;
          padding: 0;
          margin: 0;
        }

        section.container {
          display: flex;
          flex-flow: column;
          align-items: start;
          justify-content: space-between;
          gap: 25px;
          padding: 0;
          width: 100%;
        }

        div.dates {
          display: flex;
          flex-flow: column;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          padding: 0;
          width: 100%;
        }

        div.dates > .head {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        div.dates > .head > h3.title {
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

        div.head > div.months {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 0;
        }

        div.head > div.months > span.selected {
          display: flex;
          align-items: center;
          font-family: var(--font-main), sans-serif;
          color: var(--gray-color);
          font-size: 1rem;
          font-weight: 500;
          line-height: 1;
          margin: 0;
          padding: 0;
        }

        div.head > div.months > span.nav {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: var(--border);
          border-width: 2px;
          width: 25px;
          height: 25px;
          opacity: 0.8;
          border-radius: 50%;
          background: var(--gray-background);
          color: var(--gray-color);
        }

        div.head > div.months > span.nav:hover {
          background: var(--gray-background);
        }

        div.head > div.months > span.nav.active {
          opacity: 1;
          background: var(--icon-background);
          color: var(--text-color);
        }

        div.head > div.months > span.nav.active:hover {
          background: var(--icon-background);
          border: var(--icon-border-active);
          color: var(--accent-color);
        }

        div.head > div.months > span.nav > svg {
          width: 20px;
          height: 20px;
          margin-top: 1px;
          display: inline-block;
          vertical-align: middle;
        }

        div.head > div.months > span.nav.next > svg {
          margin-left: 2px;
        }

        div.head > div.months > span.nav.prev > svg {
          margin-right: 1px;
        }

        div.week {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        div.week > ul.days {
          display: flex;
          list-style-type: none;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 0;
          margin: 0;
          width: 100%;
        }

        div.week > ul.days > li.day {
          background: var(--gray-background);
          display: flex;
          list-style-type: none;
          flex-flow: column;
          align-items: center;
          justify-items: center;
          cursor: pointer;
          border: var(--border);
          border-width: 2px;
          color: var(--text-color);
          font-weight: 600;
          gap: 15px;
          width: 65px;
          border-radius: 12px;
          padding: 8px 12px;
          margin: 0;
        }

        div.week > ul.days > li.day > span.head {
          font-family: var(--font-read), sans-serif;
        }

        div.week > ul.days > li.day > span.date {
          font-family: var(--font-main), sans-serif;
          font-size: 1.25rem;
        }

        div.week > ul.days > li.day.unselctable,
        div.week > ul.days > li.day.unselctable.selected {
          box-shadow: none;
          background: var(--unselctable-background);
          color: var(--unselctable-color);
          pointer-events: none;
          opacity: .7;
          cursor: not-allowed;
        }

        div.week > ul.days > li.day.today,
        div.week > ul.days > li.day.today:hover,
        div.week > ul.days > li.day.today.selected {
          transform: unset;
          border: var(--active-border);
          border: var(--selected-border);
          background: linear-gradient(135deg, var(--stat-background), rgba(0, 96, 223, 0.05));
        }

        div.week > ul.days > li.day:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, var(--stat-background), rgba(0, 96, 223, 0.05));
          border: var(--selected-border);
        }

        div.week > ul.days > li.day.selected {
          transform: translateY(-2px);
          /* background: linear-gradient(135deg, var(--stat-background), rgba(0, 96, 223, 0.05));
          border: var(--selected-border);
          box-shadow: 0 8px 25px #10b98140; */
          border: var(--active-border);
          background: linear-gradient(135deg, var(--stat-background), rgba(0, 96, 223, 0.05));
          box-shadow: 0 8px 25px rgba(0, 96, 223, 0.25);
        }

        div.times {
          border-top: var(--border);
          display: flex;
          flex-flow: column;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          padding: 15px 0 0;
          width: 100%;
        }

        div.times > .head {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        div.times > .head > h3.title {
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

        div.times > div.schedules {
          display: flex;
          flex-flow: column;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 0;
        }

        div.times > div.schedules > ul.periods {
          display: flex;
          list-style-type: none;
          flex-flow: row nowrap;
          align-items: center;
          gap: 15px;
          width: 100%;
          padding: 0;
          margin: 0;
        }

        div.times > div.schedules > ul.periods > li.period {
          background: var(--gray-background);
          display: flex;
          list-style-type: none;
          flex-flow: column;
          align-items: center;
          justify-items: center;
          position: relative;
          background: var(--gray-background);
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 400;
          cursor: pointer;
          gap: 5px;
          text-transform: capitalize;
          justify-content: center;
          padding: 7px 15px;
          width: max-content;
          border-radius: 12px;
        }

        div.times > div.schedules > ul.periods > li.period.selected {
          background: var(--accent-linear);
          color: var(--white-color);
        }

        div.times > div.schedules > ul.period-times {
          border-top: var(--border);
          border-top-style: dashed;
          display: flex;
          width: 100%;
          list-style-type: none;
          flex-flow: row nowrap;
          align-items: center;
          gap: 15px;
          padding: 15px 0 0;
          margin: 0;
        }

        div.times > div.schedules > ul.period-times > li.time {
          display: flex;
          list-style-type: none;
          flex-flow: column;
          align-items: center;
          justify-items: center;
          position: relative;
          background: var(--gray-background);
          color: var(--gray-color);
          border: var(--border);
          border-width: 2px;
          font-family: var(--font-read), sans-serif;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          gap: 5px;
          text-transform: capitalize;
          justify-content: center;
          padding: 5px 15px;
          width: max-content;
          border-radius: 11px;
        }

        div.times > div.schedules > ul.period-times > li.time.unselctable,
        div.times > div.schedules > ul.period-times > li.time.unselctable.selected {
          box-shadow: none;
          background: var(--unselctable-background);
          color: var(--unselctable-color);
          pointer-events: none;
          opacity: .7;
          cursor: not-allowed;
        }

        div.times > div.schedules > ul.period-times > li.time:hover {
          /* transform: translateY(-2px); */
          background: linear-gradient(135deg, var(--stat-background), rgba(0, 96, 223, 0.05));
          border: var(--selected-border);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.25);
        }

        div.times > div.schedules > ul.period-times > li.time.selected {
          transform: unset;
          position: relative;
          color: var(--accent-color);
          font-weight: 600;
          border: var(--active-border);
          box-shadow: 0 8px 25px rgba(0, 96, 223, 0.25);
          background: var(--today-background);
        }

        span.checkbox-round {
          position: absolute;
          right: -8px;
          top: -5px;
          color: var(--background);
          z-index: 1;
          background: var(--white-color);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        span.checkbox-round > svg {
          width: 18px;
          height: 18px;
          color: var(--accent-color);
          display: inline-block;
          vertical-align: middle;
        }

        div.actions {
          display: flex;
          flex-flow: row;
          padding: 10px 0;
          gap: 10px;
          width: 100%;
          justify-content: space-between;
          align-items: center;
        }

        div.actions > button.action {
          width: calc(50% - 10px);
          padding: 12px 0;
          border: none;
          outline: none;
          cursor: pointer;
          background: var(--gray-background);
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-text), sans-serif;
          border-radius: 15px;
        }

        div.actions > button.action.book {
          background: var(--accent-linear);
          color: var(--white-color);
        }

        div.actions > button.action.cancel {
          background: var(--background);
          color: var(--warn-color);
          border: var(--cancelled-border);
          padding: 10px 0;
          border-width: 2px;
        }

        div.actions > button.action.buy.disabled {
          background: var(--gray-background);
          color: var(--gray-color);
          border: none;
          opacity: 0.8;
          pointer-events: none;
        }
        
        @media (max-width: 700px) {
          :host {
            border: var(--border);
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
            gap: 0;
            padding: 0;
            width: 180px;
            min-width: 180px;
            border-radius: 8px;
          }

          /* reset all cursor: pointer to default */
          a,
          .details div.name span.name,
          .buttons > .button,
          .buttons > .button.add,
          .buttons > .button.view,
          .buttons > .button.wish,
          .buttons > .button.added,
          .store-name {
            cursor: default !important;
          }
        }
      </style>
    `
  }
}