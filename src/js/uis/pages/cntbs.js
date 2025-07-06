export default class Contributions extends HTMLElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.app = window.app;
    this.api = this.app.api;
    this.baseUrl = this.getAttribute("api") || "/stats/cntbs";
    this.overviewData = null;
    this.complianceData = null;
    this.activeTab = "overview"; // default tab
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
      // Fetch both overview and compliance data in parallel
      const [overviewResponse, complianceResponse] = await Promise.all([
        this.api.get(`${this.baseUrl}/overview`, { content: "json" }),
        this.api.get(`${this.baseUrl}/compliance`, { content: "json" })
      ]);

      // Check authentication for overview
      if (
        overviewResponse.status_code === 401 ||
        (overviewResponse.error_message &&
          overviewResponse.error_message.includes("validate credentials"))
      ) {
        console.log("Authentication required for contributions access");
        this._loading = false;
        this.app.showAccess();
        return;
      }

      // Check authentication for compliance
      if (
        complianceResponse.status_code === 401 ||
        (complianceResponse.error_message &&
          complianceResponse.error_message.includes("validate credentials"))
      ) {
        console.log("Authentication required for contributions access");
        this._loading = false;
        this.app.showAccess();
        return;
      }

      if (!overviewResponse.success || !overviewResponse.data ||
        !complianceResponse.success || !complianceResponse.data) {
        this._empty = true;
        this._loading = false;
        this.overviewData = null;
        this.complianceData = null;
        this.render();
        this.activateRefresh();
        return;
      }

      this._loading = false;
      this._block = false;
      this._empty = false;

      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('dev')) {
        console.log('Contributions Overview data:', overviewResponse.data);
        console.log('Contributions Compliance data:', complianceResponse.data);
      }

      this.overviewData = overviewResponse;
      this.complianceData = complianceResponse;
      this.render();
      this._addTabListeners();
      this._addStatCardListeners();
    } catch (error) {
      console.error("Error fetching contributions data:", error);

      if (
        error.status === 401 ||
        (error.response && error.response.status === 401)
      ) {
        console.log("Authentication required for contributions access");
        this._loading = false;
        this.app.showLogin();
        return;
      }

      this._loading = false;
      this._empty = true;
      this.overviewData = null;
      this.complianceData = null;
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

    if (this._empty || (!this.overviewData && !this.complianceData)) {
      return /* html */ `<div class="container">${this.getWrongMessage()}</div>`;
    }

    return /* html */ `
      <div class="container">
        <div class="header">
          <div class="breadcrumb">
            <span class="breadcrumb-item">Stats</span>
            <span class="breadcrumb-separator">|</span>
            <span class="breadcrumb-item active">Contributions</span>
          </div>
          <p class="subtitle">Comprehensive contributions analytics, compliance tracking, and performance insights</p>
        </div>
        
        <!-- Tab Navigation -->
        <div class="tab-navigation">
          <button class="tab-button ${this.activeTab === 'overview' ? 'active' : ''}" data-tab="overview">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            Overview
          </button>
          <button class="tab-button ${this.activeTab === 'compliance' ? 'active' : ''}" data-tab="compliance">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 12l2 2 4-4"></path><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.35 0 4.48.9 6.08 2.38"></path>
            </svg>
            Compliance
          </button>
        </div>
        
        <!-- Tab Content -->
        <div class="tab-content">
          ${this.activeTab === 'overview' ? this._getOverviewHTML() : this._getComplianceHTML()}
        </div>
      </div>
    `;
  };

  _getOverviewHTML = () => {
    if (!this.overviewData || !this.overviewData.data) {
      return `<div class="empty-state">No overview data available</div>`;
    }

    const data = this.overviewData.data;

    return /* html */ `
      <div class="dashboard-overview">
        ${this._getContributionTypesSection(data.summary || {})}
        ${this._getTrendsSection(data.trends || {})}
        ${this._getAnalyticsSection(data.analytics || {})}
      </div>
    `;
  };

  _getComplianceHTML = () => {
    if (!this.complianceData || !this.complianceData.data) {
      return `<div class="empty-state">No compliance data available</div>`;
    }

    const data = this.complianceData.data;

    return /* html */ `
      <div class="dashboard-overview">
        ${this._getComplianceSummarySection(data.summary || {})}
        ${this._getComplianceIntervalsSection(data.intervals || {})}
        ${this._getCompliancePatternsSection(data.patterns || {})}
      </div>
    `;
  };

  _getContributionTypesSection = (summary) => {
    const types = summary.types || [];
    const mandatory = summary.mandatory || [];

    return /* html */ `
      <!-- Contribution Types Section -->
      <div class="overview-section">
        <h3 class="section-title">Contribution Types</h3>
        <div class="stats-grid">
          ${types.map(type => `
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-title">${type.type.charAt(0).toUpperCase() + type.type.slice(1)} Contributions</div>
                <div class="stat-icon icon-${type.type}">
                  ${this._getContributionTypeIcon(type.type)}
                </div>
              </div>
              <div class="stat-value stat-${this._getTypeColor(type.type)}">${this.app.format(type.count)}</div>
              <div class="stat-details">
                <span class="stat-${this._getTypeColor(type.type)}">KES ${this.app.format(type.amount)}</span>
              </div>
            </div>
          `).join('')}
          
          ${mandatory.map(item => `
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-title">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</div>
                <div class="stat-icon icon-${item.type}">
                  ${this._getMandatoryTypeIcon(item.type)}
                </div>
              </div>
              <div class="stat-value stat-${this._getMandatoryColor(item.type)}">${this.app.format(item.count)}</div>
              <div class="stat-details">
                <span class="stat-info">KES ${this.app.format(item.amount)}</span> •
                <span class="stat-${this._getMandatoryColor(item.type)}">${this.app.format(item.paymentrate)}% rate</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };

  _getTrendsSection = (trends) => {
    const monthly = trends.monthly || [];

    return /* html */ `
      <!-- Trends Section -->
      <div class="overview-section">
        <h3 class="section-title">Monthly Trends</h3>
        <div class="stats-grid">
          ${monthly.map(month => `
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-title">${month.month}</div>
                <div class="stat-icon icon-trend">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
                  </svg>
                </div>
              </div>
              <div class="stat-value">${this.app.format(month.contributions.count)}</div>
              <div class="stat-details">
                <span class="stat-info">KES ${this.app.format(month.contributions.amount)}</span> •
                <span class="stat-success">Avg: ${this.app.format(month.contributions.average)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };

  _getAnalyticsSection = (analytics) => {
    const contributors = analytics.contributors || {};
    const chamas = analytics.chamas || {};

    return /* html */ `
      <!-- Analytics Container -->
      <div class="demographic-container">
        <h4 class="demographic-title">
          <span class="demographic-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </span>
          Analytics Summary
        </h4>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Total Contributors</div>
              <div class="stat-icon icon-contributors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 20a7 7 0 0 1 14 0"></path><circle cx="10" cy="8" r="4"></circle><path d="M21 20a7 7 0 0 0-7-7"></path><circle cx="17" cy="8" r="2"></circle>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(contributors.total || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">${this.app.format(contributors.contributions || 0)} contributions</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Total Amount</div>
              <div class="stat-icon icon-amount">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">KES ${this.app.format(contributors.amount || 0)}</div>
            <div class="stat-details">
              <span class="stat-success">Avg: ${this.app.format(contributors.average || 0)}</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Amount Range</div>
              <div class="stat-icon icon-range">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 12h18m-9-9v18"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(contributors.lowest || 0)} - ${this.app.format(contributors.highest || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">Min to Max</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Active Chamas</div>
              <div class="stat-icon icon-chamas">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="16" cy="7" r="2"></circle>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-info">${this.app.format(chamas.total || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">Max amount: ${this.app.format(chamas.maxamount || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  _getComplianceSummarySection = (summary) => {
    const overall = summary.overall || {};
    const users = summary.users || {};
    const chamas = summary.chamas || {};

    return /* html */ `
      <!-- Compliance Summary Section -->
      <div class="overview-section">
        <h3 class="section-title">Compliance Summary</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Overall Rate</div>
              <div class="stat-icon icon-overall">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 12l2 2 4-4"></path><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.35 0 4.48.9 6.08 2.38"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">${this.app.format(overall.rate || 0)}%</div>
            <div class="stat-details">
              <span class="stat-success">${this.app.format(overall.paid || 0)} / ${this.app.format(overall.contributions || 0)} paid</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Expected vs Collected</div>
              <div class="stat-icon icon-collection">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value">KES ${this.app.format(overall.collected || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">Expected: ${this.app.format(overall.expected || 0)}</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Perfect Users</div>
              <div class="stat-icon icon-perfect-users">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">${this.app.format(users.perfect || 0)}</div>
            <div class="stat-details">
              <span class="stat-success">100% compliance</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Perfect Chamas</div>
              <div class="stat-icon icon-perfect-chamas">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">${this.app.format(chamas.perfect || 0)}</div>
            <div class="stat-details">
              <span class="stat-success">100% compliance</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Low Compliance Users</div>
              <div class="stat-icon icon-low-users">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-error">${this.app.format(users.lowcompliance || 0)}</div>
            <div class="stat-details">
              <span class="stat-error">Need attention</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Low Compliance Chamas</div>
              <div class="stat-icon icon-low-chamas">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-error">${this.app.format(chamas.lowcompliance || 0)}</div>
            <div class="stat-details">
              <span class="stat-error">Need attention</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  _getComplianceIntervalsSection = (intervals) => {
    return /* html */ `
      <!-- Intervals Analysis Container -->
      <div class="demographic-container">
        <h4 class="demographic-title">
          <span class="demographic-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline>
            </svg>
          </span>
          Intervals Analysis
        </h4>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Total Intervals</div>
              <div class="stat-icon icon-intervals">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(intervals.total || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">Payment periods</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Average Rate</div>
              <div class="stat-icon icon-avg-rate">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">${this.app.format(intervals.avgrate || 0)}%</div>
            <div class="stat-details">
              <span class="stat-success">Across intervals</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Rate Range</div>
              <div class="stat-icon icon-rate-range">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 12h18m-9-9v18"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(intervals.minrate || 0)}% - ${this.app.format(intervals.maxrate || 0)}%</div>
            <div class="stat-details">
              <span class="stat-info">Min to Max</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Contributions vs Payments</div>
              <div class="stat-icon icon-vs">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 11H1l2-2 2 2"></path><path d="M23 11h-8l2-2 2 2"></path><path d="M12 12v9l-2-2 2-2 2 2"></path><path d="M12 3v9l-2-2 2-2 2 2"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(intervals.contributions || 0)} / ${this.app.format(intervals.payments || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">Expected / Paid</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  _getCompliancePatternsSection = (patterns) => {
    return /* html */ `
      <!-- Payment Patterns Container -->
      <div class="demographic-container">
        <h4 class="demographic-title">
          <span class="demographic-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </span>
          Payment Patterns
        </h4>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Full Payments</div>
              <div class="stat-icon icon-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 12l2 2 4-4"></path><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.35 0 4.48.9 6.08 2.38"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">${this.app.format(patterns.full || 0)}</div>
            <div class="stat-details">
              <span class="stat-success">Complete payments</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Partial Payments</div>
              <div class="stat-icon icon-partial">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-warning">${this.app.format(patterns.partial || 0)}</div>
            <div class="stat-details">
              <span class="stat-warning">Incomplete payments</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Unpaid</div>
              <div class="stat-icon icon-unpaid">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-error">${this.app.format(patterns.unpaid || 0)}</div>
            <div class="stat-details">
              <span class="stat-error">No payment</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Overpaid</div>
              <div class="stat-icon icon-overpaid">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15,10 20,15 15,20"></polyline><path d="M4 4v7a4 4 0 0 0 4 4h12"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-info">${this.app.format(patterns.overpaid || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">Excess payments</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Average Percentage</div>
              <div class="stat-icon icon-avg-percentage">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(patterns.avgpercentage || 0)}%</div>
            <div class="stat-details">
              <span class="stat-info">Payment completion</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Total Shortfall</div>
              <div class="stat-icon icon-shortfall">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-error">KES ${this.app.format(patterns.totalshortfall || 0)}</div>
            <div class="stat-details">
              <span class="stat-error">Avg: ${this.app.format(patterns.avgshortfall || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  _getContributionTypeIcon = (type) => {
    const icons = {
      savings: /* svg */`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>`,
      social: /* svg */`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>`
    };
    return icons[type] || icons.savings;
  };

  _getMandatoryTypeIcon = (type) => {
    const icons = {
      voluntary: /* svg */`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 12l2 2 4-4"></path><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.35 0 4.48.9 6.08 2.38"></path>
      </svg>`,
      mandatory: /* svg */`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
      </svg>`
    };
    return icons[type] || icons.voluntary;
  };

  _getTypeColor = (type) => {
    const colors = {
      savings: 'success',
      social: 'info'
    };
    return colors[type] || 'info';
  };

  _getMandatoryColor = (type) => {
    const colors = {
      voluntary: 'success',
      mandatory: 'warning'
    };
    return colors[type] || 'info';
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
         An error occurred while fetching the contributions data. Please check your connection and try again.
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
          <h2 class="finish__title">Error Loading Contributions Data</h2>
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
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          <h2 class="finish__title">No Contributions Data</h2>
          <p class="desc">No contribution data available to display at this time.</p>
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
          console.log(`Contributions Stat: ${statName}, Value: ${statValue}`);
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
          min-width: 140px;
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

        /* Icon Color Themes */
        .icon-savings { background: var(--accent-linear); }
        .icon-social { background: var(--second-linear); }
        .icon-voluntary { background: linear-gradient(135deg, #10b981, #059669); }
        .icon-mandatory { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .icon-trend { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .icon-overall { background: linear-gradient(135deg, #06b6d4, #0891b2); }
        .icon-collection { background: linear-gradient(135deg, #10b981, #047857); }
        .icon-perfect-users { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .icon-perfect-chamas { background: linear-gradient(135deg, #059669, #047857); }
        .icon-low-users { background: linear-gradient(135deg, #dc2626, #b91c1c); }
        .icon-low-chamas { background: linear-gradient(135deg, #7c3aed, #6d28d9); }
        .icon-intervals { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .icon-avg-rate { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .icon-rate-range { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .icon-vs { background: linear-gradient(135deg, #06b6d4, #0891b2); }
        .icon-full { background: linear-gradient(135deg, #10b981, #059669); }
        .icon-partial { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .icon-unpaid { background: linear-gradient(135deg, #dc2626, #b91c1c); }
        .icon-overpaid { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .icon-avg-percentage { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .icon-shortfall { background: linear-gradient(135deg, #dc2626, #b91c1c); }
        .icon-contributors { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .icon-amount { background: linear-gradient(135deg, #10b981, #059669); }
        .icon-range { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .icon-chamas { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--title-color);
          margin-bottom: 1rem;
          font-family: var(--font-main), sans-serif;
          letter-spacing: -0.02em;
          line-height: 1;
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

        /* Demographic Container */
        .demographic-container {
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

        /* Dashboard Overview */
        .dashboard-overview {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
      </style>`;
  };
}

