# **Instruction Guide for Web App Pages and Modals (Diasync)**

This document outlines the structural and functional breakdown of the UI/UX components for a diaspora-to-Kenya health services platform. Use it as a detailed LLM prompt later to generate code or UI mocks.

---

## 1. Global Navigation Structure

### 1.1 Top Navbar (Persistent)

- **Left Section:**
  - Platform logo
  - Link to Homepage

- **Center Section:**
  - Universal Search Bar (autocomplete support for providers, services, locations)

- **Right Section:**
  - Notifications bell icon (for authenticated users only)
  - User profile picture dropdown
    - Profile Settings
    - My Account
    - Logout
  - If unauthenticated: show Login and Register buttons

### 1.2 Left Sidebar Navigation (Main Health Platform Navigation)

**Current 14-Section Navigation Structure:**

1. **Dashboard** - Main overview page

2. **Bookings** (8 sub-items):
   - Upcoming
   - Active
   - Requests
   - Completed
   - Cancelled
   - Add
   - Reschedule
   - History

3. **Meetings** (7 sub-items):
   - Live
   - History
   - Upcoming
   - Scheduled
   - Completed
   - Recordings
   - Transcripts

4. **Providers** (9 sub-items):
   - Directory
   - Doctors
   - Hospitals
   - Clinics
   - Specialists
   - Favorites
   - Reviews
   - Search
   - Compare

5. **Pharmacy** (7 sub-items):
   - Orders
   - Prescriptions
   - Delivery
   - History
   - Cart
   - Search
   - Refills

6. **Ambulance** (7 sub-items):
   - Dispatch
   - Requests
   - En Route
   - On Scene
   - Transport
   - Completed
   - Emergency

7. **Payments** (7 sub-items):
   - Failed
   - History
   - Refunds
   - Methods
   - Pending
   - Receipts
   - Completed

8. **Subscriptions** (7 sub-items):
   - Plans
   - Active
   - Billing
   - History
   - Pending
   - Expired
   - Cancelled

9. **Dependents** (8 sub-items):
   - Family
   - Elderly
   - Manage
   - History
   - Records
   - Chronic
   - Insurance
   - Emergency

10. **Health Reports** (7 sub-items):
    - Family
    - Impact
    - Analytics
    - Spending
    - Medication
    - Performance
    - Appointments

11. **Settings** (7 sub-items):
    - Export
    - Profile
    - Privacy
    - Security
    - Account
    - Preferences
    - Notifications

12. **Support** (6 sub-items):
    - Help
    - Learn
    - Guides
    - Tickets
    - Contact
    - Feedback

**Additional Navigation:**
13. **Updates** - Platform updates and announcements
14. **Themes** - UI theme customization

### 1.3 Chat System Integration

- Real-time chat system for provider communication
- Available throughout the platform for health consultations
- Secure messaging for health information exchange

---

## 2. Main Platform Pages

### 2.1 Dashboard

- Central health platform overview
- Quick access to all health services
- Recent activity summary
- Key health metrics and alerts

### 2.2 Bookings Management

- **Upcoming Bookings**: Future scheduled appointments
- **Active Bookings**: Currently ongoing consultations
- **Booking Requests**: Pending appointment requests
- **Completed Bookings**: Past appointments with records
- **Cancelled Bookings**: Cancelled appointment history
- **Add New Booking**: Schedule new appointments
- **Reschedule**: Modify existing appointments
- **Booking History**: Complete appointment archive

### 2.3 Video Meetings & Consultations

- **Live Meetings**: Active video consultations
- **Meeting History**: Past video consultation records
- **Upcoming Meetings**: Scheduled video appointments
- **Scheduled Meetings**: All planned video sessions
- **Completed Meetings**: Finished consultation records
- **Meeting Recordings**: Saved consultation videos
- **Meeting Transcripts**: Text records of consultations

### 2.4 Provider Network

- **Provider Directory**: Comprehensive healthcare provider listings
- **Doctors**: Individual physician profiles and availability
- **Hospitals**: Hospital and clinic information
- **Clinics**: Specialized clinic services
- **Specialists**: Specialist healthcare providers
- **Favorite Providers**: Saved preferred providers
- **Provider Reviews**: Rating and feedback system
- **Provider Search**: Advanced search functionality
- **Provider Comparison**: Side-by-side provider analysis

### 2.5 Pharmacy Services

- **Pharmacy Orders**: Medication order management
- **Prescriptions**: Digital prescription handling
- **Delivery Tracking**: Medication delivery status
- **Order History**: Past pharmacy orders
- **Shopping Cart**: Current medication orders
- **Medication Search**: Find specific medications
- **Prescription Refills**: Renew existing prescriptions

### 2.6 Emergency & Ambulance Services

- **Ambulance Dispatch**: Emergency service requests
- **Service Requests**: Ambulance booking requests
- **En Route Status**: Real-time ambulance tracking
- **On Scene Updates**: Live emergency response status
- **Transport Coordination**: Patient transport management
- **Completed Services**: Finished emergency responses
- **Emergency Protocols**: Critical emergency procedures

### 2.7 Financial Management

- **Payment Processing**: Secure payment handling
- **Failed Payments**: Payment issue resolution
- **Payment History**: Complete transaction records
- **Refund Management**: Refund request processing
- **Payment Methods**: Saved payment options
- **Pending Payments**: Outstanding payment status
- **Digital Receipts**: Electronic payment receipts
- **Completed Transactions**: Successful payment records

### 2.8 Subscription Services

- **Subscription Plans**: Available health plan options
- **Active Subscriptions**: Current active plans
- **Billing Management**: Subscription billing details
- **Subscription History**: Past subscription records
- **Pending Subscriptions**: Awaiting activation
- **Expired Plans**: Inactive subscription history
- **Cancelled Subscriptions**: Terminated plan records

### 2.9 Family & Dependent Care

- **Family Management**: Family member health profiles
- **Elderly Care**: Specialized senior care services
- **Dependent Management**: Add/edit family members
- **Care History**: Family health service records
- **Health Records**: Family medical record storage
- **Chronic Condition Management**: Ongoing health monitoring
- **Insurance Management**: Family health insurance
- **Emergency Contacts**: Family emergency information

### 2.10 Health Analytics & Reports

- **Family Health Reports**: Comprehensive family health analytics
- **Remittance Impact**: Health spending impact analysis
- **Health Analytics**: Advanced health data insights
- **Spending Reports**: Health expenditure analysis
- **Medication Tracking**: Prescription adherence monitoring
- **Provider Performance**: Healthcare provider analytics
- **Appointment Analytics**: Consultation pattern analysis

### 2.11 Platform Settings

- **Data Export**: Personal health data export
- **Profile Management**: User profile settings
- **Privacy Controls**: Data privacy management
- **Security Settings**: Account security options
- **Account Management**: General account settings
- **User Preferences**: Platform customization
- **Notification Settings**: Communication preferences

### 2.12 Support & Resources

- **Help Center**: Comprehensive help documentation
- **Learning Resources**: Educational health content
- **User Guides**: Platform usage instructions
- **Support Tickets**: Customer service requests
- **Contact Support**: Direct support communication
- **Feedback System**: User feedback and suggestions

### 2.13 Platform Features

- **Platform Updates**: New feature announcements
- **Theme Customization**: UI appearance settings

---

## 3. Technical Implementation Notes

### 3.1 Navigation Structure

- Shadow DOM web components architecture
- Single-word sub-navigation pattern for mobile optimization
- Comprehensive routing system with 14 main sections
- All navigation items use consistent naming convention

### 3.2 Health Platform Focus

- Diaspora-to-Kenya health services specialization
- Integration of video consultations, pharmacy services, and emergency care
- Family-centered health management approach
- Real-time tracking for ambulance and emergency services

### 3.3 User Experience Design

- Responsive design for desktop and mobile platforms
- Intuitive navigation with clear health service categorization
- Consistent UI patterns across all platform sections
- Accessibility considerations for diverse user base

---

## 4. Global Modals and Dialogs

- **Login/Register:**
  - Email/password fields, two-step registration with role selection
- **Forgot Password:**
  - Email-based reset
- **Add/Edit Dependent:**
  - Name, relationship, DOB, contact details
- **Booking Confirmation Dialog:**
  - Confirm date/time, service, dependent
- **Cancel Booking Modal:**
  - Require reason + warning
- **Prescription Upload:**
  - File input with image preview
- **Chat File Upload:**
  - Optional preview or drag-and-drop
- **Confirm Dispatch Ambulance:**
  - Patient location, notes, ETA estimate
- **Document Upload for Providers:**
  - File upload with category tags

---

This guide provides a comprehensive map of the current Diasync health platform navigation structure and functionality. Use it as a structured, detailed prompt when generating interfaces, components, or user flows in code or design tools.
