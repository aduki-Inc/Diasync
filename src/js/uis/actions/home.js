export default class Home extends HTMLElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.app = window.app;
    this.api = this.app.api;
    this._block = false;
    this._empty = false;
    this._loading = true; // Add loading state
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // Set up event listeners and intervals
    this._addQuickActionListeners();
  }

  activateRefresh = () => {
    const retryBtn = this.shadowObj.querySelector("button.finish");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        // Reset states
        this._block = false;
        this._empty = false;

        // Start fetch again
      });
    }
  };

  getTemplate() {
    return /* html */ `
      ${this.getStyles()}
      ${this.getBody()}
    `;
  }

  getBody = () => {
    // Show dashboard with actual data
    return /* html */ `
      <div class="container">
        ${this._getQuickActionsHTML()}
      </div>
    `;
  };

  _getQuickActionsHTML = () => {
    return /* html */ `
      <div class="quick-actions-section">
        <h3 class="section-title">Main Actions</h3>
        ${this.getMainActions()}
        <h3 class="section-title">Loan Actions</h3>
        ${this.getLoanActions()}
        <h3 class="section-title">Wallet Actions</h3>
        ${this.getWalletActions()}
      </div>
    `;
  };

  getMainActions = () => {
    return /* html */ `
      <div class="main-actions">
        <div class="action-card primary" data-action="add-user">
          <div class="action-icon icon-add-user">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M15 8C15 5.23858 12.7614 3 10 3C7.23858 3 5 5.23858 5 8C5 10.7614 7.23858 13 10 13C12.7614 13 15 10.7614 15 8Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M17.5 21L17.5 14M14 17.5H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 20C3 16.134 6.13401 13 10 13C11.4872 13 12.8662 13.4638 14 14.2547" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div class="action-content">
            <h4 class="action-title">Register User</h4>
            <p class="action-description">Register a new user</p>
          </div>
        </div>
        <div class="action-card secondary" data-action="add-chama">
          <div class="action-icon icon-add-chama">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M3 20V17.9704C3 16.7281 3.55927 15.5099 4.68968 14.9946C6.0685 14.3661 7.72212 14 9.5 14C10.7448 14 11.9287 14.1795 13 14.5028" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <circle cx="9.5" cy="7.5" r="3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></circle>
              <path d="M14.5 4.14453C15.9457 4.57481 17 5.91408 17 7.49959C17 9.0851 15.9457 10.4244 14.5 10.8547" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M18 14V20M15 17H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <div class="action-content">
            <h4 class="action-title">Create Chama</h4>
            <p class="action-description">New investment group</p>
          </div>
        </div>
        <div class="action-card info" data-action="add-member">
          <div class="action-icon icon-add-member">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M15.5 8C15.5 5.23858 13.2614 3 10.5 3C7.73858 3 5.5 5.23858 5.5 8C5.5 10.7614 7.73858 13 10.5 13C13.2614 13 15.5 10.7614 15.5 8Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3.5 20C3.5 16.134 6.63401 13 10.5 13C11.775 13 12.9704 13.3409 14 13.9365" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M20.1887 14.9339L19.5661 14.3113C19.151 13.8962 18.478 13.8962 18.0629 14.3113L14.7141 17.6601C14.269 18.1052 13.9656 18.6722 13.8421 19.2895L13.5 21L15.2105 20.6579C15.8278 20.5344 16.3948 20.231 16.8399 19.7859L20.1887 16.4371C20.6038 16.022 20.6038 15.349 20.1887 14.9339Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div class="action-content">
            <h4 class="action-title">Add Member</h4>
            <p class="action-description">Invite to chama group</p>
          </div>
        </div>
        <div class="action-card accent" data-action="add-interval">
          <div class="action-icon icon-add-interval">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
                <line x1="9" y1="3" x2="15" y2="3"></line>
            </svg>
          </div>
          <div class="action-content">
            <h4 class="action-title">Create Interval</h4>
            <p class="action-description">Add payment schedule</p>
          </div>
        </div>
      </div>
    `;
  };

  getLoanActions = () => {
    return /* html */ `
      <div class="main-actions loan">
        <div class="action-card success" data-action="loan-application">
          <div class="action-icon icon-loan-application">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M10.5502 3C6.69782 3.00694 4.6805 3.10152 3.39128 4.39073C2 5.78202 2 8.02125 2 12.4997C2 16.9782 2 19.2174 3.39128 20.6087C4.78257 22 7.0218 22 11.5003 22C15.9787 22 18.218 22 19.6093 20.6087C20.8985 19.3195 20.9931 17.3022 21 13.4498" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M11.0556 13C10.3322 3.86635 16.8023 1.27554 21.9805 2.16439C22.1896 5.19136 20.7085 6.32482 17.8879 6.84825C18.4326 7.41736 19.395 8.13354 19.2912 9.02879C19.2173 9.66586 18.7846 9.97843 17.9194 10.6036C16.0231 11.9736 13.8264 12.8375 11.0556 13Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M9 17C11 11.5 12.9604 9.63636 15 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div class="action-content">
            <h4 class="action-title">Apply Loan</h4>
            <p class="action-description">Add loan application</p>
          </div>
        </div>
        <div class="action-card warning" data-action="process-loan">
          <div class="action-icon icon-add-loan">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" currentColor fill="none">
              <path d="M15 2.4578C14.053 2.16035 13.0452 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 10.9548 21.8396 9.94704 21.5422 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M8.5 9.5L12 13L21.0002 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <div class="action-content">
            <h4 class="action-title">Process Loan</h4>
            <p class="action-description">Approve/disburse loan</p>
          </div>
        </div>
        <div class="action-card defaulters" data-action="defaulters">
          <div class="action-icon icon-defaulters">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M12 21.5H15C17.8284 21.5 19.2426 21.5 20.1213 20.6213C21 19.7426 21 18.3284 21 15.5V14.5C21 11.6716 21 10.2574 20.1213 9.37868C19.2426 8.5 17.8284 8.5 15 8.5H3V12.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M15 8.49833V4.1103C15 3.22096 14.279 2.5 13.3897 2.5C13.1336 2.5 12.8812 2.56108 12.6534 2.67818L3.7623 7.24927C3.29424 7.48991 3 7.97203 3 8.49833" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M17.5 15.5C17.7761 15.5 18 15.2761 18 15C18 14.7239 17.7761 14.5 17.5 14.5M17.5 15.5C17.2239 15.5 17 15.2761 17 15C17 14.7239 17.2239 14.5 17.5 14.5M17.5 15.5V14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M9 15.5L3 21.5M3 15.5L9 21.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div class="action-content">
            <h4 class="action-title">View Defaulters</h4>
            <p class="action-description">View loan defaulters</p>
          </div>
        </div>
        <div class="action-card tertiary" data-action="add-interest">
          <div class="action-icon icon-add-interest">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" currentColor fill="none">
              <path d="M4 20L20 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M8.26777 4.73223C9.24408 5.70854 9.24408 7.29146 8.26777 8.26777C7.29146 9.24408 5.70854 9.24408 4.73223 8.26777C3.75592 7.29146 3.75592 5.70854 4.73223 4.73223C5.70854 3.75592 7.29146 3.75592 8.26777 4.73223Z" stroke="currentColor" stroke-width="1.8"></path>
              <path d="M19.2678 15.7322C20.2441 16.7085 20.2441 18.2915 19.2678 19.2678C18.2915 20.2441 16.7085 20.2441 15.7322 19.2678C14.7559 18.2915 14.7559 16.7085 15.7322 15.7322C16.7085 14.7559 18.2915 14.7559 19.2678 15.7322Z" stroke="currentColor" stroke-width="1.8"></path>
            </svg>
          </div>
          <div class="action-content">
            <h4 class="action-title">Set Rate</h4>
            <p class="action-description">Configure interest rates</p>
          </div>
        </div>
      </div>
    `;
  };

  getWalletActions = () => {
    return /* html */ `
      <div class="main-actions loan">
        <div class="action-card alt" data-action="record-repayment">
          <div class="action-icon icon-add-repayment">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" currentColor fill="none">
              <path d="M11 21.5H15C17.8284 21.5 19.2426 21.5 20.1213 20.6213C21 19.7426 21 18.3284 21 15.5V14.5C21 11.6716 21 10.2574 20.1213 9.37868C19.2426 8.5 17.8284 8.5 15 8.5H3V15.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M15 8.49833V4.1103C15 3.22096 14.279 2.5 13.3897 2.5C13.1336 2.5 12.8812 2.56108 12.6534 2.67818L3.7623 7.24927C3.29424 7.48991 3 7.97203 3 8.49833" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M17.5 15.5C17.7761 15.5 18 15.2761 18 15C18 14.7239 17.7761 14.5 17.5 14.5M17.5 15.5C17.2239 15.5 17 15.2761 17 15C17 14.7239 17.2239 14.5 17.5 14.5M17.5 15.5V14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M3 19.5C3 19.5 4 19.5 5 21.5C5 21.5 8.17647 16.5 11 15.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <div class="action-content">
            <h4 class="action-title">Record Deposit</h4>
            <p class="action-description">Process user deposit</p>
          </div>
        </div>
        <div class="action-card success" data-action="record-contribution">
          <div class="action-icon icon-add-contribution">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" currentColor fill="none">
              <path d="M19.7453 13C20.5362 11.8662 21 10.4872 21 9C21 5.13401 17.866 2 14 2C10.134 2 7 5.134 7 9C7 10.0736 7.24169 11.0907 7.67363 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M14 6C12.8954 6 12 6.67157 12 7.5C12 8.32843 12.8954 9 14 9C15.1046 9 16 9.67157 16 10.5C16 11.3284 15.1046 12 14 12M14 6C14.8708 6 15.6116 6.4174 15.8862 7M14 6V5M14 12C13.1292 12 12.3884 11.5826 12.1138 11M14 12V13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M3 14H5.39482C5.68897 14 5.97908 14.0663 6.24217 14.1936L8.28415 15.1816C8.54724 15.3089 8.83735 15.3751 9.1315 15.3751H10.1741C11.1825 15.3751 12 16.1662 12 17.142C12 17.1814 11.973 17.2161 11.9338 17.2269L9.39287 17.9295C8.93707 18.0555 8.449 18.0116 8.025 17.8064L5.84211 16.7503M12 16.5L16.5928 15.0889C17.407 14.8352 18.2871 15.136 18.7971 15.8423C19.1659 16.3529 19.0157 17.0842 18.4785 17.3942L10.9629 21.7305C10.4849 22.0063 9.92094 22.0736 9.39516 21.9176L3 20.0199" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <div class="action-content">
            <h4 class="action-title">Contribution</h4>
            <p class="action-description">Record user payment</p>
          </div>
        </div>
        <div class="action-card bulk" data-action="view-transactions">
          <div class="action-icon icon-bulk">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" currentColor fill="none">
              <path d="M3.3457 16.1976L16.1747 3.36866M18.6316 11.0556L16.4321 13.2551M14.5549 15.1099L13.5762 16.0886" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M3.17467 16.1411C1.60844 14.5749 1.60844 12.0355 3.17467 10.4693L10.4693 3.17467C12.0355 1.60844 14.5749 1.60844 16.1411 3.17467L20.8253 7.85891C22.3916 9.42514 22.3916 11.9645 20.8253 13.5307L13.5307 20.8253C11.9645 22.3916 9.42514 22.3916 7.85891 20.8253L3.17467 16.1411Z" stroke="currentColor" stroke-width="1.8" />
              <path d="M4 22H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </div>
          <div class="action-content">
            <h4 class="action-title">Transactions</h4>
            <p class="action-description">Platform transactions</p>
          </div>
        </div>
        <div class="action-card export" data-action="view-deposits">
          <div class="action-icon icon-export">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" currentColor fill="none">
              <path d="M14 18C18.4183 18 22 14.4183 22 10C22 5.58172 18.4183 2 14 2C9.58172 2 6 5.58172 6 10C6 14.4183 9.58172 18 14 18Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M13.1669 20.9689C12.063 21.6239 10.7742 22 9.3975 22C5.31197 22 2 18.688 2 14.6025C2 13.2258 2.37607 11.937 3.03107 10.8331" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            </svg>
          </div>
          <div class="action-content">
            <h4 class="action-title">Deposits</h4>
            <p class="action-description">View all users' deposits</p>
          </div>
        </div>
      </div>
    `;
  };

  _addQuickActionListeners = () => {
    const actionCards = this.shadowObj.querySelectorAll(".action-card");
    actionCards.forEach((card) => {
      card.addEventListener("click", this._handleQuickActionClick);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this._handleQuickActionClick.call(card, e);
        }
      });
    });
  };
  _handleQuickActionClick = function (e) {
    const card = this;
    const action = (card.getAttribute('data-action') || card.dataset.action || '').trim();

    // Add quick click animation
    try {
      card.style.transform = 'scale(0.96)';
      setTimeout(() => { card.style.transform = ''; }, 150);
    } catch (err) { /* ignore style failures */ }

    // Prefer global app instance
    const app = window.app;

    // Prevent rapid double-clicks on the same card
    if (card.__quick_action_locked) return;
    card.__quick_action_locked = true;
    setTimeout(() => { card.__quick_action_locked = false; }, 400);

    const navigate = (path, html) => {
      try {
        app.navigate(path, { kind: 'app', html });
      } catch (err) {
        console.error('Navigation error:', err);
        if (typeof app.showToast === 'function') app.showToast(false, 'Navigation failed');
      }
    };

    const map = {
      'add-user': ['/users/add', /* html */ `<add-user api="/auth/user/add"></add-user>`],
      'add-chama': ['/chamas/add', /* html */ `<add-chama api="/chama/add"></add-chama>`],
      'add-interest': ['/interests/add', /* html */ `<add-interest api="/interests/add"></add-interest>`],
      'add-interval': ['/intervals/add', /* html */ `<add-interval api="/intervals/add"></add-interval>`],
      'record-contribution': ['/contributions/add', /* html */ `<add-contribution api="/contributions/add"></add-contribution>`],
      'process-loan': ['/loans/add', /* html */ `<add-loan api="/loans/add"></add-loan>`],
      'add-member': ['/members/add', /* html */ `<add-member api="/members/add"></add-member>`],
      'record-repayment': ['/repayments/add', /* html */ `<add-repayment api="/repayments/add"></add-repayment>`],
      'view-transactions': ['/wallet/transactions', /* html */ `<transactions-feed api="/transaction/recent" feed-title="Recent Transactions" description="Recent financial transactions"></transactions-feed>`],
      'view-deposits': ['/wallet/deposits', /* html */ `<deposits-feed api="/deposit/recent" feed-title="Recent Deposits" description="Recent deposit transactions"></deposits-feed>`],
      // kept for completeness: other actions in the UI
      'loan-application': ['/loans/apply', /* html */ `<add-loan api="/loans/add"></add-loan>`],
      'defaulters': ['/loans/defaulters', /* html */ `<defaulters-feed api="/loans/defaulters" feed-title="Loan Defaulters" description="List of loan defaulters"></defaulters-feed>`]
    };

    // If mapping exists, navigate
    if (map[action]) {
      const [path, html] = map[action];
      // small delay so click animation is visible
      setTimeout(() => navigate(path, html), 80);
      return;
    }
  };

  getLoader() {
    return /* html */ `
      <div class="loader-container">
        <div class="loader"></div>
      </div>
    `;
  }

  getEmptyMsg = () => {
    return /*html*/ `
      <div class="finish">
        <h2 class="finish__title">No dashboard data available</h2>
        <p class="desc">
          There are no stats available right now. Please check back later.
        </p>
      </div>
    `;
  };

  getWrongMessage = () => {
    return /*html*/ `
      <div class="finish">
        <h2 class="finish__title">Something went wrong!</h2>
        <p class="desc">
         An error occurred while fetching the dashboard data. Please check your connection and try again.
        </p>
        <button class="finish">Retry</button>
      </div>
    `;
  };

  getStyles = () => {
    return /* html */ `
      <style>
        :host {
          display: block;
          width: 100%;
          border-bottom: var(--border);
          font-family: var(--font-text), sans-serif;
          line-height: 1.6;
          color: var(--text-color);
        }

        * {
          box-sizing: border-box;
        }

        .container {
          max-width: 100%;
          margin: 0;
          padding: 0 0 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .header {
          display: flex;
          flex-direction: column;
          flex-flow: column;
          gap: 0;
        }

        .header h1 {
          font-size: 24px;
          font-weight: 600;
          color: var(--title-color);
          margin: 0;
          padding: 0;
          line-height: 1.4;
        }

        .subtitle {
          font-size: 14px;
          color: var(--gray-color);
          margin: 0;
          padding: 0;
          line-height: 1.4;
        }

        /* Loader Styles */
        div.loader-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 200px;
          min-width: 100%;
        }

        div.loader-container > .loader {
          width: 24px;
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
          animation-delay: -0.5s;
        }

        @keyframes l22-0 {
          100% { transform: rotate(1turn); }
        }

        @keyframes l22 {
          100% { transform: rotate(1turn) translate(150%); }
        }

        @media (max-width: 768px) {
          .container {
            padding: 15px;
          }
        }

        /* Overview Sections */
        .overview-section {
          display: flex;
          flex-flow: column;
          margin-bottom: 30px;
          gap: 15px;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--title-color);
          margin: 5px 0 0;
          position: relative;
        }

        /* Empty State and Error Message Styling */
        .finish {
          text-align: center;
          padding: 3rem 1rem;
          max-width: 500px;
          margin: 20px auto;
          background: var(--background);
          border-radius: 12px;
        }

        .finish__title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--title-color);
        }

        .desc {
          color: var(--gray-color);
          margin-bottom: 2rem;
        }

        button.finish {
          background: var(--action-linear);
          color: var(--white-color);
          border: none;
          font-size: 0.9rem;
          padding: 9px 1.5rem;
          border-radius: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        button.finish:hover {
          background: var(--accent-linear);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .stat-value {
            font-size: 2rem;
          }

          .stat-icon {
            width: 40px;
            height: 40px;
          }
        }

        .finish button:focus {
          outline: 2px solid var(--accent-color);
          outline-offset: 2px;
        }

        /* Animation for value changes */
        @keyframes countUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .stat-value {
          animation: countUp 0.6s ease-out;
        }

        /* Hover effects for interactivity */
        .stat-card {
          cursor: pointer;
        }

        .stat-card:active {
          transform: translateY(-4px) scale(0.98);
        }

        /* Quick Actions Section */
        .quick-actions-section {
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        div.main-actions {
          display: flex;
          flex-flow: row nowrap;
          gap: 20px;
          padding: 6px 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }

        .attention-badge {
          background: var(--error-linear);
          color: var(--white-color);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        @media (max-width: 768px) {
          .quick-actions-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
          }
        }

        @media (max-width: 480px) {
          .quick-actions-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Action Cards */
        .action-card {
          background-color: var(--stat-background);
          border-radius: 15px;
          padding: 12px 15px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          border: 2px solid transparent;
        }

        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .action-card:active {
          transform: translateY(-2px) scale(0.98);
        }

        /* Highlighted action cards (needs attention) */
        .action-card.highlighted {
          border: 1px solid var(--accent-color);
          background: linear-gradient(135deg, var(--stat-background), rgba(0, 96, 223, 0.05));
          position: relative;
        }

        /* Action Card Variants */
        .action-card.primary:hover {
          border-color: var(--accent-color);
          box-shadow: 0 8px 25px rgba(0, 96, 223, 0.25);
        }

        .action-card.secondary:hover {
          border-color: var(--alt-color);
          box-shadow: 0 8px 25px rgba(223, 121, 26, 0.25);
        }

        .action-card.tertiary:hover {
          border-color: #8b5cf6;
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.25);
        }

        .action-card.accent:hover {
          border-color: #06b6d4;
          box-shadow: 0 8px 25px rgba(6, 182, 212, 0.25);
        }

        .action-card.success::before {
          background: linear-gradient(135deg, #10b981, #059669);
        }
        .action-card.success:hover {
          border-color: var(--success-color);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.25);
        }

        .action-card.warning::before {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }
        .action-card.warning:hover {
          border-color: #f59e0b;
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.25);
        }

        .action-card.info:hover {
          border-color: #3b82f6;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.25);
        }

        .action-card.defaulters:hover {
          border-color: #ff5a3c;
          box-shadow: 0 8px 25px rgba(255, 90, 60, 0.25);
        }

        .action-card.alt:hover {
          border-color: #ec4899;
          box-shadow: 0 8px 25px rgba(236, 72, 153, 0.25);
        }

        .action-card.bulk:hover {
          border-color: #6366f1;
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.25);
        }

        .action-card.export:hover {
          border-color: #14b8a6;
          box-shadow: 0 8px 25px rgba(20, 184, 166, 0.25);
        }

        /* Action Icons */
        .action-icon {
          width: 40px;
          height: 40px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white-color);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .action-card:hover .action-icon {
          transform: rotate(5deg) scale(1.1);
        }

        /* Icon Color Themes */
        .icon-add-user { background: var(--accent-linear); }
        .icon-add-chama { background: var(--second-linear); }
        .icon-add-interest { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .icon-add-interval { background: linear-gradient(135deg, #06b6d4, #0891b2); }
        .icon-add-contribution { background: linear-gradient(135deg, #10b981, #059669); }
        .icon-add-loan { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .icon-add-member { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .icon-add-repayment { background: linear-gradient(135deg, #ec4899, #db2777); }
        .icon-defaulters { background: linear-gradient(103.53deg, #ff5a3c -6.72%, #ff3c1a 109.77%); }
        .icon-bulk { background: linear-gradient(135deg, #6366f1, #4f46e5); }
        .icon-export { background: linear-gradient(135deg, #14b8a6, #0d9488); }
        .icon-loan-application { background: linear-gradient(135deg, #10b981, #059669); }

        /* Action Content */
        .action-content {
          display: flex;
          flex-direction: column;
          gap: 0;
          flex: 1;
        }

        .action-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--title-color);
          margin: 0;
          line-height: 1.1;
          font-family: var(--font-main), sans-serif;
          letter-spacing: -0.01em;
        }

        .action-description {
          font-size: 0.85rem;
          color: var(--gray-color);
          margin: 0;
          font-family: var(--font-read), sans-serif;
          line-height: 1.4;
        }

        /* Accessibility */
        .action-card:focus {
          outline: 2px solid var(--accent-color);
          outline-offset: 2px;
        }

        /* Animation for quick actions */
        @keyframes actionPulse {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-2px) scale(1.02); }
          100% { transform: translateY(0) scale(1); }
        }

        /* Responsive adjustments for action cards */
        @media (max-width: 768px) {
          .action-card {
            padding: 16px;
          }

          .action-icon {
            width: 44px;
            height: 44px;
          }

          .action-title {
            font-size: 1rem;
          }

          .action-description {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .action-card {
            padding: 14px;
            gap: 12px;
          }

          .action-icon {
            width: 40px;
            height: 40px;
          }

          .action-title {
            font-size: 0.95rem;
          }
        }
      </style>`;
  };
}