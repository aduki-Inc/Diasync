export default class Chama extends HTMLElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.app = window.app;
    this.api = this.app.api;
    this.url = this.getAttribute("api") || "/stats/chama/overview";
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
        console.log("Authentication required for chama access");
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
        console.log('Chama data structure:', response.data);
      }

      this.dashboardData = response;
      this.render();
      this._addStatCardListeners();
    } catch (error) {
      console.error("Error fetching chama data:", error);

      if (
        error.status === 401 ||
        (error.response && error.response.status === 401)
      ) {
        console.log("Authentication required for chama access");
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
            <span class="breadcrumb-item active">Chamas</span>
          </div>
          <p class="subtitle">Chama analytics, membership insights, and activity performance metrics</p>
        </div>
        ${this._getChamaHTML()}
      </div>
    `;
  };

  _getChamaHTML = () => {
    const data = this.dashboardData.data;

    return /* html */ `
      <div class="dashboard-overview">
        ${this._getChamaTypesSection(data.summary || {})}
        ${this._getMembershipAnalysisSection(data.summary || {})}
        ${this._getActivityAnalysisSection(data.activity || {})}
      </div>
    `;
  };

  _getChamaTypesSection = (summary) => {
    const types = summary.types || [];
    const totalChamas = types.reduce((sum, type) => sum + type.count, 0);

    return /* html */ `
      <!-- Chama Types Section -->
      <div class="overview-section">
        <h3 class="section-title">Chama Types Overview</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Total Chamas</div>
              <div class="stat-icon icon-total">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="16" cy="7" r="2"></circle>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(totalChamas)}</div>
            <div class="stat-details">
              <span class="stat-info">Active chama groups</span>
            </div>
          </div>
          
          ${types.map(type => `
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-title">${type.type.charAt(0).toUpperCase() + type.type.slice(1)} Chamas</div>
                <div class="stat-icon icon-${type.type}">
                  ${this._getTypeIcon(type.type)}
                </div>
              </div>
              <div class="stat-value stat-${this._getTypeColor(type.type)}">${this.app.format(type.count)}</div>
              <div class="stat-details">
                <span class="stat-${this._getTypeColor(type.type)}">${this.app.format((type.count / totalChamas * 100) || 0)}% of total</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };

  _getMembershipAnalysisSection = (summary) => {
    const members = summary.members || [];
    const totalMembers = members.reduce((sum, member) => sum + member.total, 0);

    return /* html */ `
      <!-- Membership Analysis Container -->
      <div class="demographic-container">
        <h4 class="demographic-title">
          <span class="demographic-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><path d="M20 8v6"></path><path d="M23 11h-6"></path>
            </svg>
          </span>
          Membership Analysis
        </h4>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Total Members</div>
              <div class="stat-icon icon-members-total">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 20a7 7 0 0 1 14 0"></path><circle cx="10" cy="8" r="4"></circle><path d="M21 20a7 7 0 0 0-7-7"></path><circle cx="17" cy="8" r="2"></circle>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(totalMembers)}</div>
            <div class="stat-details">
              <span class="stat-info">Across all chama types</span>
            </div>
          </div>
          
          ${members.map(member => `
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-title">${member.type.charAt(0).toUpperCase() + member.type.slice(1)} Members</div>
                <div class="stat-icon icon-members-${member.type}">
                  ${this._getTypeIcon(member.type)}
                </div>
              </div>
              <div class="stat-value stat-${this._getTypeColor(member.type)}">${this.app.format(member.total)}</div>
              <div class="stat-details">
                <span class="stat-info">${this.app.format(member.chamas)} chamas</span> •
                <span class="stat-${this._getTypeColor(member.type)}">Avg: ${this.app.format(member.average)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };

  _getActivityAnalysisSection = (activity) => {
    const summary = activity.summary || {};
    const scores = activity.scores || {};
    const distribution = activity.distribution || {};
    const bytypes = activity.bytypes || {};

    return /* html */ `
      <!-- Activity Analysis Container -->
      <div class="demographic-container">
        <h4 class="demographic-title">
          <span class="demographic-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
            </svg>
          </span>
          Activity Analysis
        </h4>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Active Chamas</div>
              <div class="stat-icon icon-activity-chamas">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(summary.chamas || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">Total active groups</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Contributions</div>
              <div class="stat-icon icon-contributions">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2v20m8-10H4"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-success">${this.app.format(summary.contributions || 0)}</div>
            <div class="stat-details">
              <span class="stat-success">Active contributions</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Loans</div>
              <div class="stat-icon icon-loans">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-warning">${this.app.format(summary.loans || 0)}</div>
            <div class="stat-details">
              <span class="stat-warning">Active loans</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Total Activities</div>
              <div class="stat-icon icon-activities">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(summary.activities || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">Combined activities</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Activity Score Range</div>
              <div class="stat-icon icon-score-range">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 12h18m-9-9v18"></path>
                </svg>
              </div>
            </div>
            <div class="stat-value">${this.app.format(scores.min || 0)} - ${this.app.format(scores.max || 0)}</div>
            <div class="stat-details">
              <span class="stat-info">Avg: ${this.app.format(scores.average || 0)}</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-title">Inactive Chamas</div>
              <div class="stat-icon icon-inactive">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                </svg>
              </div>
            </div>
            <div class="stat-value stat-error">${this.app.format(distribution.inactive || 0)}</div>
            <div class="stat-details">
              <span class="stat-error">Need attention</span>
            </div>
          </div>
        </div>
        
        <!-- Activity by Types Sub-section -->
        <h5 class="subsection-title">Activity by Chama Type</h5>
        <div class="stats-grid">
          ${Object.entries(bytypes).map(([type, data]) => `
            <div class="stat-card">
              <div class="stat-header">
                <div class="stat-title">${type.charAt(0).toUpperCase() + type.slice(1)} Activity</div>
                <div class="stat-icon icon-type-${type}">
                  ${this._getTypeIcon(type)}
                </div>
              </div>
              <div class="stat-value stat-${this._getTypeColor(type)}">${this.app.format(data.average || 0)}</div>
              <div class="stat-details">
                <span class="stat-info">${this.app.format(data.count || 0)} chamas</span> •
                <span class="stat-${this._getTypeColor(type)}">Avg score</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };

  _getTypeIcon = (type) => {
    const icons = {
      table: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v6m0 0h10v6m-10-6H3v6a2 2 0 0 0 2 2h4m-6-6h16"></path>
      </svg>`,
      silk: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
      </svg>`,
      admin: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-6.5l-3 3m-6-6l-3 3m0 6l3 3m6-6l3 3"></path>
      </svg>`
    };
    return icons[type] || icons.table;
  };

  _getTypeColor = (type) => {
    const colors = {
      table: 'info',
      silk: 'success',
      admin: 'warning'
    };
    return colors[type] || 'info';
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

      console.log(`Chama Stat: ${statName}, Value: ${statValue}`);

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
        <h2 class="finish__title">No chama data available</h2>
        <p class="desc">
          There are no chama insights available right now. Please check back later.
        </p>
      </div>
    `;
  };

  getWrongMessage = () => {
    return /*html*/ `
      <div class="finish">
        <h2 class="finish__title">Something went wrong!</h2>
        <p class="desc">
         An error occurred while fetching the chama data. Please check your connection and try again.
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

        /* Demographic Container Styles */
        .demographic-container {
          margin-bottom: 2rem;
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

        .subsection-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--title-color);
          margin: 2rem 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(0, 96, 223, 0.1);
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
        .icon-total { background: var(--accent-linear); }
        .icon-table { background: linear-gradient(135deg, #0ea5e9, #0284c7); }
        .icon-silk { background: linear-gradient(135deg, #10b981, #059669); }
        .icon-admin { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .icon-members-total { background: var(--second-linear); }
        .icon-members-table { background: linear-gradient(135deg, #0ea5e9, #0284c7); }
        .icon-members-silk { background: linear-gradient(135deg, #10b981, #059669); }
        .icon-members-admin { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .icon-activity-chamas { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .icon-contributions { background: linear-gradient(135deg, #10b981, #047857); }
        .icon-loans { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .icon-activities { background: linear-gradient(135deg, #06b6d4, #0891b2); }
        .icon-score-range { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .icon-inactive { background: linear-gradient(135deg, #ef4444, #dc2626); }
        .icon-type-table { background: linear-gradient(135deg, #0ea5e9, #0284c7); }
        .icon-type-silk { background: linear-gradient(135deg, #10b981, #059669); }
        .icon-type-admin { background: linear-gradient(135deg, #f59e0b, #d97706); }

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
