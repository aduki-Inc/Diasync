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

  "/providers/provider": /* HTML */`
    <provider-page kind="org" owner="false" verified="true" name="Marketplace" desc="This section provides a detailed overview of all the products available in the marketplace."></provider-page>
  `,

  "/providers/specialists": /* HTML */`
    <specialists-container name="Specialists" kind="pharmacy" all="124">
      <p>Browse specialists available at partnered pharmacies. <br/> Search by name, specialty, or location.</p>
      <p>Check real-time availability at nearby pharmacies, view profiles and qualifications, and choose in-person or telehealth options.
      <br/>Prescription-only consultations require a valid prescription. Request prescription verification and consult a pharmacist for interactions and guidance.</p>
    </specialists-container>
  `,

  "/providers/services": /* HTML */`
    <services-container name="Services" kind="pharmacy" all="124">
      <p>Browse medicines and over-the-counter (OTC) drugs available at partnered pharmacies. <br/> Search by brand, generic name, or active ingredient.</p>
      <p>Check real-time stock and availability at nearby pharmacies, view dosing information and safety warnings, and choose pickup or delivery options.
      <br/>Prescription-only medicines require a valid prescription. Request prescription verification and consult a pharmacist for interactions and guidance.</p>
    </services-container>
  `,

  /* Pharmacy */
  "/pharmacy/products": /* HTML */`
    <products-feed name="Pharmacy Medicines" kind="pharmacy" all="124">
      <p>Browse medicines and over-the-counter (OTC) drugs available at partnered pharmacies. <br/> Search by brand, generic name, or active ingredient.</p>
      <p>Check real-time stock and availability at nearby pharmacies, view dosing information and safety warnings, and choose pickup or delivery options.
      <br/>Prescription-only medicines require a valid prescription. Request prescription verification and consult a pharmacist for interactions and guidance.</p>
    </products-feed>
  `,

  "/pharmacy/manage": /* HTML */`
    <store-container name="Marketplace" desc="This section provides a detailed overview of all the products available in the marketplace."></store-container>
  `,

  /* Orders Routes */
  "/orders/cart": /* HTML */`
    <cart-container empty="false" name="Shopping Cart" kind="all">
      <p>This section provides a detailed overview of all the items in your shopping cart, showing medicine names, dosages, quantities, individual prices and current stock at partner pharmacies.</p>
      <p>For prescription-only medicines, ensure you have a valid prescription ready for verification during checkout.</p>
    </cart-container>
  `,
  "/orders/all": /* HTML */`<family-health-report api="/reports/family-health"></family-health-report>`,

  /* Support & Help */
  "/support": /* HTML */`<support-center api="/support/center"></support-center>`,
  "/help": /* HTML */`<help-center api="/help/center"></help-center>`,
  "/about": /* HTML */`<about-page api="/about"></about-page>`,
  "/contact": /* HTML */`<contact-page api="/contact"></contact-page>`,

  default: /* HTML */`<health-home></health-home>`,
}

export default urls;