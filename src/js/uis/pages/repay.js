export default class Repayments extends HTMLElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.app = window.app;
    this.api = this.app.api;
    this.baseUrl = this.getAttribute("api") || "/stats/repay";
    this.successData = null;
    this.performanceData = null;
    this.activeTab = "success"; // default tab
    this.cacheUpdateInterval = null;
    this._block = false;
    this._empty = false;
    this._loading = true;
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    this.fetchAllData();
    this._addTabListeners();
    this._addStatCardListeners();
  }

  disconnectedCallback() {
    if (this.checkComponentsInterval) {
      clearInterval(this.checkComponentsInterval);
    }
    if (this.cacheUpdateInterval) {
      clearInterval(this.cacheUpdateInterval);
    }
  }

  fetchAllData = async () => {
    this._loading = true;
    this._block = true;
    this.render();

    try {
      // Fetch both success and performance data in parallel
      const [successResponse, performanceResponse] = await Promise.all([
        this.api.get(`${this.baseUrl}/success`, { content: "json" }),
        this.api.get(`${this.baseUrl}/performance`, { content: "json" })
      ]);

      // Check authentication for success
      if (
        successResponse.status_code === 401 ||
        (successResponse.error_message &&
          successResponse.error_message.includes("validate credentials"))
      ) {
        console.log("Authentication required for repayments access");
        this._loading = false;
        this.app.showAccess();
        return;
      }

      // Check authentication for performance
      if (
        performanceResponse.status_code === 401 ||
        (performanceResponse.error_message &&
          performanceResponse.error_message.includes("validate credentials"))
      ) {
        console.log("Authentication required for repayments access");
        this._loading = false;
        this.app.showAccess();
        return;
      }

      if (!successResponse.success || !successResponse.data ||
        !performanceResponse.success || !performanceResponse.data) {
        this._empty = true;
        this._loading = false;
        this.successData = null;
        this.performanceData = null;
        this.render();
        this.activateRefresh();
        return;
      }

      this._loading = false;
      this._block = false;
      this._empty = false;

      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('dev')) {
        console.log('Repayments Success data:', successResponse.data);
        console.log('Repayments Performance data:', performanceResponse.data);
      }

      this.successData = successResponse;
      this.performanceData = performanceResponse;
      this.render();
      this._addTabListeners();
      this._addStatCardListeners();
    } catch (error) {
      console.error("Error fetching repayments data:", error);

      if (
        error.status === 401 ||
        (error.response && error.response.status === 401)
      ) {
        console.log("Authentication required for repayments access");
        this._loading = false;
        this.app.showLogin();
        return;
      }

      this._loading = false;
      this._empty = true;
      this.successData = null;
      this.performanceData = null;
      this.render();
      this.activateRefresh();
    }
  };

  switchTab = (tabName) => {
    this.activeTab = tabName;
    this.render();
    this._addTabListeners();
    this._addStatCardListeners();
  };

  _addTabListeners = () => {
    const tabButtons = this.shadowRoot.querySelectorAll(".tab-button");
    tabButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const tabName = e.target.getAttribute("data-tab");
        this.switchTab(tabName);
      });
    });
  };

  activateRefresh = () => {
    const retryBtn = this.shadowRoot.querySelector("button.finish");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        this._block = false;
        this._empty = false;
        this.fetchAllData();
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
    if (this._loading) {
      return /* html */ `<div class="container">${this.getLoader()}</div>`;
    }

    if (this._empty || (!this.successData && !this.performanceData)) {
      return /* html */ `<div class="container">${this.getWrongMessage()}</div>`;
    }

    return /* html */ `
      <div class="container">
        <div class="header">
          <div class="breadcrumb">
            <span class="breadcrumb-item">Stats</span>
            <span class="breadcrumb-separator">|</span>
            <span class="breadcrumb-item active">Repayments</span>
          </div>
          <p class="subtitle">Comprehensive loan repayment analytics, success metrics, and performance insights</p>
        </div>
        
        <!-- Tab Navigation -->
        <div class="tab-navigation">
          <button class="tab-button ${this.activeTab === 'success' ? 'active' : ''}" data-tab="success">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 12l2 2 4-4"></path><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.35 0 4.48.9 6.08 2.38"></path>
            </svg>
            Success Metrics
          </button>
          <button class="tab-button ${this.activeTab === 'performance' ? 'active' : ''}" data-tab="performance">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
            </svg>
            Performance Analysis
          </button>
        </div>
        
        <!-- Tab Content -->
        <div class="tab-content">
          ${this.activeTab === 'success' ? this._getSuccessHTML() : this._getPerformanceHTML()}
        </div>
      </div>
    `;
  };

  _getSuccessHTML = () => {
    if (!this.successData || !this.successData.data) {
      return `<div class="empty-state">No success metrics available</div>`;
    }

    const data = this.successData.data.overview[0] || {};

    return /* html */ `
      <div class="dashboard-overview">
        ${this._getLoanOverviewSection(data)}
        ${this._getRepaymentStatusSection(data)}
      </div>
    `;
  };

  _getPerformanceHTML = () => {
    if (!this.performanceData || !this.performanceData.data) {
      return `<div class="empty-state">No performance data available</div>`;
    }

    const data = this.performanceData.data;

    return /* html */ `
      <div class="dashboard-overview">
        ${this._getUserPerformanceSection(data.users || {})}
        ${this._getChamaPerformanceSection(data.chamas || {})}
        ${this._getAnalyticsBreakdownSection(data)}
      </div>
    `;
  };

  _getLoanOverviewSection = (data) => {
    const loans = data.loans || {};
    const rates = data.rates || {};

    return /* html */ `
      <!-- Loan Overview Section -->
      <div class="overview-section">
        <h3 class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;">
            <circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          Loan Portfolio Overview
        </h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Total Active Loans</div>
              <div class="stat-icon icon-total-loans">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-primary">${this.app.format(loans.total || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">Loans in portfolio</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Fully Repaid</div>
              <div class="stat-icon icon-fully-repaid">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 12l2 2 4-4"></path><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.35 0 4.48.9 6.08 2.38"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">${this.app.format(loans.fully || 0)}</div>
            <div class="stat-details">
              <span class="stat-success">${this.app.format(rates.full || 0)}% completion rate</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Partially Repaid</div>
              <div class="stat-icon icon-partial-repaid">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-warning">${this.app.format(loans.partial || 0)}</div>
            <div class="stat-details">
              <span class="stat-warning">${this.app.format(rates.partial || 0)}% of portfolio</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">No Repayment</div>
              <div class="stat-icon icon-no-repayment">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-error">${this.app.format(loans.none || 0)}</div>
            <div class="stat-details">
              <span class="stat-error">${this.app.format(rates.none || 0)}% unpaid</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  _getRepaymentStatusSection = (data) => {
    const repayments = data.repayments || {};

    return /* html */ `
      <!-- Repayment Status Section -->
      <div class="overview-section">
        <h3 class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;">
            <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          Repayment Transaction Status
        </h3>
        <div class="stats-grid">
          <div class="stat-card wide-card">
            <div class="stat-header">
              <div class="stat-title">Settled Repayments</div>
              <div class="stat-icon icon-settled">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">${this.app.format(repayments.settled || 0)}</div>
            <div class="stat-details">
              <span class="stat-success">Completed transactions</span> •
              <span class="stat-info">Ready to close</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Pending Repayments</div>
              <div class="stat-icon icon-pending">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-warning">${this.app.format(repayments.pending || 0)}</div>
            <div class="stat-details">
              <span class="stat-warning">Awaiting payment</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Default Cases</div>
              <div class="stat-icon icon-defaults">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-error">${this.app.format(repayments.defaults || 0)}</div>
            <div class="stat-details">
              <span class="stat-error">Require intervention</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  _getUserPerformanceSection = (users) => {
    const summary = users.summary || {};
    const rates = users.rates || {};
    const risk = users.risk || {};

    return /* html */ `
      <!-- User Performance Section -->
      <div class="overview-section start-section">
        <h3 class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
          </svg>
          User Performance Analytics
        </h3>
        <div class="stats-grid start">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Total Users</div>
              <div class="stat-icon icon-total-users">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-info">${this.app.format(summary.total || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">Active borrowers</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Users with Loans</div>
              <div class="stat-icon icon-users-loans">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-primary">${this.app.format(summary.loans || 0)}</div>
            <div class="stat-details">
              <span class="stat-primary">Have active loans</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Defaulted Users</div>
              <div class="stat-icon icon-defaulted-users">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 9s-1-1-3-1-3 1-3 1"></path><path d="M19 12l-1-1-3 3-1-1"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-error">${this.app.format(summary.defaulted || 0)}</div>
            <div class="stat-details">
              <span class="stat-error">Payment issues</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Overall Success Rate</div>
              <div class="stat-icon icon-overall-rate">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">${this.app.format(rates.overall || 0)}%</div>
            <div class="stat-details">
              <span class="stat-success">Payment success</span>
            </div>
          </div>
        </div>
        
        <!-- Risk Analysis -->
        <div class="demographic-container">
          <h4 class="demographic-title">
            <span class="demographic-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            </span>
            User Risk Distribution
          </h4>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-title">No Risk</div>
                <div class="stat-icon icon-no-risk">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path>
                  </svg>
                </div>
              </div>
              <div class="stat-value stat-success">${this.app.format(risk.none || 0)}</div>
              <div class="stat-details">
                <span class="stat-success">Excellent borrowers</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-title">Low Risk</div>
                <div class="stat-icon icon-low-risk">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
              </div>
              <div class="stat-value stat-info">${this.app.format(risk.low || 0)}</div>
              <div class="stat-details">
                <span class="stat-info">Good performers</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-title">Medium Risk</div>
                <div class="stat-icon icon-medium-risk">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M8 12h8"></path>
                  </svg>
                </div>
              </div>
              <div class="stat-value stat-warning">${this.app.format(risk.medium || 0)}</div>
              <div class="stat-details">
                <span class="stat-warning">Watch closely</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-title">High Risk</div>
                <div class="stat-icon icon-high-risk">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </div>
              </div>
              <div class="stat-value stat-error">${this.app.format(risk.high || 0)}</div>
              <div class="stat-details">
                <span class="stat-error">Needs attention</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  _getChamaPerformanceSection = (chamas) => {
    const summary = chamas.summary || {};
    const rates = chamas.rates || {};
    const risk = chamas.risk || {};

    return /* html */ `
      <!-- Chama Performance Section -->
      <div class="overview-section">
        <h3 class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="16" cy="7" r="2"></circle>
          </svg>
          Chama Performance Analytics
        </h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Total Chamas</div>
              <div class="stat-icon icon-total-chamas">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-info">${this.app.format(summary.total || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">Active groups</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Chamas with Loans</div>
              <div class="stat-icon icon-chamas-loans">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-primary">${this.app.format(summary.loans || 0)}</div>
            <div class="stat-details">
              <span class="stat-primary">Have outstanding loans</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Defaulted Chamas</div>
              <div class="stat-icon icon-defaulted-chamas">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-error">${this.app.format(summary.defaulted || 0)}</div>
            <div class="stat-details">
              <span class="stat-error">Payment challenges</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Group Success Rate</div>
              <div class="stat-icon icon-group-rate">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">${this.app.format(rates.overall || 0)}%</div>
            <div class="stat-details">
              <span class="stat-success">Average: ${this.app.format(rates.average || 0)}%</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  _getAnalyticsBreakdownSection = (data) => {
    const types = data.types || {};
    const intervals = data.intervals || {};
    const interest = data.interest || {};
    const duration = data.duration || {};

    return /* html */ `
      <!-- Analytics Breakdown Container -->
      <div class="demographic-container">
        <h4 class="demographic-title">
          <span class="demographic-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.06 1.56v.17a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.56-1.06H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1.06-1.56V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.06 1.56 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.56 1.06H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.56 1.06z"></path>
            </svg>
          </span>
          Performance Analytics Breakdown
        </h4>
        <div class="stats-grid">
          <!-- Loan Types Analysis -->
          <div class="stat-card wide-card">
            <div class="stat-header">
              <div class="stat-title">Loan Types Performance</div>
              <div class="stat-icon icon-loan-types">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(types.summary?.total || 0)} Types</div>
            <div class="stat-details">
              <span class="stat-info">${this.app.format(types.summary?.loans || 0)} loans</span> •
              <span class="stat-error">${this.app.format(types.summary?.defaulted || 0)} defaults</span> •
              <span class="stat-success">${this.app.format(types.rates?.overall || 0)}% success</span>
            </div>
          </div>
          
          <!-- Interest Rates Analysis -->
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Interest Rate Performance</div>
              <div class="stat-icon icon-interest">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-warning">${this.app.format(interest.rates?.avgrate || 0)}%</div>
            <div class="stat-details">
              <span class="stat-info">Average rate</span>
            </div>
          </div>
          
          <!-- Duration Analysis -->
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Average Duration</div>
              <div class="stat-icon icon-duration">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-primary">${this.app.format(duration.avgduration || 0)}</div>
            <div class="stat-details">
              <span class="stat-primary">Months average</span>
            </div>
          </div>
          
          <!-- Intervals Performance -->
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Payment Intervals</div>
              <div class="stat-icon icon-intervals">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(intervals.summary?.total || 0)}</div>
            <div class="stat-details">
              <span class="stat-success">${this.app.format(intervals.rates?.overall || 0)}% success</span>
            </div>
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

  getWrongMessage = () => {
    return /*html*/ `
      <div class="finish">
        <h2 class="finish__title">Something went wrong!</h2>
        <p class="desc">
         An error occurred while fetching the repayment data. Please check your connection and try again.
        </p>
        <button class="finish">Retry</button>
      </div>
    `;
  };

  // Utility methods for UI states
  _showLoader() {
    this.shadowRoot.innerHTML = `
      <div class="container">
        ${this.getLoader()}
      </div>
    `;
  }

  _showError(message) {
    this.shadowRoot.innerHTML = /* html */`
      <div class="container">
        <div class="finish">
          <h2 class="finish__title">Error Loading Repayment Data</h2>
          <p class="desc">${message}</p>
          <button class="finish" id="retry-btn">Try Again</button>
        </div>
      </div>
    `;

    const retryBtn = this.shadowRoot.getElementById('retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this._block = false;
        this._empty = false;
        this.fetchAllData();
      });
    }
  }

  _showEmptyState() {
    this.shadowRoot.innerHTML = /* html */`
      <div class="container">
        <div class="finish">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; color: var(--gray-color);">
            <circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <h2 class="finish__title">No Repayment Data</h2>
          <p class="desc">No repayment data available to display at this time.</p>
          <button class="finish" id="retry-btn">Refresh</button>
        </div>
      </div>
    `;

    const retryBtn = this.shadowRoot.getElementById('retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this._block = false;
        this._empty = false;
        this.fetchAllData();
      });
    }
  }

  _addStatCardListeners() {
    const statCards = this.shadowRoot.querySelectorAll('.stat-card');
    statCards.forEach(card => {
      card.addEventListener('click', () => {
        // Add click animation effect
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
          card.style.transform = '';
        }, 200);

        // Log interaction for debugging
        const titleElement = card.querySelector('.stat-title');
        const valueElement = card.querySelector('.stat-value');

        if (titleElement && valueElement) {
          const statName = titleElement.textContent.trim();
          const statValue = valueElement.textContent.trim();
          console.log(`Repayment Stat: ${statName}, Value: ${statValue}`);
        }
      });

      // Add keyboard support for accessibility
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });

      // Make cards focusable for accessibility
      card.setAttribute('tabindex', '0');
    });
  }

  getStyles = () => {
    return /* html */ `
      <style>
        :host {
          display: block;
          width: 100%;
          background-color: var(--background);
          font-family: var(--font-text), sans-serif;
          line-height: 1.6;
          color: var(--text-color);
        }

        * {
          box-sizing: border-box;
        }

        .header {
          display: flex;
          flex-direction: column;
          margin-bottom: 2rem;
          position: relative;
        }

        .breadcrumb {
          color: var(--text-color);
          display: flex;
          align-items: center;
          font-size: 2.2rem;
          font-weight: 600;
        }

        .breadcrumb-item {
          color: var(--text-muted);
          transition: color 0.2s ease;
        }

        .breadcrumb-item.active {
          color: var(--text-color);
          font-weight: 700;
          font-size: 2.2rem;
        }

        .breadcrumb-separator {
          margin: 0 0.75rem;
          color: var(--text-muted);
          font-size: 1.2rem;
        }

        .subtitle {
          color: var(--gray-color);
          margin: 0.5rem 0 0;
          padding: 0;
          font-size: 1rem;
          line-height: 1.5;
          opacity: 0.9;
        }

        /* Tab Navigation */
        .tab-navigation {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 2rem;
          background: var(--tab-background);
          border-radius: 16px;
          padding: 0.5rem;
          border: var(--border);
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.75rem;
          border: 2px solid transparent;
          border-radius: 12px;
          background: transparent;
          color: var(--text-color);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-weight: 600;
          font-size: 0.95rem;
          position: relative;
          flex: 1;
          justify-content: center;
          min-width: 160px;
        }

        .tab-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--accent-linear);
          border-radius: 10px;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .tab-button:hover {
          background: var(--hover-background);
          color: var(--title-color);
          transform: translateY(-2px);
          box-shadow: var(--card-box-shadow-alt);
          border-color: var(--accent-color);
        }

        .tab-button.active {
          background: var(--accent-linear);
          color: var(--white-color);
          border-color: var(--accent-alt);
          transform: translateY(-2px);
          box-shadow: var(--card-box-shadow);
          font-weight: 700;
        }

        .tab-button.active::before {
          opacity: 1;
        }

        .tab-button svg {
          width: 16px;
          height: 16px;
        }

        /* Tab Content */
        .tab-content {
          min-height: 400px;
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

        .container {
          max-width: 100%;
          margin: 0;
          padding: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          height: max-content;
        }

        @media (max-width: 768px) {
          .container {
            padding: 15px;
          }
        }

        /* Overview Sections */
        .overview-section {
          margin-bottom: 3rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--title-color);
          margin: 0 0 1.5rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--accent-color);
          position: relative;
        }

        .section-title::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 60px;
          height: 2px;
          background: var(--accent-linear);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Stat Cards */
        .stat-card {
          background-color: var(--stat-background);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: var(--card-box-shadow-alt);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(0, 96, 223, 0.1);
          cursor: pointer;
        }

        .stat-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--accent-linear);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--card-box-shadow);
          border-color: var(--accent-color);
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-card:active {
          transform: translateY(-4px) scale(0.98);
        }

        .highlight-card {
          background: linear-gradient(135deg, var(--accent-color), var(--accent-alt));
          color: var(--white-color);
          border-color: var(--accent-alt);
        }

        .highlight-card .stat-title,
        .highlight-card .stat-details {
          color: rgba(255, 255, 255, 0.9);
        }

        .highlight-card .stat-value {
          color: var(--white-color);
        }

        .wide-card {
          grid-column: span 2;
        }

        @media (max-width: 768px) {
          .wide-card {
            grid-column: span 1;
          }
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .stat-title {
          font-weight: 600;
          color: var(--label-color);
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.8;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white-color);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: rotate(0deg);
          transition: transform 0.3s ease;
        }

        .stat-card:hover .stat-icon {
          transform: rotate(8deg) scale(1.1);
        }

        /* Icon Color Themes - Repayment Specific */
        .icon-total-loans { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .icon-fully-repaid { background: linear-gradient(135deg, #10b981, #059669); }
        .icon-partial-repaid { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .icon-no-repayment { background: linear-gradient(135deg, #dc2626, #b91c1c); }
        .icon-settled { background: linear-gradient(135deg, #10b981, #047857); }
        .icon-pending { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .icon-defaults { background: linear-gradient(135deg, #dc2626, #b91c1c); }
        .icon-total-users { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .icon-users-loans { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .icon-defaulted-users { background: linear-gradient(135deg, #dc2626, #b91c1c); }
        .icon-overall-rate { background: linear-gradient(135deg, #06b6d4, #0891b2); }
        .icon-no-risk { background: linear-gradient(135deg, #10b981, #059669); }
        .icon-low-risk { background: linear-gradient(135deg, #06b6d4, #0891b2); }
        .icon-medium-risk { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .icon-high-risk { background: linear-gradient(135deg, #dc2626, #b91c1c); }
        .icon-total-chamas { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .icon-chamas-loans { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .icon-defaulted-chamas { background: linear-gradient(135deg, #dc2626, #b91c1c); }
        .icon-group-rate { background: linear-gradient(135deg, #10b981, #059669); }
        .icon-loan-types { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .icon-interest { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .icon-duration { background: linear-gradient(135deg, #06b6d4, #0891b2); }
        .icon-intervals { background: linear-gradient(135deg, #3b82f6, #2563eb); }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--title-color);
          margin-bottom: 1rem;
          font-family: var(--font-main), sans-serif;
          letter-spacing: -0.02em;
          line-height: 1;
          animation: countUp 0.6s ease-out;
        }

        .stat-value.positive {
          color: var(--success-color);
        }

        .stat-value.negative {
          color: var(--error-color);
        }

        .stat-details {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          flex-wrap: wrap;
          position: relative;
        }

        .stat-details::before {
          content: "";
          position: absolute;
          left: 0;
          top: -0.75rem;
          width: 40px;
          height: 3px;
          background: var(--accent-linear);
          opacity: 0.3;
          transition: width 0.3s ease, opacity 0.3s ease;
        }

        .stat-card:hover .stat-details::before {
          width: 60px;
          opacity: 0.6;
        }

        /* Status Colors */
        .stat-success {
          color: var(--success-color);
          font-weight: 600;
        }

        .stat-error {
          color: var(--error-color);
          font-weight: 600;
        }

        .stat-warning {
          color: var(--alt-color);
          font-weight: 600;
        }

        .stat-info {
          color: var(--accent-color);
          font-weight: 600;
        }

        .stat-primary {
          color: var(--accent-color);
          font-weight: 600;
        }

        .stat-secondary {
          color: var(--gray-color);
          font-weight: 500;
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

        /* Start Section */
        .start-section .stats-grid.start {
          margin-bottom: 3rem;
        }

        .demographic-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--title-color);
          margin: 0 0 1.5rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--accent-color);
        }

        .demographic-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: var(--accent-linear);
          color: var(--white-color);
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--gray-color);
          font-size: 1.1rem;
          background: var(--stat-background);
          border-radius: 12px;
          margin: 2rem 0;
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

          .tab-navigation {
            flex-direction: column;
            gap: 0.5rem;
            padding: 0.75rem;
          }

          .tab-button {
            justify-content: center;
            padding: 0.875rem 1.5rem;
            min-width: auto;
          }
        }

        @media (max-width: 480px) {
          .breadcrumb {
            font-size: 1.8rem;
          }

          .breadcrumb-item.active {
            font-size: 1.8rem;
          }

          .section-title {
            font-size: 1.25rem;
          }

          .stat-value {
            font-size: 1.75rem;
          }

          .stat-card {
            padding: 1.25rem;
          }

          .tab-navigation {
            margin-bottom: 1.5rem;
          }

          .tab-button {
            padding: 1rem 1.25rem;
            font-size: 0.9rem;
            font-weight: 600;
          }

          .tab-button svg {
            width: 18px;
            height: 18px;
          }
        }

        /* Accessibility */
        .stat-card:focus {
          outline: 2px solid var(--accent-color);
          outline-offset: 2px;
        }

        .tab-button:focus {
          outline: 2px solid var(--accent-color);
          outline-offset: 2px;
        }

        button.finish:focus {
          outline: 2px solid var(--accent-color);
          outline-offset: 2px;
        }

        /* Animation for value changes */
        @keyframes countUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Dashboard Overview */
        .dashboard-overview {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
      </style>`;
  };
}
