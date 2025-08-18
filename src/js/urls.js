const urls = {
  "/": /* HTML */`<health-home></health-home>`,
  "/providers": /* HTML */`<provider-directory api="/providers/directory"></provider-directory>`,
  "/bookings": /* HTML */`<booking-management api="/bookings/all"></booking-management>`,
  "/meetings": /* HTML */`<meeting-management api="/meetings/dashboard"></meeting-management>`,
  "/pharmacy": /* HTML */`<pharmacy-orders api="/pharmacy/orders"></pharmacy-orders>`,
  "/ambulance": /* HTML */`<ambulance-dispatch api="/ambulance/dispatch"></ambulance-dispatch>`,
  "/dependents": /* HTML */`<dependent-management api="/dependents/all"></dependent-management>`,
  "/payments": /* HTML */`<payment-history api="/payments/history"></payment-history>`,
  "/subscriptions": /* HTML */`<subscription-management api="/subscriptions/active"></subscription-management>`,
  "/settings": /* HTML */`<user-settings api="/settings/profile"></user-settings>`,

  /* Enhanced Health Platform Routes */
  "/bookings/telemedicine": /* HTML */`<telemedicine-bookings api="/bookings/telemedicine"></telemedicine-bookings>`,
  "/bookings/in-person": /* HTML */`<in-person-bookings api="/bookings/in-person"></in-person-bookings>`,
  "/bookings/video-calls": /* HTML */`<video-call-management api="/bookings/video-calls"></video-call-management>`,

  /* Meeting & Video Call Routes */
  "/meetings/upcoming": /* HTML */`<upcoming-meetings api="/meetings/upcoming"></upcoming-meetings>`,
  "/meetings/live": /* HTML */`<live-sessions api="/meetings/live"></live-sessions>`,
  "/meetings/scheduled": /* HTML */`<scheduled-meetings api="/meetings/scheduled"></scheduled-meetings>`,
  "/meetings/completed": /* HTML */`<completed-meetings api="/meetings/completed"></completed-meetings>`,
  "/meetings/recordings": /* HTML */`<meeting-recordings api="/meetings/recordings"></meeting-recordings>`,
  "/meetings/transcripts": /* HTML */`<meeting-transcripts api="/meetings/transcripts"></meeting-transcripts>`,
  "/meetings/join-room": /* HTML */`<meeting-room api="/meetings/join-room"></meeting-room>`,
  "/meetings/test-connection": /* HTML */`<connection-test api="/meetings/test-connection"></connection-test>`,

  "/providers/kmpdc-verified": /* HTML */`<kmpdc-verified-providers api="/providers/kmpdc-verified"></kmpdc-verified-providers>`,
  "/providers/verification-status": /* HTML */`<provider-verification api="/providers/verification-status"></provider-verification>`,
  "/providers/ratings": /* HTML */`<provider-ratings api="/providers/ratings"></provider-ratings>`,
  "/providers/compliance": /* HTML */`<provider-compliance api="/providers/compliance"></provider-compliance>`,
  "/pharmacy/prescriptions": /* HTML */`<prescription-management api="/pharmacy/prescriptions"></prescription-management>`,
  "/pharmacy/otc-products": /* HTML */`<otc-products api="/pharmacy/otc-products"></otc-products>`,
  "/dependents/health-records": /* HTML */`<health-records api="/dependents/health-records"></health-records>`,
  "/dependents/medical-history": /* HTML */`<medical-history api="/dependents/medical-history"></medical-history>`,
  "/dependents/emergency-contacts": /* HTML */`<emergency-contacts api="/dependents/emergency-contacts"></emergency-contacts>`,
  "/dependents/elderly-care": /* HTML */`<elderly-care-management api="/dependents/elderly-care"></elderly-care-management>`,
  "/dependents/chronic-conditions": /* HTML */`<chronic-conditions api="/dependents/chronic-conditions"></chronic-conditions>`,
  "/settings/timezone": /* HTML */`<timezone-settings api="/settings/timezone"></timezone-settings>`,
  "/settings/privacy": /* HTML */`<privacy-settings api="/settings/privacy"></privacy-settings>`,

  /* Health Reports & Analytics Routes */
  "/reports/health-analytics": /* HTML */`<health-analytics api="/reports/health-analytics"></health-analytics>`,
  "/reports/family-health": /* HTML */`<family-health-report api="/reports/family-health"></family-health-report>`,
  "/reports/spending-summary": /* HTML */`<health-spending-report api="/reports/spending-summary"></health-spending-report>`,
  "/reports/appointment-history": /* HTML */`<appointment-history-report api="/reports/appointment-history"></appointment-history-report>`,
  "/reports/medication-tracking": /* HTML */`<medication-tracking-report api="/reports/medication-tracking"></medication-tracking-report>`,
  "/reports/provider-performance": /* HTML */`<provider-performance-report api="/reports/provider-performance"></provider-performance-report>`,
  "/reports/remittance-impact": /* HTML */`<remittance-impact-report api="/reports/remittance-impact"></remittance-impact-report>`,

  /* Provider Admin Routes */
  "/provider/dashboard": /* HTML */`<provider-dashboard api="/provider/dashboard"></provider-dashboard>`,
  "/provider/profile": /* HTML */`<provider-profile api="/provider/profile"></provider-profile>`,
  "/provider/staff": /* HTML */`<staff-management api="/provider/staff"></staff-management>`,
  "/provider/schedule": /* HTML */`<schedule-management api="/provider/schedule"></schedule-management>`,
  "/provider/appointments": /* HTML */`<appointment-management api="/provider/appointments"></appointment-management>`,
  "/provider/orders": /* HTML */`<provider-orders api="/provider/pharmacy/orders"></provider-orders>`,
  "/provider/ambulance": /* HTML */`<ambulance-requests api="/provider/ambulance/requests"></ambulance-requests>`,
  "/provider/financials": /* HTML */`<provider-financials api="/provider/financials"></provider-financials>`,
  "/provider/compliance": /* HTML */`<compliance-documents api="/provider/compliance"></compliance-documents>`,

  /* Provider Staff Routes */
  "/staff/appointments": /* HTML */`<staff-appointments api="/staff/appointments"></staff-appointments>`,
  "/staff/availability": /* HTML */`<staff-availability api="/staff/availability"></staff-availability>`,
  "/staff/profile": /* HTML */`<staff-profile api="/staff/profile"></staff-profile>`,
  "/staff/earnings": /* HTML */`<staff-earnings api="/staff/earnings"></staff-earnings>`,

  /* Platform Admin Routes */
  "/admin/dashboard": /* HTML */`<admin-dashboard api="/admin/dashboard"></admin-dashboard>`,
  "/admin/users": /* HTML */`<admin-users api="/admin/users"></admin-users>`,
  "/admin/verification": /* HTML */`<admin-verification api="/admin/verification"></admin-verification>`,
  "/admin/complaints": /* HTML */`<admin-complaints api="/admin/complaints"></admin-complaints>`,
  "/admin/audit": /* HTML */`<admin-audit api="/admin/audit"></admin-audit>`,
  "/admin/content": /* HTML */`<admin-content api="/admin/content"></admin-content>`,

  /* Support & Help */
  "/support": /* HTML */`<support-center api="/support/center"></support-center>`,
  "/help": /* HTML */`<help-center api="/help/center"></help-center>`,
  "/about": /* HTML */`<about-page api="/about"></about-page>`,
  "/contact": /* HTML */`<contact-page api="/contact"></contact-page>`,

  default: /* HTML */`<health-home></health-home>`,
}

export default urls;