export default class Account extends HTMLElement {
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
        <h3 class="section-title">Actions</h3>
        ${this.getWalletActions()}
      </div>
    `;
  };

  getWalletActions = () => {
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
            <h4 class="action-title">Payment Methods</h4>
            <p class="action-description">Manage payment methods</p>
          </div>
        </div>
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
            <h4 class="action-title">Payments</h4>
            <p class="action-description">Order/Service payments</p>
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
          font-family: var(--font-text), sans-serif;
          line-height: 1.6;
          margin: 15px 0 0;
          padding: 5px 0 0;
          border-top: var(--border);
          color: var(--text-color);
        }

        * {
          box-sizing: border-box;
        }

        .container {
          max-width: 100%;
          margin: 0;
          padding: 0;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0;
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
          padding: 10px 0;
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

        h3.section-title {
          font-size: 1.35rem;
          font-family: var(--font-main), sans-serif;
          font-weight: 600;
          color: var(--text-color);
          margin: 0;
          position: relative;
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