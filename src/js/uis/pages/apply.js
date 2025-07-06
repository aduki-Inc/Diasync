export default class Apply extends HTMLElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.app = window.app;
    this.api = this.app.api;
    this.url = this.getAttribute("api") || "/stats/apply/overview";
    this.dashboardData = null;
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
    this.fetchDashboardData();
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

  fetchDashboardData = async () => {
    this._loading = true;
    this._block = true;
    this.render();

    try {
      const response = await this.api.get(this.url, { content: "json" });

      if (
        response.status_code === 401 ||
        (response.error_message &&
          response.error_message.includes("validate credentials"))
      ) {
        console.log("Authentication required for apply access");
        this._loading = false;
        this.app.showAccess();
        return;
      }

      if (!response.success || !response.data) {
        this._empty = true;
        this._loading = false;
        this.dashboardData = null;
        this.render();
        this.activateRefresh();
        return;
      }

      this._loading = false;
      this._block = false;
      this._empty = false;

      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('dev')) {
        console.log('Apply data structure:', response.data);
      }

      this.dashboardData = response;
      this.render();
      this._addStatCardListeners();
    } catch (error) {
      console.error("Error fetching apply data:", error);

      if (
        error.status === 401 ||
        (error.response && error.response.status === 401)
      ) {
        console.log("Authentication required for apply access");
        this._loading = false;
        this.app.showLogin();
        return;
      }

      this._loading = false;
      this._empty = true;
      this.dashboardData = null;
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
        this.fetchDashboardData();
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

    if (this._empty || !this.dashboardData) {
      return /* html */ `<div class="container">${this.getWrongMessage()}</div>`;
    }

    return /* html */ `
      <div class="container">
        <div class="header">
          <div class="breadcrumb">
            <span class="breadcrumb-item">Stats</span>
            <span class="breadcrumb-separator">|</span>
            <span class="breadcrumb-item active">Applications</span>
          </div>
          <p class="subtitle">Loan application analytics, approval trends, and performance insights</p>
        </div>
        ${this._getApplyHTML()}
      </div>
    `;
  };

  _getApplyHTML = () => {
    const data = this.dashboardData.data;

    return /* html */ `
      <div class="dashboard-overview">
        ${this._getApplicationSummarySection(data.summary || {})}
        ${this._getChamaPerformanceSection(data.chamas || {})}
        ${this._getDemographicPerformanceSection(data.performance || {})}
      </div>
    `;
  };

  _getApplicationSummarySection = (summary) => {
    return /* html */ `
      <!-- Application Summary Section -->
      <div class="overview-section">
        <h3 class="section-title">Application Overview</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Total Applications</div>
              <div class="stat-icon icon-applications">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(summary.total || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">All time applications</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Approved</div>
              <div class="stat-icon icon-approved">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 12l2 2 4-4"></path><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.35 0 4.48.9 6.08 2.38"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">${this.app.format(summary.approved || 0)}</div>
            <div class="stat-details">
              <span class="stat-success">${this.app.format(summary.rate || 0)}% Approval Rate</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Pending Review</div>
              <div class="stat-icon icon-pending">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-warning">${this.app.format(summary.pending || 0)}</div>
            <div class="stat-details">
              <span class="stat-warning">Awaiting decision</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Rejected</div>
              <div class="stat-icon icon-rejected">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-error">${this.app.format(summary.rejected || 0)}</div>
            <div class="stat-details">
              <span class="stat-error">Not approved</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  _getChamaPerformanceSection = (chamas) => {
    return /* html */ `
      <!-- Chama Performance Section -->
      <div class="overview-section">
        <h3 class="section-title">Chama Performance</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Active Chamas</div>
              <div class="stat-icon icon-groups">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 20a7 7 0 0 1 14 0"></path><circle cx="10" cy="8" r="4"></circle><path d="M21 20a7 7 0 0 0-7-7"></path><circle cx="17" cy="8" r="2"></circle>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(chamas.summary?.total || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">${this.app.format(chamas.summary?.applications || 0)} Total Applications</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Average Approval Rate</div>
              <div class="stat-icon icon-rate">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">${this.app.format(chamas.rates?.average || 0)}%</div>
            <div class="stat-details">
              <span class="stat-success">Max: ${this.app.format(chamas.rates?.max || 0)}%</span> •
              <span class="stat-warning">Min: ${this.app.format(chamas.rates?.min || 0)}%</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Perfect Performers</div>
              <div class="stat-icon icon-perfect">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">${this.app.format(chamas.distribution?.perfect || 0)}</div>
            <div class="stat-details">
              <span class="stat-success">100% approval rate</span>
            </div>
          </div>
          
          <div class="stat-card wide-card">
            <div class="stat-header">
              <div class="stat-title">Performance Distribution</div>
              <div class="stat-icon icon-distribution">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
              <div>
                <div class="stat-value" style="font-size: 1.8rem;">${this.app.format(chamas.distribution?.high || 0)}</div>
                <div class="stat-details"><span class="stat-success">High (80%+)</span></div>
              </div>
              <div>
                <div class="stat-value" style="font-size: 1.8rem;">${this.app.format(chamas.distribution?.medium || 0)}</div>
                <div class="stat-details"><span class="stat-info">Medium (60-79%)</span></div>
              </div>
              <div>
                <div class="stat-value" style="font-size: 1.8rem;">${this.app.format(chamas.distribution?.low || 0)}</div>
                <div class="stat-details"><span class="stat-warning">Low (40-59%)</span></div>
              </div>
              <div>
                <div class="stat-value" style="font-size: 1.8rem;">${this.app.format(chamas.distribution?.verylow || 0)}</div>
                <div class="stat-details"><span class="stat-error">Very Low (<40%)</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  _getDemographicPerformanceSection = (performance) => {
    return /* html */ `
      <!-- Demographic Performance Section -->
      <div class="overview-section">
        <h3 class="section-title">Demographic Performance</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Gender Groups</div>
              <div class="stat-icon icon-demographics">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><path d="M20 8v6"></path><path d="M23 11h-6"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(performance.summary?.genders || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">Genders</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Age Groups</div>
              <div class="stat-icon icon-age">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-6.5l-3 3m-6-6l-3 3m0 6l3 3m6-6l3 3"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(performance.summary?.ages || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">Categories</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Best Gender Performance</div>
              <div class="stat-icon icon-best">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">${this.app.format(performance.gender?.best?.rate || 0)}%</div>
            <div class="stat-details">
              <span class="stat-success">${performance.gender?.best?.group?.toUpperCase() || 'N/A'}</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Best Age Performance</div>
              <div class="stat-icon icon-trophy">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">${this.app.format(performance.age?.best?.rate || 0)}%</div>
            <div class="stat-details">
              <span class="stat-success">${performance.age?.best?.group || 'N/A'} Age Group</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Average Application Amount</div>
              <div class="stat-icon icon-money">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value">KES ${this.app.format(performance.summary?.avgamount || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">All Demographics</span>
            </div>
          </div>
          
        </div>
        
        <!-- Gender Analysis Container -->
        <div class="demographic-container">
          <h4 class="demographic-title">
            <span class="demographic-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="9" r="9"></circle><path d="M9 1v8"></path><path d="M15 15l6 6"></path><path d="M21 15v6h-6"></path>
              </svg>
            </span>
            Gender Analysis
          </h4>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-title">Best Gender Performance</div>
                <div class="stat-icon icon-gender-best">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                  </svg>
                </div>
              </div>
              <div class="stat-value stat-success">${this.app.format(performance.gender?.best?.rate || 0)}%</div>
              <div class="stat-details">
                <span class="stat-success">${performance.gender?.best?.group?.toUpperCase() || 'N/A'}</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-title">Gender Average Rate</div>
                <div class="stat-icon icon-gender-avg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
                  </svg>
                </div>
              </div>
              <div class="stat-value">${this.app.format(performance.gender?.average || 0)}%</div>
              <div class="stat-details">
                <span class="stat-info">All Genders</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-title">Needs Attention</div>
                <div class="stat-icon icon-gender-worst">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
              </div>
              <div class="stat-value stat-error">${this.app.format(performance.gender?.worst?.rate || 0)}%</div>
              <div class="stat-details">
                <span class="stat-error">${performance.gender?.worst?.group?.toUpperCase() || 'N/A'}</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-title">Highest Amount Group</div>
                <div class="stat-icon icon-gender-amount">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
              </div>
              <div class="stat-value">KES ${this.app.format(performance.gender?.best?.amount || 0)}</div>
              <div class="stat-details">
                <span class="stat-info">${performance.gender?.best?.amountgroup?.toUpperCase() || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Age Group Analysis Container -->
        <div class="demographic-container">
          <h4 class="demographic-title">
            <span class="demographic-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-6.5l-3 3m-6-6l-3 3m0 6l3 3m6-6l3 3"></path>
              </svg>
            </span>
            Age Group Analysis
          </h4>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-title">Top Age Performance</div>
                <div class="stat-icon icon-age-best">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                  </svg>
                </div>
              </div>
              <div class="stat-value stat-success">${this.app.format(performance.age?.best?.rate || 0)}%</div>
              <div class="stat-details">
                <span class="stat-success">${performance.age?.best?.group || 'N/A'} Age Group</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-title">Age Average Rate</div>
                <div class="stat-icon icon-age-avg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                </div>
              </div>
              <div class="stat-value">${this.app.format(performance.age?.average || 0)}%</div>
              <div class="stat-details">
                <span class="stat-info">${this.app.format(performance.summary?.ages || 0)} Age Groups</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-title">Improvement Area</div>
                <div class="stat-icon icon-age-worst">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </div>
              </div>
              <div class="stat-value stat-error">${this.app.format(performance.age?.worst?.rate || 0)}%</div>
              <div class="stat-details">
                <span class="stat-error">${performance.age?.worst?.group || 'N/A'} Age Group</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-title">Highest Amount Group</div>
                <div class="stat-icon icon-age-amount">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
              </div>
              <div class="stat-value">KES ${this.app.format(performance.age?.best?.amount || 0)}</div>
              <div class="stat-details">
                <span class="stat-info">${performance.age?.best?.amountgroup || 'N/A'} Requests most</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  _addStatCardListeners = () => {
    const statCards = this.shadowObj.querySelectorAll(".stat-card");
    statCards.forEach((card) => {
      card.addEventListener("click", this._handleStatCardInteraction);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this._handleStatCardInteraction.call(card);
        }
      });
    });
  };

  _handleStatCardInteraction = function () {
    const titleElement = this.querySelector(".stat-title");
    const valueElement = this.querySelector(".stat-value");

    if (titleElement && valueElement) {
      const statName = titleElement.textContent.trim();
      const statValue = valueElement.textContent.trim();

      console.log(`Apply Stat: ${statName}, Value: ${statValue}`);

      this.style.transform = "scale(0.98)";
      setTimeout(() => {
        this.style.transform = "";
      }, 200);
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
        <h2 class="finish__title">No application data available</h2>
        <p class="desc">
          There are no loan application insights available right now. Please check back later.
        </p>
      </div>
    `;
  };

  getWrongMessage = () => {
    return /*html*/ `
      <div class="finish">
        <h2 class="finish__title">Something went wrong!</h2>
        <p class="desc">
         An error occurred while fetching the application data. Please check your connection and try again.
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

        .header > h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          padding: 0;
          color: var(--title-color);
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        .header > p.subtitle {
          color: var(--gray-color);
          margin: 0.5rem 0 0;
          padding: 0;
          font-size: 1rem;
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

        /* Demographic Container Styles */
        .demographic-container {
          margin-top: 2rem;
          background: rgba(0, 96, 223, 0.02);
          padding: 1.5rem 0;
          position: relative;
          overflow: hidden;
        }

        .demographic-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--accent-linear);
          opacity: 0.6;
        }

        .demographic-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--title-color);
          margin: 0 0 1.5rem 0;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(0, 96, 223, 0.1);
        }

        .demographic-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--accent-linear);
          color: white;
          box-shadow: 0 2px 8px rgba(0, 96, 223, 0.3);
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
        .icon-applications { background: var(--accent-linear); }
        .icon-approved { background: linear-gradient(135deg, #10b981, #059669); }
        .icon-pending { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .icon-rejected { background: linear-gradient(135deg, #ef4444, #dc2626); }
        .icon-groups { background: var(--second-linear); }
        .icon-rate { background: linear-gradient(135deg, #10b981, #047857); }
        .icon-perfect { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
        .icon-distribution { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .icon-demographics { background: linear-gradient(135deg, #06b6d4, #0891b2); }
        .icon-age { background: linear-gradient(135deg, #f472b6, #ec4899); }
        .icon-best { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
        .icon-trophy { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
        .icon-money { background: linear-gradient(135deg, #10b981, #059669); }
        .icon-gender-best { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
        .icon-gender-avg { background: linear-gradient(135deg, #0ea5e9, #0284c7); }
        .icon-gender-worst { background: linear-gradient(135deg, #ef4444, #dc2626); }
        .icon-gender-amount { background: linear-gradient(135deg, #10b981, #059669); }
        .icon-age-best { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
        .icon-age-avg { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .icon-age-worst { background: linear-gradient(135deg, #ef4444, #dc2626); }
        .icon-age-amount { background: linear-gradient(135deg, #06b6d4, #0891b2); }

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

        @media (max-width: 480px) {

          .header > h1 {
            font-size: 1.75rem;
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
        }

        /* Accessibility */
        .stat-card:focus {
          outline: 2px solid var(--accent-color);
          outline-offset: 2px;
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
      </style>`;
  };
}
