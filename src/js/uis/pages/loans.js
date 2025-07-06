export default class Loans extends HTMLElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.app = window.app;
    this.api = this.app.api;
    this.baseUrl = this.getAttribute("api") || "/stats/loans/overview";
    this.loansData = null;
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
    this.fetchLoansData();
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

  fetchLoansData = async () => {
    this._loading = true;
    this._block = true;
    this.render();

    try {
      const response = await this.api.get(this.baseUrl, { content: "json" });

      // Check authentication
      if (
        response.status_code === 401 ||
        (response.error_message &&
          response.error_message.includes("validate credentials"))
      ) {
        console.log("Authentication required for loans access");
        this._loading = false;
        this.app.showAccess();
        return;
      }

      if (!response.success || !response.data) {
        this._empty = true;
        this._loading = false;
        this.loansData = null;
        this.render();
        this.activateRefresh();
        return;
      }

      this._loading = false;
      this._block = false;
      this._empty = false;

      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('dev')) {
        console.log('Loans data:', response.data);
      }

      this.loansData = response;
      this.render();
      this._addStatCardListeners();
    } catch (error) {
      console.error("Error fetching loans data:", error);

      if (
        error.status === 401 ||
        (error.response && error.response.status === 401)
      ) {
        console.log("Authentication required for loans access");
        this._loading = false;
        this.app.showLogin();
        return;
      }

      this._loading = false;
      this._empty = true;
      this.loansData = null;
      this.render();
      this.activateRefresh();
    }
  };

  activateRefresh = () => {
    const retryBtn = this.shadowObj.querySelector("button.finish");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        this._block = false;
        this._empty = false;
        this.fetchLoansData();
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

    if (this._empty || !this.loansData) {
      return /* html */ `<div class="container">${this.getWrongMessage()}</div>`;
    }

    return /* html */ `
      <div class="container">
        <div class="header">
          <div class="breadcrumb">
            <span class="breadcrumb-item">Stats</span>
            <span class="breadcrumb-separator">|</span>
            <span class="breadcrumb-item active">Loans</span>
          </div>
          <p class="subtitle">Comprehensive loan analytics, performance tracking, and risk assessment insights</p>
        </div>
        
        <div class="dashboard-overview">
          ${this._getLoansHTML()}
        </div>
      </div>
    `;
  };

  _getLoansHTML = () => {
    const data = this.loansData.data;

    return /* html */ `
      <!-- Main Dashboard Grid -->
      <div class="loans-dashboard">
        <!-- Summary Header Cards -->
        <div class="summary-header">
          ${this._getSummaryCards(data)}
        </div>
        
        <!-- Analysis Cards -->
        ${this._getTypesAnalysis(data.types || {}, data.distribution || {})}
        ${this._getRepaymentsOverview(data.repayments || {})}
        ${this._getDefaultsAnalysis(data.defaults || {})}
        
        <!-- Full Width Performance Section -->
        ${this._getPerformanceMetrics(data.performance || {})}
        
        <!-- Bottom Section -->
        <div class="bottom-section">
          ${this._getInterestAnalysis(data.interest || {})}
        </div>
      </div>
    `;
  };

  _getSummaryCards = (data) => {
    const types = data.types || {};
    const defaults = data.defaults || {};
    const performance = data.performance || {};

    const totalLoans = types.loans || 0;
    const totalPrincipal = types.principal || 0;
    const defaultRate = defaults.bychama?.rate || 0;
    const overdueLoans = performance.overdue?.loans || 0;

    return /* html */ `
      <div class="summary-card primary-card">
        <div class="card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </div>
        <div class="card-content">
          <h3 class="card-title">Total Loans</h3>
          <div class="card-value">${this.app.format(totalLoans)}</div>
          <div class="card-subtitle">Active loan accounts</div>
        </div>
      </div>

      <div class="summary-card success-card">
        <div class="card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <div class="card-content">
          <h3 class="card-title">Total Principal</h3>
          <div class="card-value">KES ${this.app.format(totalPrincipal)}</div>
          <div class="card-subtitle">Outstanding loan amount</div>
        </div>
      </div>

      <div class="summary-card ${defaultRate >= 50 ? 'danger-card' : defaultRate >= 25 ? 'warning-card' : 'success-card'}">
        <div class="card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div class="card-content">
          <h3 class="card-title">Default Rate</h3>
          <div class="card-value">${this.app.format(defaultRate)}%</div>
          <div class="card-subtitle">${this._getDefaultStatus(defaultRate)}</div>
        </div>
      </div>

      <div class="summary-card ${overdueLoans > 0 ? 'warning-card' : 'success-card'}">
        <div class="card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>
          </svg>
        </div>
        <div class="card-content">
          <h3 class="card-title">Overdue Loans</h3>
          <div class="card-value">${this.app.format(overdueLoans)}</div>
          <div class="card-subtitle">${overdueLoans > 0 ? 'Require attention' : 'No overdue loans'}</div>
        </div>
      </div>
    `;
  };

  _getTypesAnalysis = (types, distribution) => {
    return /* html */ `
      <div class="analysis-card">
        <div class="card-header">
          <h3 class="card-title">
            <span class="title-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 7V4a2 2 0 0 1 2-2h8m-4 0L14 7m-4 0L6 4m4 0h8a2 2 0 0 1 2 2v3M4 7v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7"></path>
              </svg>
            </span>
            Loan Types & Distribution
          </h3>
        </div>
        <div class="metrics-grid">
          <div class="metric-item">
            <div class="metric-label">Loan Types</div>
            <div class="metric-value">${this.app.format(types.totaltypes || 0)}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">Active Loans</div>
            <div class="metric-value">${this.app.format(types.loans || 0)}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">Avg Principal</div>
            <div class="metric-value">KES ${this.app.format(types.avgprincipal || 0)}</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">Distribution Ranges</div>
            <div class="metric-value">${this.app.format(distribution.totalranges || 0)}</div>
          </div>
        </div>
        <div class="distribution-info">
          <div class="info-row">
            <span class="info-label">Distribution Principal:</span>
            <span class="info-value">KES ${this.app.format(distribution.principal || 0)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Avg per Range:</span>
            <span class="info-value">KES ${this.app.format(distribution.avgprincipal || 0)}</span>
          </div>
        </div>
      </div>
    `;
  };

  _getRepaymentsOverview = (repayments) => {
    const repaidAmount = repayments.repaid || 0;
    const pendingCount = repayments.pending || 0;
    const defaultsCount = repayments.defaults || 0;
    const totalLoans = repayments.loans || 0;

    return /* html */ `
      <div class="analysis-card">
        <div class="card-header">
          <h3 class="card-title">
            <span class="title-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 12l2 2 4-4"></path><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.35 0 4.48.9 6.08 2.38"></path>
              </svg>
            </span>
            Repayments Overview
          </h3>
        </div>
        <div class="repayment-stats">
          <div class="repayment-main">
            <div class="repayment-amount">
              <div class="amount-label">Total Repaid</div>
              <div class="amount-value success">KES ${this.app.format(repaidAmount)}</div>
            </div>
          </div>
          <div class="repayment-breakdown">
            <div class="breakdown-item">
              <div class="breakdown-icon pending">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>
                </svg>
              </div>
              <div class="breakdown-content">
                <div class="breakdown-value">${this.app.format(pendingCount)}</div>
                <div class="breakdown-label">Pending</div>
              </div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-icon success">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 12l2 2 4-4"></path><circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <div class="breakdown-content">
                <div class="breakdown-value">${this.app.format(defaultsCount)}</div>
                <div class="breakdown-label">Defaults</div>
              </div>
            </div>
            <div class="breakdown-item">
              <div class="breakdown-icon primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <div class="breakdown-content">
                <div class="breakdown-value">${this.app.format(totalLoans)}</div>
                <div class="breakdown-label">Total Loans</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  _getDefaultsAnalysis = (defaults) => {
    const bytype = defaults.bytype || [];
    const bychama = defaults.bychama || {};

    return /* html */ `
      <div class="analysis-card danger-theme">
        <div class="card-header">
          <h3 class="card-title">
            <span class="title-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </span>
            Defaults Analysis
          </h3>
        </div>
        
        <!-- Overall Default Summary -->
        <div class="default-summary">
          <div class="summary-row main-summary">
            <div class="summary-label">Overall Default Rate</div>
            <div class="summary-value danger">${this.app.format(bychama.rate || 0)}%</div>
          </div>
          <div class="summary-details">
            <div class="detail-item">
              <span class="detail-label">Affected Chamas:</span>
              <span class="detail-value">${this.app.format(bychama.chamas || 0)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Defaulted Loans:</span>
              <span class="detail-value">${this.app.format(bychama.loans?.defaults || 0)}/${this.app.format(bychama.loans?.total || 0)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Total Unpaid:</span>
              <span class="detail-value">KES ${this.app.format(bychama.amounts?.unpaid || 0)}</span>
            </div>
          </div>
        </div>

        <!-- By Type Breakdown -->
        <div class="type-breakdown">
          <h4 class="breakdown-title">Defaults by Loan Type</h4>
          <div class="type-list">
            ${bytype.map(type => `
              <div class="type-item">
                <div class="type-header">
                  <div class="type-name">${type.type.charAt(0).toUpperCase() + type.type.slice(1)} Loans</div>
                  <div class="type-rate ${this._getDefaultRateClass(type.rate)}">${this.app.format(type.rate || 0)}%</div>
                </div>
                <div class="type-details">
                  <div class="type-detail">
                    <span class="detail-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>
                      </svg>
                    </span>
                    <span class="detail-text">${this.app.format(type.loans?.defaults || 0)} of ${this.app.format(type.loans?.total || 0)} loans</span>
                  </div>
                  <div class="type-detail">
                    <span class="detail-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </span>
                    <span class="detail-text">KES ${this.app.format(type.amounts?.unpaid || 0)} unpaid</span>
                  </div>
                  <div class="type-detail">
                    <span class="detail-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 20a7 7 0 0 1 14 0"></path><circle cx="10" cy="8" r="4"></circle><path d="M21 20a7 7 0 0 0-7-7"></path><circle cx="17" cy="8" r="2"></circle>
                      </svg>
                    </span>
                    <span class="detail-text">KES ${this.app.format(type.amounts?.principal || 0)} principal</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  };

  _getPerformanceMetrics = (performance) => {
    const ratio = performance.ratio || {};
    const duration = performance.duration || {};
    const overdue = performance.overdue || {};

    return /* html */ `
      <div class="analysis-card full-width performance-metrics-card">
        <div class="card-header">
          <h3 class="card-title">
            <span class="title-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
              </svg>
            </span>
            Performance Metrics
          </h3>
        </div>

        <!-- Performance Grid Layout -->
        <div class="performance-grid">
          <!-- Loan-to-Contribution Ratio Section -->
          <div class="performance-card ratio-card">
            <div class="performance-header">
              <div class="performance-icon ratio-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 12h18m-9-9v18"></path>
                </svg>
              </div>
              <div class="performance-title">Loan/Contribution Ratio</div>
            </div>
            <div class="ratio-main-value">${this.app.format(ratio.avgratio || 0)}</div>
            <div class="ratio-stats">
              <div class="ratio-stat">
                <div class="stat-label">Contributions</div>
                <div class="stat-value success">KES ${this.app.format(ratio.contributions || 0)}</div>
              </div>
              <div class="ratio-stat">
                <div class="stat-label">Loans</div>
                <div class="stat-value warning">KES ${this.app.format(ratio.loans || 0)}</div>
              </div>
              <div class="ratio-stat">
                <div class="stat-label">Chamas</div>
                <div class="stat-value primary">${this.app.format(ratio.chamas || 0)}</div>
              </div>
            </div>
          </div>

          <!-- Duration Analysis Section -->
          <div class="performance-card duration-card">
            <div class="performance-header">
              <div class="performance-icon duration-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline>
                </svg>
              </div>
              <div class="performance-title">Duration Analysis</div>
            </div>
            <div class="duration-main-value">${this.app.format(duration.avgdays || 0)} <span class="value-unit">days</span></div>
            <div class="duration-stats">
              <div class="duration-stat">
                <div class="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9,10 4,15 9,20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
                  </svg>
                </div>
                <div class="stat-content">
                  <div class="stat-label">Minimum</div>
                  <div class="stat-value">${this.app.format(duration.mindays || 0)} days</div>
                </div>
              </div>
              <div class="duration-stat">
                <div class="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15,10 20,15 15,20"></polyline><path d="M4 4v7a4 4 0 0 0 4 4h12"></path>
                  </svg>
                </div>
                <div class="stat-content">
                  <div class="stat-label">Maximum</div>
                  <div class="stat-value">${this.app.format(duration.maxdays || 0)} days</div>
                </div>
              </div>
              <div class="duration-stat">
                <div class="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <div class="stat-content">
                  <div class="stat-label">Total Loans</div>
                  <div class="stat-value">${this.app.format(duration.loans || 0)}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Overdue Analysis Section -->
          <div class="performance-card overdue-card ${overdue.loans > 0 ? 'has-overdue' : 'no-overdue'}">
            <div class="performance-header">
              <div class="performance-icon overdue-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  ${overdue.loans > 0 ?
        '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>' :
        '<path d="M9 12l2 2 4-4"></path><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.35 0 4.48.9 6.08 2.38"></path>'
      }
                </svg>
              </div>
              <div class="performance-title">Overdue Status</div>
            </div>
            
            ${overdue.loans > 0 ? `
              <div class="overdue-main-value danger">${this.app.format(overdue.loans)} <span class="value-unit">loans</span></div>
              <div class="overdue-stats">
                <div class="overdue-summary">
                  <div class="summary-item">
                    <div class="summary-label">Outstanding Amount</div>
                    <div class="summary-value danger">KES ${this.app.format(overdue.outstanding || 0)}</div>
                  </div>
                  <div class="summary-item">
                    <div class="summary-label">Average Overdue Period</div>
                    <div class="summary-value warning">${this.app.format(overdue.avgdays || 0)} days</div>
                  </div>
                </div>
                <div class="overdue-range">
                  <div class="range-indicator">
                    <div class="range-label">Overdue Range</div>
                    <div class="range-display">
                      <span class="range-min">${this.app.format(overdue.mindays || 0)}</span>
                      <div class="range-line"></div>
                      <span class="range-max">${this.app.format(overdue.maxdays || 0)}</span>
                    </div>
                    <div class="range-unit">days</div>
                  </div>
                </div>
              </div>
            ` : `
              <div class="overdue-main-value success">0 <span class="value-unit">loans</span></div>
              <div class="success-status">
                <div class="success-indicator">
                  <div class="success-icon-large">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 12l2 2 4-4"></path><circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  </div>
                  <div class="success-text">
                    <div class="success-title">All loans are current</div>
                    <div class="success-subtitle">No overdue payments detected</div>
                  </div>
                </div>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  };

  _getInterestAnalysis = (interest) => {
    return /* html */ `
      <div class="analysis-card full-width">
        <div class="card-header">
          <h3 class="card-title">
            <span class="title-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle>
              </svg>
            </span>
            Interest & Penalty Analysis
          </h3>
        </div>
        
        <div class="interest-grid">
          <div class="interest-card">
            <div class="interest-header">
              <div class="interest-title">Interest Plans</div>
              <div class="interest-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline>
                </svg>
              </div>
            </div>
            <div class="interest-value">${this.app.format(interest.totalplans || 0)}</div>
            <div class="interest-subtitle">Total plans available</div>
          </div>

          <div class="interest-card">
            <div class="interest-header">
              <div class="interest-title">Average Interest</div>
              <div class="interest-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>
                </svg>
              </div>
            </div>
            <div class="interest-value warning">${this.app.format(interest.avginterest || 0)}%</div>
            <div class="interest-subtitle">Annual interest rate</div>
          </div>

          <div class="interest-card">
            <div class="interest-header">
              <div class="interest-title">Average Penalty</div>
              <div class="interest-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
            </div>
            <div class="interest-value danger">${this.app.format(interest.avgpenalty || 0)}%</div>
            <div class="interest-subtitle">Late payment penalty</div>
          </div>

          <div class="interest-card">
            <div class="interest-header">
              <div class="interest-title">Average Duration</div>
              <div class="interest-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline>
                </svg>
              </div>
            </div>
            <div class="interest-value">${this.app.format(interest.avgduration || 0)}</div>
            <div class="interest-subtitle">Days per loan</div>
          </div>

          <div class="interest-card">
            <div class="interest-header">
              <div class="interest-title">Active Loans</div>
              <div class="interest-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
            </div>
            <div class="interest-value primary">${this.app.format(interest.loans || 0)}</div>
            <div class="interest-subtitle">Currently active</div>
          </div>

          <div class="interest-card">
            <div class="interest-header">
              <div class="interest-title">Principal Amount</div>
              <div class="interest-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
            </div>
            <div class="interest-value success">KES ${this.app.format(interest.principal || 0)}</div>
            <div class="interest-subtitle">Total principal</div>
          </div>
        </div>
      </div>
    `;
  };

  // Helper methods
  _getDefaultStatus = (rate) => {
    if (rate >= 50) return 'Critical risk';
    if (rate >= 25) return 'High risk';
    if (rate >= 10) return 'Medium risk';
    return 'Low risk';
  };

  _getDefaultRateClass = (rate) => {
    if (rate >= 70) return 'danger';
    if (rate >= 40) return 'warning';
    return 'success';
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
         An error occurred while fetching the loans data. Please check your connection and try again.
        </p>
        <button class="finish">Retry</button>
      </div>
    `;
  };

  // Utility methods for UI states
  _showLoader() {
    this.shadowObj.innerHTML = `
      <div class="container">
        ${this.getLoader()}
      </div>
    `;
  }

  _showError(message) {
    this.shadowObj.innerHTML = `
      <div class="container">
        <div class="finish">
          <h2 class="finish__title">Error Loading Loans Data</h2>
          <p class="desc">${message}</p>
          <button class="finish" id="retry-btn">Try Again</button>
        </div>
      </div>
    `;

    const retryBtn = this.shadowObj.getElementById('retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this._block = false;
        this._empty = false;
        this.fetchLoansData();
      });
    }
  }

  _showEmptyState() {
    this.shadowObj.innerHTML = `
      <div class="container">
        <div class="finish">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; color: var(--gray-color);">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          <h2 class="finish__title">No Loans Data</h2>
          <p class="desc">No loan data available to display at this time.</p>
          <button class="finish" id="retry-btn">Refresh</button>
        </div>
      </div>
    `;

    const retryBtn = this.shadowObj.getElementById('retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this._block = false;
        this._empty = false;
        this.fetchLoansData();
      });
    }
  }

  _addStatCardListeners() {
    const interactiveElements = this.shadowObj.querySelectorAll('.summary-card, .analysis-card, .metric-item, .interest-card');
    interactiveElements.forEach(element => {
      element.addEventListener('click', () => {
        // Add click animation effect
        element.style.transform = 'scale(0.98)';
        setTimeout(() => {
          element.style.transform = '';
        }, 200);

        // Log interaction for debugging
        const titleElement = element.querySelector('.card-title, .metric-label, .interest-title');
        const valueElement = element.querySelector('.card-value, .metric-value, .interest-value');

        if (titleElement && valueElement) {
          const statName = titleElement.textContent.trim();
          const statValue = valueElement.textContent.trim();
          console.log(`Loans Stat: ${statName}, Value: ${statValue}`);
        }
      });

      // Add keyboard support for accessibility
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });

      // Make cards focusable for accessibility
      element.setAttribute('tabindex', '0');
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

        /* Dashboard Layout */
        .loans-dashboard {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* Summary Header */
        .summary-header {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .summary-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border-radius: 16px;
          background: var(--stat-background);
          border: 2px solid transparent;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .summary-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .summary-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--card-box-shadow);
        }

        .summary-card:hover::before {
          opacity: 1;
        }

        .primary-card { border-color: var(--accent-color); }
        .primary-card::before { background: var(--accent-linear); }
        .primary-card .card-icon { background: var(--accent-linear); }

        .success-card { border-color: var(--success-color); }
        .success-card::before { background: linear-gradient(135deg, #10b981, #059669); }
        .success-card .card-icon { background: linear-gradient(135deg, #10b981, #059669); }

        .warning-card { border-color: var(--alt-color); }
        .warning-card::before { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .warning-card .card-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }

        .danger-card { border-color: var(--error-color); }
        .danger-card::before { background: linear-gradient(135deg, #dc2626, #b91c1c); }
        .danger-card .card-icon { background: linear-gradient(135deg, #dc2626, #b91c1c); }

        .card-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white-color);
          flex-shrink: 0;
        }

        .card-content {
          flex: 1;
        }

        .card-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-color);
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--title-color);
          margin: 0 0 0.25rem 0;
          font-family: var(--font-main), sans-serif;
          line-height: 1;
        }

        .card-subtitle {
          font-size: 0.875rem;
          color: var(--gray-color);
          margin: 0;
        }

        /* Analysis Cards Container */
        .loans-dashboard > .analysis-card {
          margin-bottom: 2rem;
        }

        /* Analysis Cards */
        .analysis-card {
          background: var(--stat-background);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid var(--border);
          transition: all 0.3s ease;
          flex: 1 1 auto;
          min-width: 300px;
        }

        .analysis-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--card-box-shadow-alt);
        }

        .danger-theme {
          border-color: rgba(220, 38, 38, 0.2);
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.05), var(--stat-background));
        }

        .card-header {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--title-color);
          margin: 0;
        }

        .title-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: var(--accent-linear);
          color: var(--white-color);
        }

        /* Metrics Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .metric-item {
          text-align: center;
          padding: 1rem;
          background: var(--background);
          border-radius: 8px;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .metric-item:hover {
          background: var(--hover-background);
          transform: translateY(-1px);
        }

        .metric-label {
          font-size: 0.75rem;
          color: var(--gray-color);
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--title-color);
          font-family: var(--font-main), sans-serif;
        }

        /* Distribution Info */
        .distribution-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
        }

        .info-label {
          font-size: 0.875rem;
          color: var(--gray-color);
        }

        .info-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--title-color);
        }

        /* Repayments Overview */
        .repayment-stats {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .repayment-main {
          text-align: center;
          padding: 1.5rem;
          background: var(--background);
          border-radius: 12px;
          border: 2px solid var(--success-color);
        }

        .amount-label {
          font-size: 0.875rem;
          color: var(--gray-color);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .amount-value {
          font-size: 2rem;
          font-weight: 700;
          font-family: var(--font-main), sans-serif;
          line-height: 1;
        }

        .repayment-breakdown {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .breakdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: var(--background);
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .breakdown-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white-color);
          flex-shrink: 0;
        }

        .breakdown-icon.pending { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .breakdown-icon.success { background: linear-gradient(135deg, #10b981, #059669); }
        .breakdown-icon.primary { background: var(--accent-linear); }

        .breakdown-content {
          flex: 1;
        }

        .breakdown-value {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--title-color);
          margin-bottom: 0.125rem;
        }

        .breakdown-label {
          font-size: 0.75rem;
          color: var(--gray-color);
          text-transform: uppercase;
        }

        /* Default Analysis */
        .default-summary {
          margin-bottom: 1.5rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .main-summary {
          padding: 1rem;
          background: rgba(220, 38, 38, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(220, 38, 38, 0.2);
        }

        .summary-label {
          font-size: 1rem;
          color: var(--error-color);
          font-weight: 600;
        }

        .summary-value {
          font-size: 2rem;
          font-weight: 700;
          font-family: var(--font-main), sans-serif;
        }

        .summary-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 1rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: var(--background);
          border-radius: 6px;
          border: 1px solid var(--border);
        }

        .detail-label {
          font-size: 0.75rem;
          color: var(--gray-color);
          text-transform: uppercase;
        }

        .detail-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--title-color);
        }

        /* Type Breakdown */
        .breakdown-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--title-color);
          margin: 0 0 1rem 0;
        }

        .type-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .type-item {
          padding: 1rem;
          background: var(--background);
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .type-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .type-name {
          font-weight: 600;
          color: var(--title-color);
        }

        .type-rate {
          font-size: 1.25rem;
          font-weight: 700;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-family: var(--font-main), sans-serif;
        }

        .type-rate.success {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success-color);
        }

        .type-rate.warning {
          background: rgba(245, 158, 11, 0.1);
          color: var(--alt-color);
        }

        .type-rate.danger {
          background: rgba(220, 38, 38, 0.1);
          color: var(--error-color);
        }

        .type-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .type-detail {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .detail-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 4px;
          background: var(--accent-linear);
          color: var(--white-color);
          flex-shrink: 0;
        }

        .detail-text {
          color: var(--text-color);
        }

        /* Performance Metrics */
        .performance-metrics-card {
          margin-top: 2rem;
        }

        .performance-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 2rem;
        }

        .performance-card {
          padding: 2rem;
          background: var(--background);
          border-radius: 16px;
          border: 2px solid var(--border);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .performance-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .performance-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--card-box-shadow);
        }

        .performance-card:hover::before {
          opacity: 1;
        }

        .ratio-card {
          border-color: var(--accent-color);
        }

        .ratio-card::before {
          background: var(--accent-linear);
        }

        .duration-card {
          border-color: var(--success-color);
        }

        .duration-card::before {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .overdue-card.has-overdue {
          border-color: var(--error-color);
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.05), var(--background));
        }

        .overdue-card.has-overdue::before {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
        }

        .overdue-card.no-overdue {
          border-color: var(--success-color);
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), var(--background));
        }

        .overdue-card.no-overdue::before {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .performance-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .performance-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white-color);
          flex-shrink: 0;
        }

        .ratio-icon {
          background: var(--accent-linear);
        }

        .duration-icon {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .overdue-icon {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
        }

        .overdue-card.no-overdue .overdue-icon {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .performance-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--title-color);
        }

        /* Ratio Section */
        .ratio-main-value {
          font-size: 4rem;
          font-weight: 700;
          color: var(--accent-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1;
          text-align: center;
          margin-bottom: 2rem;
        }

        .ratio-stats {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .ratio-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--stat-background);
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .ratio-stat .stat-label {
          font-size: 0.875rem;
          color: var(--gray-color);
          font-weight: 500;
        }

        .ratio-stat .stat-value {
          font-size: 1rem;
          font-weight: 700;
          font-family: var(--font-main), sans-serif;
        }

        /* Duration Section */
        .duration-main-value {
          font-size: 3rem;
          font-weight: 700;
          color: var(--success-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1;
          text-align: center;
          margin-bottom: 2rem;
        }

        .value-unit {
          font-size: 1.5rem;
          font-weight: 500;
          color: var(--gray-color);
        }

        .duration-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .duration-stat {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--stat-background);
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .duration-stat .stat-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--accent-linear);
          color: var(--white-color);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .duration-stat .stat-content {
          flex: 1;
        }

        .duration-stat .stat-label {
          font-size: 0.75rem;
          color: var(--gray-color);
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .duration-stat .stat-value {
          font-size: 1rem;
          font-weight: 700;
          color: var(--title-color);
          font-family: var(--font-main), sans-serif;
        }

        /* Overdue Section */
        .overdue-main-value {
          font-size: 3rem;
          font-weight: 700;
          font-family: var(--font-main), sans-serif;
          line-height: 1;
          text-align: center;
          margin-bottom: 2rem;
        }

        .overdue-main-value.danger {
          color: var(--error-color);
        }

        .overdue-main-value.success {
          color: var(--success-color);
        }

        .overdue-stats {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .overdue-summary {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--stat-background);
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .summary-label {
          font-size: 0.875rem;
          color: var(--gray-color);
          font-weight: 500;
        }

        .summary-value {
          font-size: 1rem;
          font-weight: 700;
          font-family: var(--font-main), sans-serif;
        }

        .summary-value.danger {
          color: var(--error-color);
        }

        .summary-value.warning {
          color: var(--alt-color);
        }

        .overdue-range {
          padding: 1.5rem;
          background: var(--stat-background);
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .range-indicator {
          text-align: center;
        }

        .range-label {
          font-size: 0.875rem;
          color: var(--gray-color);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .range-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .range-min,
        .range-max {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--error-color);
          font-family: var(--font-main), sans-serif;
        }

        .range-line {
          flex: 1;
          height: 3px;
          background: linear-gradient(to right, var(--error-color), var(--alt-color));
          border-radius: 2px;
          position: relative;
        }

        .range-line::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          background: var(--error-color);
          border-radius: 50%;
        }

        .range-line::after {
          content: "";
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          background: var(--alt-color);
          border-radius: 50%;
        }

        .range-unit {
          font-size: 0.875rem;
          color: var(--gray-color);
        }

        /* Success Status */
        .success-status {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .success-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .success-icon-large {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          color: var(--white-color);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .success-text {
          text-align: center;
        }

        .success-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--success-color);
          margin-bottom: 0.5rem;
        }

        .success-subtitle {
          font-size: 0.875rem;
          color: var(--gray-color);
        }

        /* Interest Analysis */
        .full-width {
          grid-column: 1 / -1;
        }

        .interest-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .interest-card {
          padding: 1.5rem;
          background: var(--background);
          border-radius: 12px;
          border: 1px solid var(--border);
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .interest-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--card-box-shadow-alt);
        }

        .interest-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .interest-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-color);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .interest-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--accent-linear);
          color: var(--white-color);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .interest-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--title-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .interest-subtitle {
          font-size: 0.875rem;
          color: var(--gray-color);
        }

        /* Status Colors */
        .success { color: var(--success-color); }
        .warning { color: var(--alt-color); }
        .danger { color: var(--error-color); }
        .primary { color: var(--accent-color); }

        /* Bottom Section */
        .bottom-section {
          margin-top: 1rem;
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
        @media (max-width: 1024px) {
          .performance-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .interest-grid {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 15px;
          }

          .summary-header {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
          }

          .summary-card {
            padding: 1.25rem;
          }

          .card-value {
            font-size: 1.75rem;
          }

          .performance-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .performance-card {
            padding: 1.5rem;
          }

          .ratio-main-value {
            font-size: 3rem;
          }

          .duration-main-value,
          .overdue-main-value {
            font-size: 2.5rem;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .repayment-breakdown {
            grid-template-columns: 1fr;
          }

          .summary-details,
          .ratio-breakdown,
          .duration-range,
          .alert-details {
            grid-template-columns: 1fr;
          }

          .interest-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .overdue-summary {
            grid-template-columns: 1fr;
          }

          .range-display {
            flex-direction: column;
            gap: 0.5rem;
          }

          .range-line {
            width: 100%;
            height: 2px;
          }
        }

        @media (max-width: 480px) {
          .breadcrumb {
            font-size: 1.8rem;
          }

          .breadcrumb-item.active {
            font-size: 1.8rem;
          }

          .summary-header {
            grid-template-columns: 1fr;
          }

          .card-value {
            font-size: 1.5rem;
          }

          .performance-card {
            padding: 1.25rem;
          }

          .ratio-main-value {
            font-size: 2.5rem;
          }

          .duration-main-value,
          .overdue-main-value {
            font-size: 2rem;
          }

          .value-unit {
            font-size: 1rem;
          }

          .performance-header {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
          }

          .performance-icon {
            width: 40px;
            height: 40px;
          }

          .interest-grid {
            grid-template-columns: 1fr;
          }

          .range-min,
          .range-max {
            font-size: 1rem;
          }

          .success-icon-large {
            width: 48px;
            height: 48px;
          }
        }

        /* Accessibility */
        .summary-card:focus,
        .analysis-card:focus,
        .metric-item:focus,
        .interest-card:focus {
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

        .card-value,
        .metric-value,
        .interest-value {
          animation: countUp 0.6s ease-out;
        }
      </style>`;
  };
}
