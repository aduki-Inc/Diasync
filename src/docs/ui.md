# **Instruction Guide for Web App Pages and Modals(Diasync)**

This document outlines the structural and functional breakdown of the UI/UX components for a diaspora-to-Kenya health services platform. Use it as a detailed LLM prompt later to generate code or UI mocks.

---

### 1. Global Navigation Structure

#### 1.1 Top Navbar (Persistent)

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

#### 1.2 Left Sidebar Navigation (Role-Specific, Persistent)

- Conditionally rendered based on user role

- **Remote Booker (Diaspora User):**
  - Dashboard
  - Provider Directory
  - My Bookings
  - My Orders (Pharmacy)
  - Dispatch Ambulance
  - Manage Dependents
  - Payment History
  - Settings
  - Support Center

- **Provider Admin (Hospital/Pharmacy/Ambulance):**
  - Dashboard Overview
  - Facility Profile
  - Staff Management
  - Schedule/Availability
  - Appointment Management
  - Pharmacy Orders
  - Ambulance Requests
  - Financials & Payouts
  - Compliance Documents
  - Chat

- **Provider Staff (Doctor, Pharmacist):**
  - My Appointments
  - My Availability
  - My Profile
  - Messages (Chat)
  - Earnings Summary

- **Platform Administrator:**
  - Global Dashboard
  - User Management
  - Provider Onboarding & Verification Queue
  - Complaints Management
  - Audit Logs
  - Content Moderation
  - Feature Toggles

#### 1.3 Right Sidebar Chat Panel (Expandable/Collapsible)

- Real-time chat system
- Filter threads by booking, pharmacy order, ambulance request
- Display recipient or provider name, status, and recent message preview
- Open message thread displays:
  - Message timeline
  - Send box with text input and attachment option
  - Typing indicator, message status (sent, read)

---

### 2. Public-Facing Pages

#### 2.1 Homepage

- Hero banner with platform value proposition
- “How It Works” visual walkthrough
- Sections for:
  - Provider Assurance (Trust, Licensing, Security)
  - Service Categories (Doctors, Hospitals, Pharmacies, Ambulances)
  - Testimonials from Bookers and Providers
  - Call-to-Action (Sign up / Browse Providers)

#### 2.2 About Us

- Mission and Vision
- Founding Team
- Advisory Board (Optional)
- Impact Metrics / Press Mentions

#### 2.3 Contact Us

- Contact form (name, email, message)
- Location map of HQ (if applicable)
- Support contact info (phone, email, live chat link)

#### 2.4 FAQ / Help Center

- Accordion or category-based layout
- Topics include:
  - Booking Help
  - Prescription Upload
  - Payment Questions
  - Technical Issues

#### 2.5 Legal Pages

- Terms of Service
- Privacy Policy (with emphasis on DPA compliance)
- Cookie Policy
- Data Protection Notice

---

### 3. Authenticated Booker (Remote User) Pages

#### 3.1 Dashboard

- Overview widgets:
  - Next Appointment / Active Orders
  - Booking Stats (this month)
  - Dependents Summary

#### 3.2 Provider Directory

- Search and filter system:
  - Provider Type, Specialty, Rating, Location Radius
- Results grid/list view
- Each card shows license badge, availability, rating

#### 3.3 Provider Profile Page

- Header with name, license badge, map
- Tabs:
  - Overview (About, Services)
  - Availability (Calendar view)
  - Credentials (certifications, affiliations)
  - Ratings & Reviews

#### 3.4 Booking Flow

- Step 1: Choose Service Type (Video or In-Person)
- Step 2: Select Dependent (or add new)
- Step 3: Choose Time Slot
- Step 4: Add Optional Notes
- Step 5: Payment Method Selection (Card/Mpesa)
- Step 6: Booking Summary + Confirmation
- Post-confirmation: receipt email + appointment link (if virtual)

#### 3.5 My Bookings Page

- Tabbed Interface:
  - Upcoming, Completed, Canceled
- Each item shows:
  - Status, provider info, service type, date/time
  - Option to message provider, reschedule, cancel

#### 3.6 Dependents Management

- List of added recipients
- Add/Edit Modal:
  - Name, Phone, Location, Gender, DOB, Relationship
  - Emergency Contact (optional)

#### 3.7 Pharmacy Orders

- Search Products
- Add to cart
- Cart Page:
  - Upload prescription (if required)
  - Choose Delivery or Pickup
  - Select Fulfillment Time (optional)
  - Payment

#### 3.8 Ambulance Dispatch

- Location Picker
- Map-based provider selector (with ETA)
- Option to flag as Emergency
- Confirmation + live status page (En route, On Scene, Complete)

#### 3.9 Payment History

- List of all transactions
- Filter by type: Booking, Pharmacy, Ambulance
- Receipt download option

#### 3.10 Settings

- Profile details
- Preferred time zone
- Email, phone, password update
- Notification Preferences

---

### 4. Provider Pages

#### 4.1 Dashboard (Admin)

- KPIs: Appointments, Orders, Revenue
- Compliance Reminders (License expiry, uploads)
- Quick links to update services or profile

#### 4.2 Facility Profile Management

- General Info
- Services & Pricing
- Operating Hours
- License & Accreditation Uploads
- Contact & Location Management

#### 4.3 Staff Management

- Add/Remove staff members
- Assign specialties
- View/edit their schedules

#### 4.4 Calendar / Availability

- Weekly/hourly slots
- Bulk upload support
- Block dates

#### 4.5 Appointment Queue

- View by day
- Filter by staff
- Join virtual call button
- Mark as completed / no-show
- Add service notes post-consultation

#### 4.6 Pharmacy Orders

- Live Queue: Pending > Confirmed > Fulfilled
- View Rx
- Accept/Reject button
- Notify delivery rider (optional integration)

#### 4.7 Ambulance Requests

- Request list with timestamps
- Manual Status Update:
  - En Route, On Scene, Hospital Drop
- Live toggle for availability

#### 4.8 Messages (Chat)

- Threaded view per service
- Provider-staff shared inbox

#### 4.9 Payouts

- View balance, withdrawal history
- Link Mpesa/Bank account

---

### 5. Admin-Only Pages

#### 5.1 Admin Dashboard

- Platform stats:
  - User count, booking volume, active providers
  - Charted KPIs (week/month/year)

#### 5.2 Verification Panel

- Submission list
- Detailed application review modal
- Direct links to verify license with PPB/KMPDC
- Status toggle: Approved / Rejected (with reason)

#### 5.3 Complaint Resolution

- Ticket list
- Filtering by status and date
- View conversation thread
- Action: Mark resolved, escalate, refund request

#### 5.4 User Management

- Search by email, name, phone
- Role-based filtering
- View user activity logs

#### 5.5 Audit Logs

- All CRUD actions by date/time
- Filter by user role, module (e.g., Bookings, Profile Edits)

#### 5.6 Content Moderation

- Pending reviews
- Edited profile bios (pending approval)

---

### 6. Global Modals and Dialogs

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

This guide provides a comprehensive map of every page, panel, and modal required to build the platform's UI. Use it as a structured, detailed prompt when generating interfaces, components, or user flows in code or design tools.
