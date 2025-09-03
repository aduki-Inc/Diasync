export default class Account extends HTMLElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.mql = window.matchMedia("(max-width: 700px)");
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.sting = this.app?.utils?.string;
    this.data = this.initStats();
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  initStats = () => {
    const last = {
      deposited: this.number.parse(this.getAttribute("last-deposited")),
      spent: this.number.parse(this.getAttribute("last-spent")),
      earned: this.number.parse(this.getAttribute("last-earned"))
    };

    const current = {
      deposited: this.number.parse(this.getAttribute("current-deposited")),
      spent: this.number.parse(this.getAttribute("current-spent")),
      earned: this.number.parse(this.getAttribute("current-earned"))
    }

    const outDays = [
      {
        mon: {
          out: this.number.parse(this.getAttribute("out-mon")),
          in: this.number.parse(this.getAttribute("in-mon"))
        }
      },
      {
        tue: {
          out: this.number.parse(this.getAttribute("out-tue")),
          in: this.number.parse(this.getAttribute("in-tue"))
        }
      },
      {
        wed: {
          out: this.number.parse(this.getAttribute("out-wed")),
          in: this.number.parse(this.getAttribute("in-wed"))
        }
      },
      {
        thu: {
          out: this.number.parse(this.getAttribute("out-thu")),
          in: this.number.parse(this.getAttribute("in-thu"))
        }
      },
      {
        fri: {
          out: this.number.parse(this.getAttribute("out-fri")),
          in: this.number.parse(this.getAttribute("in-fri"))
        }
      },
      {
        sat: {
          out: this.number.parse(this.getAttribute("out-sat")),
          in: this.number.parse(this.getAttribute("in-sat"))
        }
      },
      {
        sun: {
          out: this.number.parse(this.getAttribute("out-sun")),
          in: this.number.parse(this.getAttribute("in-sun"))
        }
      }
    ];


    // Find the highest value
    let highest = 0;
    outDays.forEach(day => {
      let dayName = Object.keys(day)[0];
      let out = day[dayName].out;
      let inValue = day[dayName].in;
      if (out > highest) highest = out;
      if (inValue > highest) highest = inValue;
    })

    // Find the highest value
    let limit = this.calculateLimit(highest);

    const daysOutWithPercentages = this.processDaysData(outDays, limit);

    // return the stats
    return {
      last,
      current,
      deposited: this.calculatePercentage(current.deposited, last.deposited),
      spent: this.calculatePercentage(current.spent, last.spent),
      earned: this.calculatePercentage(current.earned, last.earned),
      days: daysOutWithPercentages,
      limit
    }
  }

  processDaysData = (days, limit) => {
    // Step 3: Calculate percentages and construct the result
    let daysWithPercentages = days.map(day => {
      let dayName = Object.keys(day)[0];
      let inValue = day[dayName].in;
      let outValue = day[dayName].out;

      return {
        [dayName]: {
          in: inValue,
          out: outValue,
          inPercentage: this.percentage(limit, inValue),
          outPercentage: this.percentage(limit, outValue)
        }
      };
    });

    return daysWithPercentages;
  }

  calculateLimit = highestValue => {
    // Round the highest value to the nearest 50, but make sure to cap it at the next multiple of 50
    let limit = Math.ceil(highestValue / 100) * 100;
    return limit;
  }

  percentage = (total, current) => {
  const percent = (current / total) * 100;

  // if % is NaN, return 0
  if (isNaN(percent)) return 0;

  // Format percentage based on value
  const decimalPlaces = percent < 10 ? 2 : percent < 100 ? 1 : 0;
  return parseFloat(percent.toFixed(decimalPlaces));
}

  calculatePercentage = (current, last) => {
    const diff = current - last;
    let percentage = (diff / last) * 100;

    // if % is NaN, return 0
    if (isNaN(percentage)) percentage = 0;

    // Format percentage based on value
    const decimalPlaces = percentage < 10 ? 2 : percentage < 100 ? 1 : 0;
    percentage = parseFloat(percentage.toFixed(decimalPlaces));

    // in one line: 
    return {
      percentage: Math.abs(percentage),
      diff: Math.abs(diff).toFixed(2),
      rise: diff > 0
    }
  }

  connectedCallback() {
    const balance = this.shadowObj.querySelector("div.balance");
    this.activateHideShow(balance);
    this.setHeader(this.mql);
  }

  setHeader = mql => {
    if (mql.matches) {
      this.app.setHeader({
        sectionTitle: 'Wallet',
        description: 'Your wallet account',
      });
    }
  }

  activateHideShow = balance => {
    // select the hide/show button
    const hideShow = balance.querySelector(".right .view-hide");
    const svg = hideShow.querySelector("svg");

    // select balance  amount
    const amount = balance.querySelector(".left .amount");

    // add event listener to hide/show button
    hideShow.addEventListener("click", () => {
      // toggle the hide blur
      amount.classList.toggle("blur");

      // toggle text
      hideShow.querySelector(".text").textContent = amount.classList.contains("blur") ? "Show" : "Hide";

      // toggle icon
      svg.innerHTML = amount.classList.contains("blur") ? this.getViewIcon() : this.getHideIcon();
    });
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    const mql = window.matchMedia("(max-width: 660px)");
    return /* html */`
      ${this.getAccount()}
      ${this.getActions(mql)}
      ${this.getStats(this.data)}
      ${this.getHistory()}
    `;
  }

  getHead = () => {
    const greeting = this.date.getGreeting();
    return /* html */`
      <div class="header">
        <div class="user">
          <span class="greeting">${greeting},</span>
          <h3 class="name">${this.string.capitalize(this.getAttribute("user-name"))}</h3>
        </div>
      </div>
    `;
  }

  getAccount = () => {
    return /* html */`
      <div class="balance">
        <div class="left">
          <span class="text">You have</span>
          <div class="amount">
            <span class="currency">Ksh</span>
            <span class="number">${this.number.balanceWithCommas(this.getAttribute("balance"))}</span>
          </div>
        </div>
        <div class="right">
          <span class="view-hide">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              ${this.getHideIcon()}
            </svg>
            <span class="text">Hide</span>
          </span>
        </div>
      </div>
    `;
  }

  getInfo = () => {
    const account = this.getAttribute("account");
    // Using regex to replace all characters with X except the first three and last three
    const hidden = account.replace(/(?<=.{3}).(?=.*.{3}$)/g, "*");
    return /* html */`
      <div class="account">
        <span class="info">
          <span class="text">Account</span>
          <span class="number">${hidden}</span>
        </span>
        <span class="line"></span>
        <span class="info status ${this.getAttribute("status")}">
          <span class="text">Status</span>
          <span class="status">${this.getAttribute("status")}</span>
        </span>
        <span class="line"></span>
        <span class="since">
          <span class="text">Opened On</span>
          <span class="date">${this.date.formatDateTime(this.getAttribute("since"))}</span>
        </span>
      </div>
    `;
  }

  getViewIcon = () => {
    return /* html */`
      <path d="M21.544 11.045C21.848 11.4713 22 11.6845 22 12C22 12.3155 21.848 12.5287 21.544 12.955C20.1779 14.8706 16.6892 19 12 19C7.31078 19 3.8221 14.8706 2.45604 12.955C2.15201 12.5287 2 12.3155 2 12C2 11.6845 2.15201 11.4713 2.45604 11.045C3.8221 9.12944 7.31078 5 12 5C16.6892 5 20.1779 9.12944 21.544 11.045Z" stroke="currentColor" stroke-width="1.8" />
      <path d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z" stroke="currentColor" stroke-width="1.8" />
    `;
  }

  getHideIcon = () => {
    return /* html */`
      <path d="M19.439 15.439C20.3636 14.5212 21.0775 13.6091 21.544 12.955C21.848 12.5287 22 12.3155 22 12C22 11.6845 21.848 11.4713 21.544 11.045C20.1779 9.12944 16.6892 5 12 5C11.0922 5 10.2294 5.15476 9.41827 5.41827M6.74742 6.74742C4.73118 8.1072 3.24215 9.94266 2.45604 11.045C2.15201 11.4713 2 11.6845 2 12C2 12.3155 2.15201 12.5287 2.45604 12.955C3.8221 14.8706 7.31078 19 12 19C13.9908 19 15.7651 18.2557 17.2526 17.2526" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M9.85786 10C9.32783 10.53 9 11.2623 9 12.0711C9 13.6887 10.3113 15 11.9289 15C12.7377 15 13.47 14.6722 14 14.1421" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <path d="M3 3L21 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    `;
  }

  getAccountIcon = () => {
    return /* html */`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="var(--background)">
        <path d="M21.9999 12C21.9999 17.5228 17.5228 22 11.9999 22C6.47709 22 1.99994 17.5228 1.99994 12C1.99994 6.47715 6.47709 2 11.9999 2C17.5228 2 21.9999 6.47715 21.9999 12Z" stroke="var(--background)" stroke-width="2" stroke-linejoin="round" />
        <path d="M14.9999 9L7.99994 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        <path d="M9.99994 8.11274C9.99994 8.11274 14.8287 7.70569 15.5615 8.43847C16.2943 9.17125 15.8872 14 15.8872 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  }

  getActions = () => {
    return /* html */`
      <div class="section actions">
        <ul class="quick-actions">
          <li class="action deposit">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M3.09477 10.0002C3.03217 10.4572 2.99976 10.9247 2.99976 11.4002C2.99976 16.7021 7.02919 21.0002 11.9998 21.0002C16.9703 21.0002 20.9998 16.7021 20.9998 11.4002C20.9998 10.9247 20.9673 10.4572 20.9047 10.0002" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M11.9998 13.0002L11.9998 3.0002M11.9998 13.0002C11.2995 13.0002 9.99129 11.0059 9.49976 10.5002M11.9998 13.0002C12.7 13.0002 14.0082 11.0059 14.4998 10.5002" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span class="text">Deposit</span>
          </li>
          <li class="action withdraw">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M3.09502 10C3.03242 10.457 3 10.9245 3 11.4C3 16.7019 7.02944 21 12 21C16.9706 21 21 16.7019 21 11.4C21 10.9245 20.9676 10.457 20.905 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M12 3L12 13M12 3C11.2998 3 9.99153 4.9943 9.5 5.5M12 3C12.7002 3 14.0085 4.9943 14.5 5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span class="text">Withdraw</span>
          </li>
          <li class="action send">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                <path d="M11.922 4.79004C16.6963 3.16245 19.0834 2.34866 20.3674 3.63261C21.6513 4.91656 20.8375 7.30371 19.21 12.078L18.1016 15.3292C16.8517 18.9958 16.2267 20.8291 15.1964 20.9808C14.9195 21.0216 14.6328 20.9971 14.3587 20.9091C13.3395 20.5819 12.8007 18.6489 11.7231 14.783C11.4841 13.9255 11.3646 13.4967 11.0924 13.1692C11.0134 13.0742 10.9258 12.9866 10.8308 12.9076C10.5033 12.6354 10.0745 12.5159 9.21705 12.2769C5.35111 11.1993 3.41814 10.6605 3.0909 9.64127C3.00292 9.36724 2.97837 9.08053 3.01916 8.80355C3.17088 7.77332 5.00419 7.14834 8.6708 5.89838L11.922 4.79004Z" stroke="currentColor" stroke-width="2" />
              </svg>
            </span>
            <span class="text">Send</span>
          </li>
          <li class="action manage" action="manage">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" currentcolor="" fill="none">
                <path d="M3.3457 16.1976L16.1747 3.36866M18.6316 11.0556L16.4321 13.2551M14.5549 15.1099L13.5762 16.0886" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                <path d="M3.17467 16.1411C1.60844 14.5749 1.60844 12.0355 3.17467 10.4693L10.4693 3.17467C12.0355 1.60844 14.5749 1.60844 16.1411 3.17467L20.8253 7.85891C22.3916 9.42514 22.3916 11.9645 20.8253 13.5307L13.5307 20.8253C11.9645 22.3916 9.42514 22.3916 7.85891 20.8253L3.17467 16.1411Z" stroke="currentColor" stroke-width="1.8"></path>
                <path d="M4 22H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              </svg>
            </span>
            <span class="text">Manage</span>
          </li>
        </ul>
      </div>
    `;
  }

  getStats = data => {
    const last = data.last;
    const current = data.current;
    const deposited = data.deposited;
    const spent = data.spent;
    const earned = data.earned;
    return /* html */ `
      <div class="all-stats">
        <div class="head">
          <h3 class="title">Your Stats</h3>
        </div>
        <div class="stats">
          <div class="silk stat earned">
            <span class="amount">
              <span class="currency">Ksh</span>
              <span class="number">${this.number.shorten(current.earned)}</span>
            </span>
            <div class="change ${earned.rise ? "rise" : "fall"}">
              <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                  ${earned.rise ? this.getUpIcon() : this.getDownIcon()}
                </svg>
              </span>
              <span class="text">${earned.percentage}%</span>
            </div>
            <span class="label">Earned</span>
          </div>
          <div class="silk stat deposited">
            <span class="amount">
              <span class="currency">Ksh</span>
              <span class="number">${this.number.shorten(current.deposited)}</span>
            </span>
            <div class="change ${deposited.rise ? "rise" : "fall"}">
              <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                  ${deposited.rise ? this.getUpIcon() : this.getDownIcon()}
                </svg>
              </span>
              <span class="text">${deposited.percentage}%</span>
            </div>
            <span class="label">Deposited</span>
          </div>
          <div class="silk stat spent">
            <span class="amount">
              <span class="currency">Ksh</span>
              <span class="number">${this.number.shorten(current.spent)}</span>
            </span>
            <div class="change ${spent.rise ? "rise" : "fall"}">
              <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                  ${spent.rise ? this.getUpIcon() : this.getDownIcon()}
                </svg>
              </span>
              <span class="text">${spent.percentage}%</span>
            </div>
            <span class="label">Spent</span>
          </div>
        </div>
      </div>
    `;
  }

  getUpIcon = () => {
    return /* html */`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
        <path d="M20 13V8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M20 8L15 13C14.1174 13.8826 13.6762 14.3238 13.1346 14.3726C13.045 14.3807 12.955 14.3807 12.8654 14.3726C12.3238 14.3238 11.8826 13.8826 11 13C10.1174 12.1174 9.67615 11.6762 9.13457 11.6274C9.04504 11.6193 8.95496 11.6193 8.86543 11.6274C8.32385 11.6762 7.88256 12.1174 7 13L4 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  }

  getDownIcon = () => {
    return /* html */`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
        <path d="M20 11V16H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M20 16L15 11C14.1174 10.1174 13.6762 9.67615 13.1346 9.62737C13.045 9.6193 12.955 9.6193 12.8654 9.62737C12.3238 9.67615 11.8826 10.1174 11 11C10.1174 11.8826 9.67615 12.3238 9.13457 12.3726C9.04504 12.3807 8.95496 12.3807 8.86543 12.3726C8.32385 12.3238 7.88256 11.8826 7 11L4 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  }

  getHistory = () => {
    return /* html */`
      <div class="activity-section">
        <div class="section-header">
          <h3 class="section-title">Transactions</h3>
          <button class="view-all-btn">
            <span>All</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="activity-list">
          ${this.getTransactions()}
        </div>
      </div>
    `;
  }

  getTransactions = () => {
    return /* html */`
      <div is="transaction-item" id="TAC534436534" name="Fredrick Ochieng" account="THA763442H" account-kind="Holding"
        amount="2734.65" datetime="2021-09-12T12:00:00Z" image="https://randomuser.me/api/portraits/men/1.jpg"
        kind="received" status="completed" note="Payment for services rendered" in="true">
      </div>
      <div is="transaction-item" id="TAC534436535" name="Loan Account" account="THA763442H"
        amount="950.43" datetime="2021-09-13T14:00:00Z" account-kind="Loan"
        kind="repay" status="completed" note="Loan repayment" in="false">
      </div>
      <div is="transaction-item" id="TAC534436536" name="Alice Johnson" account="THA763442H" account-kind="Investment"
        amount="9816.81" datetime="2021-09-14T16:00:00Z" image="https://randomuser.me/api/portraits/women/15.jpg"
        kind="deposit" status="completed" note="Deposit from client" in="true">
      </div>
      <div is="transaction-item" id="TAC534436537" name="Bob Brown" account="THA763442H"
        amount="755.65" datetime="2021-09-15T18:00:00Z" account-kind="Holding"
        kind="send" status="completed" note="Payment for services rendered" in="false">
      </div>
      <div is="transaction-item" id="TAC534436542" name="Grace Harris" account="THA763442H" account-kind="Investment"
        amount="700.00" datetime="2021-09-20T16:00:00Z" image="https://randomuser.me/api/portraits/men/1.jpg"
        kind="apply" status="completed" note="Applied for loan" in="true">
      </div>
      <div is="transaction-item" id="TAC534436543" name="Henry Irving" account="THA763442H" account-kind="Investment"
        amount="800.00" datetime="2024-09-21T18:00:00Z" image="https://randomuser.me/api/portraits/men/11.jpg"
        kind="pay" status="completed" note="Payment for services rendered" in="false">
      </div>
      <div is="transaction-item" id="TAC534436544" name="Ivy Johnson" account="THA763442H"
        amount="900.00" datetime="2021-09-22T20:00:00Z" account-kind="Revenue"
        kind="withdraw" status="completed" note="Withdrawal from account" in="false"> 
      </div>
      <div is="transaction-item" id="TAC534436544" name="Mpesa Deposit" account="THA763442H"
        amount="2358.00" datetime="2024-10-13T20:45:00Z" account-kind="Holding"
        kind="Deposit" status="completed" note="Deposit from MPESA" in="true"> 
      </div>
    `;
  }

  getEmpty = () => {
    return /* html */`
      <div class="empty">
        <h2 class="text">No recent transactions</h2>
        <p class="text">You have not made any transactions yet.</p>
      </div>
    `;
  }

  getError = () => {
    return /* html */`
      <div class="empty error">
        <h2 class="text">Error loading transactions</h2>
        <p class="text">There was an error loading your transactions.</p>
        <button class="retry">Retry</button>
      </div>
    `;
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

          /* disable user selection */
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -khtml-user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
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
          padding: 20px 0 0 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          flex-flow: column;
          height: max-content;
          gap: 0;
          width: 100%;
          min-width: 100%;
        }

        div.header {
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 0;
          margin: 0;
          width: 100%;
        }

        div.header .user {
          display: flex;
          flex-flow: column;
          gap: 2px;
          padding: 0;
          align-items: start;
          margin: 0;
        }

        div.header .user .greeting {
          font-size: .95rem;
          font-family: var(--font-read), sans-serif;
          font-weight: 400;
          color: var(--gray-color);
        }

        div.header .user .name {
          font-size: 1.25rem;
          margin: 0;
          display: inline-block;
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
          font-weight: 600;
          color: var(--text-color);
        }

        div.header .title {
          font-size: 1.25rem;
          font-family: var(--font-text), sans-serif;
          font-weight: 500;
          color: var(--gray-color);
          line-height: 1.5;
          padding: 0;
          margin: 0;
        }

        div.balance {
          margin: 0;
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        div.balance .left {
          display: flex;
          flex-flow: column;
          gap: 10px;
          padding: 0;
        }

        div.balance .left .text {
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
          font-weight: 500;
          color: var(--gray-color);
        }

        div.balance .left .amount {
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: start;
          gap: 5px;
          color: var(--text-color);
        }

        div.balance .left .amount .number {
          font-size: 1.7rem;
          font-family: var(--font-main), sans-serif;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        div.balance .left .amount.blur > .number {
          filter: blur(10px);
          -webkit-filter: blur(10px);
        }

        div.balance .left .amount .currency {
          font-size: 1.7rem;
          font-family: var(--font-main), sans-serif;
          color: var(--gray-color);
          font-weight: 600;
          height: 100%;
        }

        div.balance .right {
          display: flex;
          flex-flow: row;
          gap: 10px;
          align-items: flex-end;
          margin: 2px 0 0;
        }

        div.balance .right .view-hide {
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          cursor: pointer;
          border-radius: 10px;
          color: var(--gray-color);
          border: var(--border);
        }

        div.balance .right .view-hide > svg {
          width: 16px;
          height: 16px;
          display: inline-block;
          margin-left: -2px;
        }

        div.balance .right .view-hide > .text {
          font-size: 0.8rem;
          font-family: var(--font-read), sans-serif;
          font-weight: 500;
          color: var(--gray-color);
        }

        div.account {
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 25px;
          margin: 0;
          padding: 20px 0 15px 0;
        }

        div.account > span {
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        div.account > span.line {
          display: flex;
          width: 2px;
          border-radius: 2px;
          height: 20px;
          background: var(--gray-background);
        }

        div.account .text {
          font-size: .9rem;
          font-family: var(--font-read), sans-serif;
          font-weight: 500;
          color: var(--gray-color);
        }

        div.account > span.since > .date {
          font-size: .85rem;
          color: var(--text-color);
          font-family: var(--font-read), sans-serif;
          text-transform: uppercase;
          font-weight: 500;
        }

        div.account > span.status {
          display: flex;
          align-items: center;
        }

        div.account > span.status.active > .status {
          font-size: .8rem;
          font-family: var(--font-text), sans-serif;
          font-weight: 500;
          color: var(--anchor-color);
        }

        div.account > span.status.inactive > .status {
          font-size: .8rem;
          font-family: var(--font-text), sans-serif;
          font-weight: 500;
          color: var(--warn-color);
        }

        div.account .number {
          font-size: .9rem;
          font-family: var(--font-mono), monospace;
          font-weight: 600;
          color: var(--text-color);
        }

        div.section {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 15px;
          padding: 0;
          margin: 0;
        }

        div.section.quick-history {
          gap: 0;
          padding: 10px 0;
        }

        div.section.quick-history > .header > h2.title {
          font-size: 1.25rem;
          font-family: var(--font-text), sans-serif;
          font-weight: 500;
          color: var(--gray-color);
          line-height: 1.5;
          padding: 0;
        }

        div.section.actions {
          margin: 0;
          padding: 10px 0;
        }

        div.section.actions > ul.quick-actions {
          margin: 0;
          padding: 0;
          display: flex;
          flex-flow: row;
          width: 100%;
          gap: 25px;
          align-items: start;
          justify-content: start;
        }

        ul.quick-actions > li.action {
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          padding: 9px 0;
          gap: 8px;
          list-style: none;
          border-radius: 12px;
          color: var(--text-color);

          /* prevent highlight on click */
          -webkit-tap-highlight-color: transparent;
          -webkit-user-select: none; /* Safari */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* IE10+/Edge */
          user-select: none;
        }

        ul.quick-actions > li.action > span.icon {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: -2px;
          background: #3a5a409a;
          border: thin solid #3a5a409a;
          width: 45px;
          height: 45px;
          border-radius: 50%;
        }

        ul.quick-actions > li.action.deposit > span.icon {
          border: thin solid #34c75965;
          background: #1e4a1e2a;
        }

        ul.quick-actions > li.action.withdraw > span.icon {
          border: thin solid #ff3b305e;
          background: #5a1e1e2a;
        }

        ul.quick-actions > li.action.send > span.icon {
          border: thin solid #ff950065;
          background: #5a3a1e2a;
        }

        ul.quick-actions > li.action.txns > span.icon {
          border: thin solid #5ac8fa65;
          background: #1e3a5a2a;
        }

        ul.quick-actions > li.action.manage > span.icon {
          border: thin solid #ffcc0094;
          background: #ffcc0017;
        }
        
        ul.quick-actions > li.action > span.icon > svg {
          width: 18px;
          height: 18px;
          display: inline-block;
        }

        ul.quick-actions > li.action > span.text {
          font-size: 0.8rem;
          font-family: var(--font-read), sans-serif;
          font-weight: 400;
        }

        div.actions.owner {
          display: flex;
          flex-flow: row nowrap;
          gap: 20px;
          padding: 10px 0;
          border-top: var(--border);
          overflow-x: scroll;
          width: 100%;
          scroll-behavior: smooth;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none;  /* IE and Edge */
          &::-webkit-scrollbar { /* WebKit */
            display: none;
            visibility: hidden;
            width: 0;
          }
        }

        div.all-stats {
          display: flex;
          flex-flow: column;
          gap: 4px;
          margin: 0;
          padding: 15px 0 0;
          width: 100%;
          border-top: var(--border);
          border-top-style: dashed;
        }

        div.head {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        div.head > h3.title {
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

        div.all-stats > .head > div.icons {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        div.all-stats > .head > div.icons > span.icon {
          display: flex;
          align-items: center;
          justify-content: center;
          border: var(--border);
          background: var(--gray-background);
          /* border-width: 2px; */
          width: 22px;
          height: 22px;
          border-radius: 50%;
          color: var(--gray-color);
        }

        div.all-stats > .head > div.icons > span.icon:hover {
          background: var(--gray-background);
        }

        div.all-stats > .head > div.icons > span.icon.active {
          background: #3f658b75;
          color: var(--text-color);
          border: thin solid #3a5a409a;
          /* border-width: 2px; */
        }

        div.all-stats > .head > div.icons > span.icon.active:hover {
          background: #3f658b75;
          border: thin solid #3a5a409a;
          color: var(--accent-color);
          /* border-width: 2px; */
        }

        div.all-stats > .head > div.icons > span.icon > svg {
          width: 20px;
          height: 20px;
          display: inline-block;
          vertical-align: middle;
        }

        div.all-stats > .head > div.icons > span.icon.next > svg {
          margin-left: 2px;
        }

        div.all-stats > div.stats {
          display: flex;
          flex-flow: row nowrap;
          gap: 12px;
          margin: 0;
          padding: 10px 0 0;
          overflow-x: auto;
          scrollbar-width: 0;
          -ms-overflow-style: none;  /* IE and Edge */
          &::-webkit-scrollbar {
            display: none;  /* Safari and Chrome */
            width: 0;
            visibility: hidden;
          }
        }

        div.all-stats > div.stats > div.stat {
          display: flex;
          flex-flow: column;
          align-items: start;
          justify-content: center;
          gap: 2px;
          /* add glass morphism effect */
          border: var(--account-stat-border);
          background: var(--account-stat-background);
          border-radius: 12px;
          padding: 7px 9px;
          min-width: 150px;
          max-width: 150px;
          margin: 0;
          position: relative;
        }

        div.all-stats > div.stats > div.stat > .amount > .number {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          color: var(--title-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.3;
        }

        div.all-stats > div.stats > div.stat > .amount > .currency {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          line-height: 1.3;
        }

        div.all-stats > div.stats > div.stat > .change {
          display: flex;
          flex-flow: row;
          gap: 5px;
          padding: 0;
          margin: 0;
          align-items: center;
          justify-content: start;
        }

        div.all-stats > div.stats > div.stat > .change > .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: -2px;
        }

        div.all-stats > div.stats > div.stat > .change.rise {
          color: var(--anchor-color);
        }

        div.all-stats > div.stats > div.stat > .change.fall {
          color: var(--error-color);
        }

        div.all-stats > div.stats > div.stat > .change > .icon > svg {
          width: 16px;
          height: 16px;
          display: inline-block;
          color: inherit;
        }

        div.all-stats > div.stats > div.stat > .change > .text {
          font-size: 1rem;
          font-weight: 600;
          font-family: var(--font-read), sans-serif;
        }

        div.all-stats > div.stats > div.stat > .label {
          font-size: 0.9rem;
          font-weight: 400;
          text-transform: capitalize;
          margin: 0;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          line-height: 1.3;
        }

        /* Activity Section */
        div.activity-section {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 15px 0;
        }

        div.activity-section > .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-top: var(--border);
          border-bottom: var(--border);
        }

        div.activity-section .section-title {
          font-size: 1.35rem;
          font-family: var(--font-main), sans-serif;
          font-weight: 600;
          color: var(--text-color);
          margin: 0;
          position: relative;
        }

        div.activity-section .view-all-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 13px;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: var(--gray-color);
          background: var(--gray-background);
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        div.activity-section .view-all-btn:hover {
          background: var(--accent-color);
          border: none;
          color: var(--white-color);
        }

        div.activity-section .activity-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* Animations */
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-40px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .empty {
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding: 20px 0;
        }

        .empty > h2.text {
          font-size: 1.35rem;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          font-weight: 500;
          padding: 0;
          margin: 0;
        }

        .empty.error > h2.text {
          color: var(--warn-color);
        }

        .empty > p.text {
          font-size: 1rem;
          font-family: var(--font-read), sans-serif;
          color: var(--gray-color);
          font-weight: 400;
          padding: 0;
          margin: 0;
        }

        .empty > button.retry {
          margin: 20px 0 0 0;
          display: inline-block;
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
          color: var(--accent-color);
          font-weight: 500;
          padding: 5px 20px;
          background: none;
          border: var(--action-border);
          border-radius: 12px;
          cursor: pointer;
        }

				@media screen and (max-width: 700px) {
					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

          :host {
            font-size: 16px;
            padding: 0 10px 65px;
            margin: 0;
          }
          
          div.section ul.accounts li.account,
          div.balance .right .view-hide,
          ul.quick-actions > li.action,
          div.section.actions > ul.quick-actions > li.action,
          div.section .header > span.inf,
					a {
						cursor: default !important;
            /* Disable text selection */
            -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Safari */
            -khtml-user-select: none; /* Konqueror HTML */
            -moz-user-select: none; /* Old versions of Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
          }

          div.balance {
            margin: 0;
            display: flex;
            flex-flow: row;
            justify-content: space-between;
            align-items: start;
            width: 100%;
            margin: 10px 0 0;
            padding: 0;
          }

          div.section.actions {
            margin: 0;
            padding: 0;
          }

          div.account {
            display: flex;
            flex-flow: row;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin: 0;
            padding: 20px 0 10px 0;
          }

          div.section.actions > ul.quick-actions {
            padding: 20px 0;
            display: flex;
            flex-wrap: no-wrap;
            justify-content: start;
            overflow-x: auto;
            gap: 20px;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          div.section.actions > ul.quick-actions::-webkit-scrollbar {
            display: none;
            visibility: hidden;
          }

          ul.quick-actions > li.action {
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
            padding: 0;
            gap: 5px;
            list-style: none;
            border-radius: 12px;
            color: var(--text-color);

            /* prevent highlight on click */
            -webkit-tap-highlight-color: transparent;
            -webkit-user-select: none; /* Safari */
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* IE10+/Edge */
            user-select: none;
          }

          ul.quick-actions > li.action > span.icon {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: -2px;
            background: #3a5a409a;
            border: thin solid #3a5a409a;
            width: 42px;
            height: 42px;
            min-width: 42px;
            min-height: 42px;
            border-radius: 50%;
          }

          ul.quick-actions > li.action.deposit > span.icon {
            border: thin solid #34c75965;
            background: #1e4a1e2a;
          }

          ul.quick-actions > li.action.withdraw > span.icon {
            border: thin solid #ff3b305e;
            background: #5a1e1e2a;
          }

          ul.quick-actions > li.action.send > span.icon {
            border: thin solid #ff950065;
            background: #5a3a1e2a;
          }

          ul.quick-actions > li.action.txns > span.icon {
            border: thin solid #5ac8fa65;
            background: #1e3a5a2a;
          }

          ul.quick-actions > li.action.manage > span.icon {
            border: thin solid #ffcc0094;
            background: #ffcc0017;
          }
          
          ul.quick-actions > li.action > span.icon > svg {
            width: 18px;
            height: 18px;
            display: inline-block;
          }

          ul.quick-actions > li.action > span.text {
            font-size: 0.75rem;
            font-family: var(--font-read), sans-serif;
            font-weight: 400;
          }

          div.all-stats > div.stats {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin: 0;
            padding: 10px 0 0;
            overflow-x: auto;
            scrollbar-width: 0;
            -ms-overflow-style: none;
          }

          div.all-stats > div.stats > div.stat {
            display: flex;
            flex-flow: column;
            align-items: start;
            justify-content: center;
            gap: 2px;
            /* add glass morphism effect */
            border: var(--account-stat-border);
            background: var(--account-stat-background);
            border-radius: 12px;
            padding: 7px 9px;
            min-width: 110px;
            max-width: 110px;
            margin: 0;
            position: relative;
          }

          div.all-stats > div.stats > div.stat > .amount {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: start;
            gap: 5px;
          }

          div.all-stats > div.stats > div.stat > .amount > .number {
            font-size: 1rem;
            font-weight: 500;
            margin: 0;
            color: var(--title-color);
            font-family: var(--font-main), sans-serif;
            line-height: 1.3;
          }

          div.all-stats > div.stats > div.stat > .amount > .currency {
            font-size: 1rem;
            font-weight: 500;
            margin: 0;
            color: var(--gray-color);
            font-family: var(--font-read), sans-serif;
            line-height: 1.3;
          }

          div.all-stats > div.stats > div.stat > .change {
            display: flex;
            flex-flow: row;
            gap: 5px;
            padding: 0;
            margin: 0;
            align-items: center;
            justify-content: start;
          }

          div.all-stats > div.stats > div.stat > .change > .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: -2px;
          }

          div.all-stats > div.stats > div.stat > .change.rise {
            color: var(--anchor-color);
          }

          div.all-stats > div.stats > div.stat > .change.fall {
            color: var(--error-color);
          }

          div.all-stats > div.stats > div.stat > .change > .icon > svg {
            width: 16px;
            height: 16px;
            display: inline-block;
            color: inherit;
          }

          div.all-stats > div.stats > div.stat > .change > .text {
            font-size: 0.9rem;
            font-weight: 500;
            font-family: var(--font-read), sans-serif;
          }


          div.all-stats > div.stats > div.stat > .label {
            font-size: 0.85rem;
            font-weight: 400;
            text-transform: capitalize;
            margin: 0;
            color: var(--gray-color);
            font-family: var(--font-read), sans-serif;
            line-height: 1.3;
          }
				}
	    </style>
    `;
  }
}