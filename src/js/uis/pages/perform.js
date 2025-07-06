export default class Performance extends HTMLElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.app = window.app;
    this.api = this.app.api;
    this.url = this.getAttribute("api") || "/stats/performance";
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
        console.log("Authentication required for performance access");
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
        console.log('Performance data structure:', response.data);
      }

      this.dashboardData = response;
      this.render();
      this._addStatCardListeners();
    } catch (error) {
      console.error("Error fetching performance data:", error);

      if (
        error.status === 401 ||
        (error.response && error.response.status === 401)
      ) {
        console.log("Authentication required for performance access");
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
            <span class="breadcrumb-item active">Performance</span>
          </div>
          <p class="subtitle">Growth trends, geographic insights, and cohort analysis</p>
        </div>
        ${this._getPerformanceHTML()}
      </div>
    `;
  };

  _getPerformanceHTML = () => {
    const data = this.dashboardData.data;

    return /* html */ `
      <div class="dashboard-overview">
        ${this._getGrowthTrendsSection(data.trends || [])}
        ${this._getGeographicSection(data.geographic || {})}
        ${this._getCohortsSection(data.cohorts || [])}
      </div>
    `;
  };

  _getGrowthTrendsSection = (trends) => {
    // Get the latest month data for summary cards
    const latestMonth = trends[trends.length - 1] || {};

    return /* html */ `
      <!-- Growth Trends Section -->
      <div class="overview-section">
        <h3 class="section-title">Growth Trends</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">New Users (Latest Month)</div>
              <div class="stat-icon icon-users">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><path d="M20 8v6"></path><path d="M23 11h-6"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">${this.app.format(latestMonth.users?.new || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">${this.app.format(latestMonth.users?.total || 0)} Total Users</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">New Chamas (Latest Month)</div>
              <div class="stat-icon icon-groups">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 20a7 7 0 0 1 14 0"></path><circle cx="10" cy="8" r="4"></circle><path d="M21 20a7 7 0 0 0-7-7"></path><circle cx="17" cy="8" r="2"></circle>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">${this.app.format(latestMonth.chamas?.new || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">${this.app.format(latestMonth.chamas?.total || 0)} Total Chamas</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Monthly Contributions</div>
              <div class="stat-icon icon-contribution">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value">KES ${this.app.format(latestMonth.financial?.contributions || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">Latest month activity</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Monthly Loans</div>
              <div class="stat-icon icon-loans">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
            </div>
            <div class="stat-value">KES ${this.app.format(latestMonth.financial?.loans || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">Latest month activity</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  _getGeographicSection = (geographic) => {
    return /* html */ `
      <!-- Geographic Performance Section -->
      <div class="overview-section">
        <h3 class="section-title">Geographic Performance</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Subcounties</div>
              <div class="stat-icon icon-map">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(geographic.areas?.subcounties || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">${this.app.format(geographic.areas?.locations || 0)} Locations</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Active Regions</div>
              <div class="stat-icon icon-activity">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">${this.app.format(geographic.regions?.active || 0)}</div>
            <div class="stat-details">
              <span class="stat-warning">${this.app.format(geographic.regions?.moderate || 0)} Moderate</span> •
              <span class="stat-secondary">${this.app.format(geographic.regions?.small || 0)} Small</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Avg Users per Region</div>
              <div class="stat-icon icon-users">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(geographic.averages?.users || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">${this.app.format(geographic.averages?.chamas || 0)} Avg Chamas</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Regional Default Rate</div>
              <div class="stat-icon icon-ratio">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">${this.app.format(geographic.averages?.defaults || 0)}%</div>
            <div class="stat-details">
              <span class="stat-success">Low risk level</span>
            </div>
          </div>
          
          <div class="stat-card wide-card">
            <div class="stat-header">
              <div class="stat-title">Geographic Financial Summary</div>
              <div class="stat-icon icon-money">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div>
                <div class="stat-value" style="font-size: 1.8rem;">KES ${this.app.format(geographic.financial?.contributions || 0)}</div>
                <div class="stat-details"><span class="stat-success">Total Contributions</span></div>
              </div>
              <div>
                <div class="stat-value" style="font-size: 1.8rem;">KES ${this.app.format(geographic.financial?.loans || 0)}</div>
                <div class="stat-details"><span class="stat-info">Total Loans</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  _getCohortsSection = (cohorts) => {
    const latestCohort = cohorts[cohorts.length - 1] || {};

    return /* html */ `
      <!-- Cohort Analysis Section -->
      <div class="overview-section">
        <h3 class="section-title">Cohort Analysis</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Latest Cohort Size</div>
              <div class="stat-icon icon-groups">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 20a7 7 0 0 1 14 0"></path><circle cx="10" cy="8" r="4"></circle><path d="M21 20a7 7 0 0 0-7-7"></path><circle cx="17" cy="8" r="2"></circle>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(latestCohort.size || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">${latestCohort.month || 'N/A'}</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Avg Contributions</div>
              <div class="stat-icon icon-contribution">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value">KES ${this.app.format(latestCohort.averages?.contributions || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">Per cohort member</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Avg Loans</div>
              <div class="stat-icon icon-loans">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
            </div>
            <div class="stat-value">KES ${this.app.format(latestCohort.averages?.loans || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">Per cohort member</span>
            </div>
          </div>
          
          <div class="stat-card wide-card">
            <div class="stat-header">
              <div class="stat-title">Retention Rates</div>
              <div class="stat-icon icon-retention">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 12l2 2 4-4"></path><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.35 0 4.48.9 6.08 2.38"></path>
                </svg>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
              <div>
                <div class="stat-value" style="font-size: 1.8rem;">
                  ${latestCohort.retention?.month1 !== null ? this.app.format(latestCohort.retention.month1) + '%' : 'N/A'}
                </div>
                <div class="stat-details"><span class="stat-info">1 Month</span></div>
              </div>
              <div>
                <div class="stat-value" style="font-size: 1.8rem;">
                  ${latestCohort.retention?.month3 !== null ? this.app.format(latestCohort.retention.month3) + '%' : 'N/A'}
                </div>
                <div class="stat-details"><span class="stat-warning">3 Months</span></div>
              </div>
              <div>
                <div class="stat-value" style="font-size: 1.8rem;">
                  ${latestCohort.retention?.month6 !== null ? this.app.format(latestCohort.retention.month6) + '%' : 'N/A'}
                </div>
                <div class="stat-details"><span class="stat-secondary">6 Months</span></div>
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

      console.log(`Performance Stat: ${statName}, Value: ${statValue}`);

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
        <h2 class="finish__title">No performance data available</h2>
        <p class="desc">
          There are no platform performance insights available right now. Please check back later.
        </p>
      </div>
    `;
  };

  getWrongMessage = () => {
    return /*html*/ `
      <div class="finish">
        <h2 class="finish__title">Something went wrong!</h2>
        <p class="desc">
         An error occurred while fetching the performance data. Please check your connection and try again.
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
        .icon-users { background: var(--accent-linear); }
        .icon-groups { background: var(--second-linear); }
        .icon-money { background: linear-gradient(135deg, #10b981, #059669); }
        .icon-loans { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .icon-map { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .icon-ratio { background: linear-gradient(135deg, #06b6d4, #0891b2); }
        .icon-activity { background: linear-gradient(135deg, #10b981, #047857); }
        .icon-contribution { background: linear-gradient(135deg, #059669, #047857); }
        .icon-retention { background: linear-gradient(135deg, #3b82f6, #2563eb); }

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
