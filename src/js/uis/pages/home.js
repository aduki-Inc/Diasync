export default class Home extends HTMLElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.render();
  }

  connectedCallback() {
    this._addEventListeners();
    this._loadDashboardData();
  }

  disconnectedCallback() {
    // Cleanup if needed
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  _addEventListeners() {
    // Tab navigation
    const tabs = this.shadowObj.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        this._handleTabClick(e.target);
      });
    });

    // Quick action cards
    const actionCards = this.shadowObj.querySelectorAll('[data-action]');
    actionCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const action = card.getAttribute('data-action');
        this._handleQuickAction(action);
      });
    });

    // Search functionality
    const searchForm = this.shadowObj.querySelector('.search');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this._handleSearch();
      });
    }
  }

  _handleTabClick(tab) {
    // Remove active class from all tabs
    const tabs = this.shadowObj.querySelectorAll('.tab');
    tabs.forEach(t => t.classList.remove('active'));

    // Add active class to clicked tab
    tab.classList.add('active');

    // Handle tab content switching
    const tabName = tab.textContent.toLowerCase();
    this._switchTabContent(tabName);
  }

  _switchTabContent(tabName) {
    // This would handle showing different content based on tab
    console.log('Switching to tab:', tabName);
  }

  _handleQuickAction(action) {
    // Route to different sections based on action
    switch (action) {
      case 'consultation':
        window.location.hash = '/bookings/consultations';
        break;
      case 'pharmacy':
        window.location.hash = '/pharmacy/orders';
        break;
      case 'ambulance':
        window.location.hash = '/ambulance/dispatch';
        break;
      case 'providers':
        window.location.hash = '/providers/search';
        break;
      case 'reports':
        window.location.hash = '/reports/family-health';
        break;
      case 'payments':
        window.location.hash = '/payments/methods';
        break;
      case 'dependents':
        window.location.hash = '/dependents/family';
        break;
      case 'settings':
        window.location.hash = '/settings/profile';
        break;
      case 'appointments':
        window.location.hash = '/appointments/upcoming';
        break;
      case 'emergency':
        window.location.hash = '/emergency/services';
        break;
      default:
        console.log('Unknown action:', action);
    }
  }

  _handleSearch() {
    const searchInput = this.shadowObj.querySelector('.search-input');
    const query = searchInput.value.trim();
    if (query) {
      window.location.hash = `/search?q=${encodeURIComponent(query)}`;
    }
  }

  _loadDashboardData() {
    // This would load real data from API
    // For now, we'll use mock data
    this._updateMetrics();
    this._loadRecentActivity();
    this._loadUpcomingAppointments();
  }

  _updateMetrics() {
    // Update metrics with real data
    console.log('Loading dashboard metrics...');
  }

  _loadRecentActivity() {
    // Load recent activity data
    console.log('Loading recent activity...');
  }

  _loadUpcomingAppointments() {
    // Load upcoming appointments
    console.log('Loading upcoming appointments...');
  }

  getTemplate() {
    return /* html */ `
      <style>
        ${this.getStyles()}
      </style>
      ${this.getBody()}
    `;
  }

  getBody = () => {
    return /* html */ `
      <div class="dashboard-container">
        ${this.getHeader()}
        ${this.getMainContent()}
      </div>
    `;
  };

  getHeader = () => {
    return /* html */`
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-left">
            <h2 class="dashboard-title">Dashboard</h2>
            <p class="dashboard-subtitle">Manage your family's healthcare.</p>
          </div>
          <div class="header-right">
            <form class="search-bar">
              <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              <input type="text" class="search-input" placeholder="Search services, doctors, medications..." />
            </form>
            <nav class="tab-navigation">
              <div class="tab active">Overview</div>
              <div class="tab">Services</div>
              <div class="tab">Reports</div>
              <div class="tab">Family</div>
            </nav>
          </div>
        </div>
      </header>
    `;
  };

  getMainContent = () => {
    return /* html */ `
      <main class="dashboard-main">
        <div class="dashboard-grid">
          <!-- Health Metrics Section -->
          <section class="metrics-section">
            <h2 class="section-title">Health Overview</h2>
            <div class="metrics-grid">
              ${this.getMetricsCards()}
            </div>
          </section>

          <!-- Quick Actions Section -->
          <section class="quick-actions-section">
            <h2 class="section-title">Quick Actions</h2>
            <div class="quick-actions-grid">
              ${this.getQuickActionCards()}
            </div>
          </section>

          <!-- Recent Activity Section -->
          <section class="activity-section">
            <h2 class="section-title">Recent Activity</h2>
            <div class="activity-content">
              ${this.getRecentActivity()}
            </div>
          </section>

          <!-- Upcoming Appointments Section -->
          <section class="appointments-section">
            <h2 class="section-title">Upcoming Appointments</h2>
            <div class="appointments-content">
              ${this.getUpcomingAppointments()}
            </div>
          </section>

          <!-- Family Health Status -->
          <section class="family-section">
            <h2 class="section-title">Family Health Status</h2>
            <div class="family-content">
              ${this.getFamilyHealthStatus()}
            </div>
          </section>

          <!-- Healthcare Providers -->
          <section class="providers-section">
            <h2 class="section-title">Trusted Providers</h2>
            <div class="providers-content">
              ${this.getTrustedProviders()}
            </div>
          </section>
        </div>
      </main>
    `;
  };

  getMetricsCards = () => {
    return /* html */ `
      <div class="metric-card primary" data-action="reports">
        <div class="metric-content">
          <div class="metric-value">12</div>
          <div class="metric-label">Active Cases</div>
          <div class="metric-sublabel">Family members</div>
        </div>
      </div>

      <div class="metric-card success" data-action="appointments">
        <div class="metric-content">
          <div class="metric-value">8</div>
          <div class="metric-label">This Month</div>
          <div class="metric-sublabel">Appointments</div>
        </div>
      </div>

      <div class="metric-card warning" data-action="payments">
        <div class="metric-content">
          <div class="metric-value">KSh 45,200</div>
          <div class="metric-label">Total Spent</div>
          <div class="metric-sublabel">This year</div>
        </div>
      </div>

      <div class="metric-card info" data-action="providers">
        <div class="metric-content">
          <div class="metric-value">KSh 12,800</div>
          <div class="metric-label">Saved</div>
          <div class="metric-sublabel">vs local prices</div>
        </div>
      </div>
    `;
  };

  getQuickActionCards = () => {
    return /* html */ `
      <div class="action-card primary" data-action="consultation">
        <div class="action-content">
          <h3>Book Consultation</h3>
          <p>Virtual or in-person appointments</p>
        </div>
      </div>

      <div class="action-card secondary" data-action="pharmacy">
        <div class="action-content">
          <h3>Order Medicine</h3>
          <p>Prescriptions & medical supplies</p>
        </div>
      </div>

      <div class="action-card danger" data-action="emergency">
        <div class="action-content">
          <h3>Emergency Services</h3>
          <p>Ambulance & urgent care</p>
        </div>
      </div>

      <div class="action-card info" data-action="providers">
        <div class="action-content">
          <h3>Find Providers</h3>
          <p>Hospitals & healthcare facilities</p>
        </div>
      </div>

      <div class="action-card success" data-action="reports">
        <div class="action-content">
          <h3>Health Reports</h3>
          <p>Analytics & insights</p>
        </div>
      </div>

      <div class="action-card warning" data-action="dependents">
        <div class="action-content">
          <h3>Family Management</h3>
          <p>Manage family profiles</p>
        </div>
      </div>
    `;
  };

  getRecentActivity = () => {
    return /* html */ `
      <div class="activity-list">
        <div class="activity-item">
          <div class="activity-icon consultation">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <div class="activity-content">
            <div class="activity-title">Consultation Completed</div>
            <div class="activity-description">Dr. Sarah Kimani - General Checkup for John</div>
            <div class="activity-time">2 hours ago</div>
          </div>
          <div class="activity-status completed">Completed</div>
        </div>

        <div class="activity-item">
          <div class="activity-icon pharmacy">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 22H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-5"></path>
              <path d="M3 10h18"></path>
              <path d="M12 15l2 2 4-4"></path>
            </svg>
          </div>
          <div class="activity-content">
            <div class="activity-title">Prescription Ordered</div>
            <div class="activity-description">Antibiotics for Mary - Order #ORD-2024-001</div>
            <div class="activity-time">5 hours ago</div>
          </div>
          <div class="activity-status pending">In Transit</div>
        </div>

        <div class="activity-item">
          <div class="activity-icon payment">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="M7 15h0M2 10h20"></path>
            </svg>
          </div>
          <div class="activity-content">
            <div class="activity-title">Payment Processed</div>
            <div class="activity-description">KSh 3,500 - Consultation & Lab Tests</div>
            <div class="activity-time">1 day ago</div>
          </div>
          <div class="activity-status completed">Paid</div>
        </div>
      </div>
    `;
  };

  getUpcomingAppointments = () => {
    return /* html */ `
      <div class="appointments-list">
        <div class="appointment-item urgent">
          <div class="appointment-time">
            <div class="appointment-date">Today</div>
            <div class="appointment-hour">2:30 PM</div>
          </div>
          <div class="appointment-content">
            <div class="appointment-title">Pediatric Consultation</div>
            <div class="appointment-doctor">Dr. James Mwangi</div>
            <div class="appointment-patient">For: Emma (Age 8)</div>
            <div class="appointment-type">Virtual Consultation</div>
          </div>
          <div class="appointment-actions">
            <button class="btn-join">Join Call</button>
            <button class="btn-reschedule">Reschedule</button>
          </div>
        </div>

        <div class="appointment-item">
          <div class="appointment-time">
            <div class="appointment-date">Tomorrow</div>
            <div class="appointment-hour">10:00 AM</div>
          </div>
          <div class="appointment-content">
            <div class="appointment-title">Cardiology Follow-up</div>
            <div class="appointment-doctor">Dr. Grace Wanjiku</div>
            <div class="appointment-patient">For: Michael (Age 45)</div>
            <div class="appointment-type">In-Person at Nairobi Hospital</div>
          </div>
          <div class="appointment-actions">
            <button class="btn-directions">Get Directions</button>
            <button class="btn-reschedule">Reschedule</button>
          </div>
        </div>

        <div class="appointment-item">
          <div class="appointment-time">
            <div class="appointment-date">Dec 15</div>
            <div class="appointment-hour">3:45 PM</div>
          </div>
          <div class="appointment-content">
            <div class="appointment-title">Dental Cleaning</div>
            <div class="appointment-doctor">Dr. Peter Kariuki</div>
            <div class="appointment-patient">For: Sarah (Age 32)</div>
            <div class="appointment-type">In-Person at Dental Care Clinic</div>
          </div>
          <div class="appointment-actions">
            <button class="btn-remind">Set Reminder</button>
            <button class="btn-reschedule">Reschedule</button>
          </div>
        </div>
      </div>
    `;
  };

  getFamilyHealthStatus = () => {
    return /* html */ `
      <div class="family-grid">
        <div class="family-member">
          <div class="member-avatar">
            <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="John Doe" />
          </div>
          <div class="member-info">
            <div class="member-name">John Doe</div>
            <div class="member-relation">Father</div>
            <div class="health-status good">Good Health</div>
            <div class="last-checkup">Last checkup: 2 weeks ago</div>
          </div>
          <div class="member-actions">
            <button class="btn-book">Book Appointment</button>
          </div>
        </div>

        <div class="family-member">
          <div class="member-avatar">
            <img src="https://randomuser.me/api/portraits/women/2.jpg" alt="Mary Doe" />
          </div>
          <div class="member-info">
            <div class="member-name">Mary Doe</div>
            <div class="member-relation">Mother</div>
            <div class="health-status attention">Needs Attention</div>
            <div class="last-checkup">Prescription needed</div>
          </div>
          <div class="member-actions">
            <button class="btn-book urgent">Urgent Care</button>
          </div>
        </div>

        <div class="family-member">
          <div class="member-avatar">
            <img src="https://randomuser.me/api/portraits/women/3.jpg" alt="Emma Doe" />
          </div>
          <div class="member-info">
            <div class="member-name">Emma Doe</div>
            <div class="member-relation">Daughter</div>
            <div class="health-status good">Good Health</div>
            <div class="last-checkup">Vaccination due next month</div>
          </div>
          <div class="member-actions">
            <button class="btn-book">Schedule Vaccine</button>
          </div>
        </div>

        <div class="add-member">
          <div class="add-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <div class="add-text">Add Family Member</div>
        </div>
      </div>
    `;
  };

  getTrustedProviders = () => {
    return /* html */ `
      <div class="providers-grid">
        <div class="provider-card">
          <div class="provider-header">
            <div class="provider-logo">
              <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzM2NzRiNSIvPgo8cGF0aCBkPSJNMjAgMTBWMzBNMTAgMjBIMzAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=" alt="Nairobi Hospital" />
            </div>
            <div class="provider-info">
              <div class="provider-name">Nairobi Hospital</div>
              <div class="provider-type">General Hospital</div>
              <div class="provider-rating">
                <span class="stars">★★★★★</span>
                <span class="rating-score">4.8</span>
              </div>
            </div>
          </div>
          <div class="provider-services">
            <span class="service-tag">Emergency</span>
            <span class="service-tag">Surgery</span>
            <span class="service-tag">Pediatrics</span>
          </div>
          <div class="provider-actions">
            <button class="btn-contact">Contact</button>
            <button class="btn-book-provider">Book Appointment</button>
          </div>
        </div>

        <div class="provider-card">
          <div class="provider-header">
            <div class="provider-logo">
              <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzU3OGZjYSIvPgo8cGF0aCBkPSJNMjAgMTBWMzBNMTAgMjBIMzAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=" alt="Aga Khan Hospital" />
            </div>
            <div class="provider-info">
              <div class="provider-name">Aga Khan Hospital</div>
              <div class="provider-type">Private Hospital</div>
              <div class="provider-rating">
                <span class="stars">★★★★☆</span>
                <span class="rating-score">4.6</span>
              </div>
            </div>
          </div>
          <div class="provider-services">
            <span class="service-tag">Cardiology</span>
            <span class="service-tag">Oncology</span>
            <span class="service-tag">Maternity</span>
          </div>
          <div class="provider-actions">
            <button class="btn-contact">Contact</button>
            <button class="btn-book-provider">Book Appointment</button>
          </div>
        </div>

        <div class="provider-card">
          <div class="provider-header">
            <div class="provider-logo">
              <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzM1NDY0OSIvPgo8cGF0aCBkPSJNMjAgMTBWMzBNMTAgMjBIMzAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=" alt="Kenyatta Hospital" />
            </div>
            <div class="provider-info">
              <div class="provider-name">Kenyatta Hospital</div>
              <div class="provider-type">National Referral</div>
              <div class="provider-rating">
                <span class="stars">★★★★☆</span>
                <span class="rating-score">4.2</span>
              </div>
            </div>
          </div>
          <div class="provider-services">
            <span class="service-tag">Specialized Care</span>
            <span class="service-tag">Research</span>
            <span class="service-tag">Training</span>
          </div>
          <div class="provider-actions">
            <button class="btn-contact">Contact</button>
            <button class="btn-book-provider">Book Appointment</button>
          </div>
        </div>
      </div>
    `;
  };

  getStyles = () => {
    return /* css */ `
      :host {
        display: block;
        width: 100%;
        background-color: var(--background);
        font-family: var(--font-text), sans-serif;
        line-height: 1.6;
        color: var(--text-color);
        min-height: 100vh;
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .dashboard-container {
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        padding: 0;
        background: var(--background);
      }

      /* Header Styles */
      .dashboard-header {
        background: var(--background);
        border-bottom: var(--border);
        padding: 10px 0;
        position: sticky;
        top: 0;
        z-index: 100;
        backdrop-filter: blur(10px);
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
      }

      .header-left {
        flex: 1;
        display: flex;
        flex-flow: column;
        gap: 0;
      }

      .dashboard-title {
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 1.4;
        color: var(--text-color);
        margin: 0;
        padding: 0;
      }

      .dashboard-subtitle {
        font-size: 0.85rem;
        font-family: var(--font-read);
        font-weight: 500;
        line-height: 1.4;
        color: var(--gray-color);
        margin: 0;
        padding: 0;
        opacity: 0.8;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 2rem;
      }

      .search-bar {
        position: relative;
        display: flex;
        align-items: center;
        background: var(--background-offset);
        border: var(--border);
        border-radius: 12px;
        padding: 8px 16px;
        min-width: 320px;
        transition: all 0.3s ease;
      }

      .search-bar:focus-within {
        border-color: var(--main);
        box-shadow: 0 0 0 3px rgba(54, 116, 181, 0.1);
      }

      .search-icon {
        color: var(--gray-color);
        margin-right: 12px;
        flex-shrink: 0;
      }

      .search-input {
        flex: 1;
        border: none;
        background: transparent;
        color: var(--text-color);
        font-size: 0.95rem;
        outline: none;
      }

      .search-input::placeholder {
        color: var(--gray-color);
        opacity: 0.7;
      }

      .tab-navigation {
        display: flex;
        align-items: center;
        gap: 15px;
        background: var(--background-offset);
        padding: 0;
      }

      .tab {
        padding: 5px 15px;
        border-radius: 12px;
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--gray-color);
        cursor: pointer;
        transition: all 0.2s ease;
        background: transparent;
        border: none;
        white-space: nowrap;
      }

      .tab:hover {
        background: var(--hover-background);
        color: var(--text-color);
      }

      .tab.active {
        background: var(--main);
        color: var(--white-color);
        font-weight: 600;
      }

      /* Main Content */
      .dashboard-main {
        padding: 20px 0 0 0;
      }

      .dashboard-grid {
        display: grid;
        gap: 20px;
        grid-template-columns: 1fr;
      }

      .section-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-color);
        margin: 0 0 1.5rem 0;
        position: relative;
        padding-bottom: 0.5rem;
      }

      .section-title::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 40px;
        height: 2px;
        background: var(--main);
        border-radius: 1px;
      }

      /* Metrics Section */
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .metric-card {
        background: var(--background);
        border: var(--border);
        border-radius: 12px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: all 0.3s ease;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }

      .metric-card::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--main);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .metric-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--card-box-shadow);
        border-color: var(--main);
      }

      .metric-card:hover::before {
        opacity: 1;
      }

      .metric-card.primary::before { background: var(--main); }
      .metric-card.success::before { background: var(--success-color); }
      .metric-card.warning::before { background: var(--warning-color); }
      .metric-card.info::before { background: var(--info-color); }

      .metric-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--white-color);
        flex-shrink: 0;
      }

      .metric-card.primary .metric-icon { background: var(--main); }
      .metric-card.success .metric-icon { background: var(--success-color); }
      .metric-card.warning .metric-icon { background: var(--warning-color); }
      .metric-card.info .metric-icon { background: var(--info-color); }

      .metric-content {
        flex: 1;
      }

      .metric-value {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--text-color);
        line-height: 1;
        margin-bottom: 0.25rem;
      }

      .metric-label {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 0.25rem;
      }

      .metric-sublabel {
        font-size: 0.8rem;
        color: var(--gray-color);
        opacity: 0.8;
      }

      /* Quick Actions */
      .quick-actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
      }

      .action-card {
        background: var(--poll-background);
        border-radius: 12px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: all 0.3s ease;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }

      .action-card::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--main);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .action-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--card-box-shadow);
        border-color: var(--main);
      }

      .action-card:hover::before {
        opacity: 1;
      }

      .action-card.primary::before { background: var(--main); }
      .action-card.secondary::before { background: var(--main-700); }
      .action-card.success::before { background: var(--success-color); }
      .action-card.warning::before { background: var(--warning-color); }
      .action-card.danger::before { background: var(--error-color); }
      .action-card.info::before { background: var(--info-color); }

      .action-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--white-color);
        flex-shrink: 0;
      }

      .action-card.primary .action-icon { background: var(--main); }
      .action-card.secondary .action-icon { background: var(--main-700); }
      .action-card.success .action-icon { background: var(--success-color); }
      .action-card.warning .action-icon { background: var(--warning-color); }
      .action-card.danger .action-icon { background: var(--error-color); }
      .action-card.info .action-icon { background: var(--info-color); }

      .action-content {
        flex: 1;
      }

      .action-content h3 {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-color);
        margin: 0 0 0.25rem 0;
      }

      .action-content p {
        font-size: 0.9rem;
        color: var(--gray-color);
        margin: 0;
        line-height: 1.4;
      }

      /* Recent Activity */
      .activity-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .activity-item {
        background: var(--background);
        border: var(--border);
        background: var(--hover-background);
        border-radius: 12px;
        padding: 1rem;
        display: flex;
        align-items: start;
        gap: 1rem;
        transition: all 0.2s ease;
      }

      .activity-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--white-color);
        flex-shrink: 0;
      }

      .activity-icon.consultation { background: var(--main); }
      .activity-icon.pharmacy { background: var(--success-color); }
      .activity-icon.payment { background: var(--warning-color); }

      .activity-content {
        flex: 1;
      }

      .activity-title {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 0.25rem;
      }

      .activity-description {
        font-size: 0.85rem;
        color: var(--gray-color);
        margin-bottom: 0.25rem;
      }

      .activity-time {
        font-size: 0.8rem;
        color: var(--gray-color);
        opacity: 0.7;
      }

      .activity-status {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        text-align: center;
        min-width: 80px;
      }

      .activity-status.completed {
        background: var(--success-background);
        color: var(--success-color);
      }

      .activity-status.pending {
        background: var(--warning-background);
        color: var(--warning-color);
      }

      /* Appointments */
      .appointments-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .appointment-item {
        background: var(--background);
        border: var(--border);
        border-radius: 12px;
        padding: 1.25rem;
        display: flex;
        gap: 1rem;
        transition: all 0.2s ease;
      }

      .appointment-item.urgent {
        border-color: var(--error-color);
        background: var(--error-background);
      }

      .appointment-item:hover {
        box-shadow: var(--card-box-shadow);
      }

      .appointment-time {
        flex-shrink: 0;
        text-align: center;
        min-width: 80px;
      }

      .appointment-date {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--main);
        margin-bottom: 0.25rem;
      }

      .appointment-hour {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text-color);
      }

      .appointment-content {
        flex: 1;
      }

      .appointment-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 0.25rem;
      }

      .appointment-doctor {
        font-size: 0.9rem;
        color: var(--main);
        font-weight: 500;
        margin-bottom: 0.25rem;
      }

      .appointment-patient {
        font-size: 0.85rem;
        color: var(--gray-color);
        margin-bottom: 0.25rem;
      }

      .appointment-type {
        font-size: 0.8rem;
        color: var(--gray-color);
        opacity: 0.8;
      }

      .appointment-actions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-end;
      }

      .appointment-actions button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 100px;
      }

      .btn-join {
        background: var(--success-color);
        color: var(--white-color);
      }

      .btn-join:hover {
        background: var(--success-hover);
      }

      .btn-reschedule, .btn-directions, .btn-remind {
        background: var(--background-offset);
        color: var(--text-color);
        border: var(--border);
      }

      .btn-reschedule:hover, .btn-directions:hover, .btn-remind:hover {
        background: var(--hover-background);
      }

      /* Family Section */
      .family-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
      }

      .family-member {
        background: var(--background);
        border: var(--border);
        border-radius: 12px;
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        transition: all 0.2s ease;
      }

      .family-member:hover {
        box-shadow: var(--card-box-shadow);
      }

      .member-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        margin: 0 auto;
      }

      .member-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .member-info {
        text-align: center;
      }

      .member-name {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 0.25rem;
      }

      .member-relation {
        font-size: 0.85rem;
        color: var(--gray-color);
        margin-bottom: 0.5rem;
      }

      .health-status {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
        display: inline-block;
      }

      .health-status.good {
        background: var(--success-background);
        color: var(--success-color);
      }

      .health-status.attention {
        background: var(--warning-background);
        color: var(--warning-color);
      }

      .last-checkup {
        font-size: 0.8rem;
        color: var(--gray-color);
        opacity: 0.8;
      }

      .member-actions {
        margin-top: auto;
      }

      .btn-book {
        width: 100%;
        padding: 0.75rem;
        border: none;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        background: var(--main);
        color: var(--white-color);
      }

      .btn-book:hover {
        background: var(--main-700);
      }

      .btn-book.urgent {
        background: var(--error-color);
      }

      .btn-book.urgent:hover {
        background: var(--error-hover);
      }

      .add-member {
        background: var(--background-offset);
        border: 2px dashed var(--border-color);
        border-radius: 12px;
        padding: 2rem 1.25rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: center;
      }

      .add-member:hover {
        border-color: var(--main);
        background: var(--hover-background);
      }

      .add-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--main);
        color: var(--white-color);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .add-text {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--text-color);
      }

      /* Providers Section */
      .providers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 1.5rem;
      }

      .provider-card {
        background: var(--background);
        border: var(--border);
        border-radius: 12px;
        padding: 1.25rem;
        transition: all 0.2s ease;
      }

      .provider-card:hover {
        box-shadow: var(--card-box-shadow);
        border-color: var(--main);
      }

      .provider-header {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .provider-logo {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        overflow: hidden;
        flex-shrink: 0;
      }

      .provider-logo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .provider-info {
        flex: 1;
      }

      .provider-name {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 0.25rem;
      }

      .provider-type {
        font-size: 0.85rem;
        color: var(--gray-color);
        margin-bottom: 0.5rem;
      }

      .provider-rating {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .stars {
        color: var(--warning-color);
        font-size: 0.9rem;
      }

      .rating-score {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-color);
      }

      .provider-services {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .service-tag {
        padding: 0.25rem 0.75rem;
        background: var(--background-offset);
        color: var(--text-color);
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .provider-actions {
        display: flex;
        gap: 0.75rem;
      }

      .btn-contact, .btn-book-provider {
        flex: 1;
        padding: 0.75rem;
        border: none;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-contact {
        background: var(--background-offset);
        color: var(--text-color);
        border: var(--border);
      }

      .btn-contact:hover {
        background: var(--hover-background);
      }

      .btn-book-provider {
        background: var(--main);
        color: var(--white-color);
      }

      .btn-book-provider:hover {
        background: var(--main-700);
      }

      /* Responsive Design */
      @media (max-width: 1024px) {
        .dashboard-header {
          padding: 1rem 1.5rem;
        }

        .dashboard-main {
          padding: 1.5rem;
        }

        .header-content {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }

        .header-right {
          flex-direction: column;
          gap: 1rem;
        }

        .search-bar {
          min-width: auto;
          width: 100%;
        }

        .tab-navigation {
          justify-content: center;
        }
      }

      @media (max-width: 768px) {
        .dashboard-header {
          padding: 1rem;
        }

        .dashboard-main {
          padding: 1rem;
        }

        .metrics-grid {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .quick-actions-grid {
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
        }

        .family-grid {
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
        }

        .providers-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .appointment-item {
          flex-direction: column;
          gap: 0.75rem;
        }

        .appointment-actions {
          flex-direction: row;
          align-items: center;
        }
      }

      @media (max-width: 480px) {
        .dashboard-header {
          padding: 0.75rem;
        }

        .dashboard-main {
          padding: 0.75rem;
        }

        .dashboard-title {
          font-size: 1.5rem;
        }

        .tab-navigation {
          padding: 2px;
        }

        .tab {
          padding: 6px 12px;
          font-size: 0.8rem;
        }

        .metrics-grid {
          grid-template-columns: 1fr;
        }

        .quick-actions-grid {
          grid-template-columns: 1fr;
        }

        .family-grid {
          grid-template-columns: 1fr;
        }

        .metric-card, .action-card, .activity-item {
          padding: 1rem;
        }

        .metric-icon, .action-icon {
          width: 40px;
          height: 40px;
        }

        .metric-value {
          font-size: 1.5rem;
        }
      }
    `;
  };
}
