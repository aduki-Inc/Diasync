const urls = {
  "/": /* HTML */`<health-home></health-home>`,
  "/providers": /* HTML */`<provider-directory api="/providers/directory"></provider-directory>`,
  "/bookings": /* HTML */`<booking-management api="/bookings/all"></booking-management>`,
  "/payments": /* HTML */`
    <wallet-account account="EAC65376462I" balance="94672.1" status="active" since="2021-09-12T12:00:00Z"
      last-spent="47894.65" last-deposited="695212.5" current-spent="98854.5" current-deposited="737512.5" last-earned="86687.54" current-earned="9357.43">
    </wallet-account>
  `,

  "/pharmacy": /* HTML */`
    <products-feed name="Pharmacy Medicines" kind="pharmacy" all="124">
      <p>Browse medicines and over-the-counter (OTC) drugs available at partnered pharmacies. <br/> Search by brand, generic name, or active ingredient.</p>
      <p>Check real-time stock and availability at nearby pharmacies, view dosing information and safety warnings, and choose pickup or delivery options.
      <br/>Prescription-only medicines require a valid prescription. Request prescription verification and consult a pharmacist for interactions and guidance.</p>
    </products-feed>
  `,
  "/ambulance": /* HTML */`<ambulance-dispatch api="/ambulance/dispatch"></ambulance-dispatch>`,
  "/dependents": /* HTML */`<dependent-management api="/dependents/all"></dependent-management>`,
  "/subscriptions": /* HTML */`<subscription-management api="/subscriptions/active"></subscription-management>`,
  "/settings": /* HTML */`<user-settings api="/settings/profile"></user-settings>`,

  /* Enhanced Health Platform Routes */
  "/bookings/all": /* HTML */`<bookings-container name="Boookings" active="all" all="124"></bookings-container>`,
  "/bookings/pending": /* HTML */`<bookings-container name="Boookings" active="pending" all="124"></bookings-container>`,
  "/bookings/upcoming": /* HTML */`<bookings-container name="Boookings" active="upcoming" all="124"></bookings-container>`,

  /* Meeting & Video Call Routes */
  "/meetings/upcoming": /* HTML */`<upcoming-meetings api="/meetings/upcoming"></upcoming-meetings>`,
  "/meetings/live": /* HTML */`<live-sessions api="/meetings/live"></live-sessions>`,
  "/meetings/scheduled": /* HTML */`<scheduled-meetings api="/meetings/scheduled"></scheduled-meetings>`,
  "/meetings/completed": /* HTML */`<completed-meetings api="/meetings/completed"></completed-meetings>`,
  "/meetings/recordings": /* HTML */`<meeting-recordings api="/meetings/recordings"></meeting-recordings>`,
  "/meetings/transcripts": /* HTML */`<meeting-transcripts api="/meetings/transcripts"></meeting-transcripts>`,
  "/meetings/join-room": /* HTML */`<meeting-room api="/meetings/join-room"></meeting-room>`,
  "/meetings/test-connection": /* HTML */`<connection-test api="/meetings/test-connection"></connection-test>`,

  "/providers/manage": /* HTML */`
    <provider-page kind="org" owner="true" verified="true" name="Marketplace" desc="This section provides a detailed overview of all the products available in the marketplace."></provider-page>
  `,

  "/providers/specialists": /* HTML */`
    <specialists-container name="Specialists" kind="pharmacy" all="124">
      <p>Browse specialists available at partnered pharmacies. <br/> Search by name, specialty, or location.</p>
      <p>Check real-time availability at nearby pharmacies, view profiles and qualifications, and choose in-person or telehealth options.
      <br/>Prescription-only consultations require a valid prescription. Request prescription verification and consult a pharmacist for interactions and guidance.</p>
    </specialists-container>
  `,

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

  /* Orders Routes */
  "/orders/cart": /* HTML */`
    <cart-container empty="false" name="Shopping Cart" kind="all">
      <p>This section provides a detailed overview of all the items in your shopping cart, showing medicine names, dosages, quantities, individual prices and current stock at partner pharmacies.</p>
      <p>For prescription-only medicines, ensure you have a valid prescription ready for verification during checkout.</p>
    </cart-container>
  `,
  "/orders/all": /* HTML */`<family-health-report api="/reports/family-health"></family-health-report>`,

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