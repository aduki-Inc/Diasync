export default class ProductsFeed extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.utils = window.app.utils;

    this.render();
    // active tab
    this.active_tab = null;
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    const tabs = this.shadowObj.querySelector("ul.tabs");

    if (tabs) {
      this.activateTabController(tabs);
    }
  }

  activateTabController = tabs => {
    // get the active tab
    this.getOrSetActiveTab(tabs);

    // add click event listener to the tabs
    tabs.querySelectorAll("li").forEach(tab => {
      tab.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        // remove the active class from the active tab
        this.active_tab.classList.remove("active");

        // set the new active tab
        this.active_tab = tab;
        this.active_tab.classList.add("active");

        //TODO: hide the tab content
      });
    });
  }

  getOrSetActiveTab = tabs => {
    // get the active tab
    let activeTab = tabs.querySelector("li.active");

    if (!activeTab) {
      // if no active tab, set the first tab as active
      activeTab = tabs.querySelector("li");
      activeTab.classList.add("active");
      this.active_tab = activeTab;
    }

    // else set the active tab
    this.active_tab = activeTab;
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    return /* html */`
      ${this.getInfo()}
    `;
  }

  getInfo = () => {
    return /* html */`
      <div class="content">
        ${this.getHead()}
        <div class="sticky">
          ${this.getSearch()}
          ${this.getTab()}
        </div>
        <div class="products">
          ${this.getProducts()}
        </div>
        ${this.getPagination({ current: 13, total: 24 })}
      </div>
    `;
  }

  getHead = () => {
    return /* html */`
      <div class="head">
        <h3 class="title">${this.getAttribute("name")}</h3>
        <div class="desc">
          ${this.innerHTML}
        </div>
      </div>
    `;
  }

  getTab = () => {
    return /* html */`
      <ul class="tabs">
        <li class="tab">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M12.5 3H11.5C7.02166 3 4.78249 3 3.39124 4.39124C2 5.78249 2 8.02166 2 12.5C2 16.9783 2 19.2175 3.39124 20.6088C4.78249 22 7.02166 22 11.5 22C15.9783 22 18.2175 22 19.6088 20.6088C21 19.2175 21 16.9783 21 12.5V11.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M22 5.5C22 7.433 20.433 9 18.5 9C16.567 9 15 7.433 15 5.5C15 3.567 16.567 2 18.5 2C20.433 2 22 3.567 22 5.5Z" stroke="currentColor" stroke-width="1.8" />
            <path d="M7 11H11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7 16H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">All</span>
        </li>
        <li class="tab active">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M3.06164 15.1933L3.42688 13.1219C3.85856 10.6736 4.0744 9.44952 4.92914 8.72476C5.78389 8 7.01171 8 9.46734 8H14.5327C16.9883 8 18.2161 8 19.0709 8.72476C19.9256 9.44952 20.1414 10.6736 20.5731 13.1219L20.9384 15.1933C21.5357 18.5811 21.8344 20.275 20.9147 21.3875C19.995 22.5 18.2959 22.5 14.8979 22.5H9.1021C5.70406 22.5 4.00504 22.5 3.08533 21.3875C2.16562 20.275 2.4643 18.5811 3.06164 15.1933Z" stroke="currentColor" stroke-width="1.5" />
            <path d="M7.5 8L7.66782 5.98618C7.85558 3.73306 9.73907 2 12 2C14.2609 2 16.1444 3.73306 16.3322 5.98618L16.5 8" stroke="currentColor" stroke-width="1.5" />
            <path d="M15 11C14.87 12.4131 13.5657 13.5 12 13.5C10.4343 13.5 9.13002 12.4131 9 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <span class="text">What's New</span>
        </li>
        <li class="tab">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M7.69171 19.6161C8.28274 19.6161 8.57825 19.6161 8.84747 19.716C8.88486 19.7298 8.92172 19.7451 8.95797 19.7617C9.21897 19.8815 9.42793 20.0904 9.84585 20.5083C10.8078 21.4702 11.2887 21.9512 11.8805 21.9955C11.96 22.0015 12.04 22.0015 12.1195 21.9955C12.7113 21.9512 13.1923 21.4702 14.1541 20.5083C14.5721 20.0904 14.781 19.8815 15.042 19.7617C15.0783 19.7451 15.1151 19.7298 15.1525 19.716C15.4218 19.6161 15.7173 19.6161 16.3083 19.6161H16.4173C17.9252 19.6161 18.6792 19.6161 19.1476 19.1476C19.6161 18.6792 19.6161 17.9252 19.6161 16.4173V16.3083C19.6161 15.7173 19.6161 15.4218 19.716 15.1525C19.7298 15.1151 19.7451 15.0783 19.7617 15.042C19.8815 14.781 20.0904 14.5721 20.5083 14.1541C21.4702 13.1923 21.9512 12.7113 21.9955 12.1195C22.0015 12.04 22.0015 11.96 21.9955 11.8805C21.9512 11.2887 21.4702 10.8078 20.5083 9.84585C20.0904 9.42793 19.8815 9.21897 19.7617 8.95797C19.7451 8.92172 19.7298 8.88486 19.716 8.84747C19.6161 8.57825 19.6161 8.28274 19.6161 7.69171V7.58269C19.6161 6.07479 19.6161 5.32083 19.1476 4.85239C18.6792 4.38394 17.9252 4.38394 16.4173 4.38394H16.3083C15.7173 4.38394 15.4218 4.38394 15.1525 4.28405C15.1151 4.27018 15.0783 4.25491 15.042 4.23828C14.781 4.11855 14.5721 3.90959 14.1541 3.49167C13.1923 2.52977 12.7113 2.04882 12.1195 2.00447C12.04 1.99851 11.96 1.99851 11.8805 2.00447C11.2887 2.04882 10.8078 2.52977 9.84585 3.49167C9.42793 3.90959 9.21897 4.11855 8.95797 4.23828C8.92172 4.25491 8.88486 4.27018 8.84747 4.28405C8.57825 4.38394 8.28274 4.38394 7.69171 4.38394H7.58269C6.07479 4.38394 5.32083 4.38394 4.85239 4.85239C4.38394 5.32083 4.38394 6.07479 4.38394 7.58269V7.69171C4.38394 8.28274 4.38394 8.57825 4.28405 8.84747C4.27018 8.88486 4.25491 8.92172 4.23828 8.95797C4.11855 9.21897 3.90959 9.42793 3.49167 9.84585C2.52977 10.8078 2.04882 11.2887 2.00447 11.8805C1.99851 11.96 1.99851 12.04 2.00447 12.1195C2.04882 12.7113 2.52977 13.1923 3.49167 14.1541C3.90959 14.5721 4.11855 14.781 4.23828 15.042C4.25491 15.0783 4.27018 15.1151 4.28405 15.1525C4.38394 15.4218 4.38394 15.7173 4.38394 16.3083V16.4173C4.38394 17.9252 4.38394 18.6792 4.85239 19.1476C5.32083 19.6161 6.07479 19.6161 7.58269 19.6161H7.69171Z" stroke="currentColor" stroke-width="1.5" />
            <path d="M15 9L9 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15 15H14.9892M9.01076 9H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">Offers</span>
        </li>
      </ul>
    `;
  }

  getSearch = () => {
    return /* html */`
      <form action="" method="get" class="search">
        <div class="contents">
          <input type="text" name="q" id="query" placeholder="Search for products..." />
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11.7666" cy="11.7667" r="8.98856" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"  stroke-linejoin="round" />
            <path d="M18.0183 18.4853L21.5423 22.0001" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <button type="submit">Search</button>
        </div>
      </form>
    `;
  }

  getProducts = () => {
    return /* html */`
      <div is="product-wrapper" product-image="/src/img/products/drug1.jpg" name="Paracetamol 500mg Tablets - Pain & Fever Relief" last="5048.50" store="HealthCare Plus Pharmacy" reviews="32894" average-review="4.7" wished="true" in-cart="0" quantity="150" price="4598.50" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug2.jpg" name="Ibuprofen 400mg Capsules - Anti-inflammatory" last="712.25" store="HealthCare Plus Pharmacy" reviews="185" average-review="4.3" wished="false" in-cart="2" quantity="89" price="152.25" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug3.jpg" name="Amoxicillin 250mg Syrup - Antibiotic" last="824.75" store="HealthCare Plus Pharmacy" reviews="9546" average-review="4.5" wished="true" in-cart="0" quantity="45" price="247.75" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug4.jpg" name="Dextromethorphan Cough Syrup - Respiratory Relief" last="215.80" store="HealthCare Plus Pharmacy" reviews="142" average-review="4.2" wished="false" in-cart="1" quantity="67" price="15.80" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug5.jpg" name="Multivitamin Complex Tablets - Daily Nutrition" last="8628.50" store="HealthCare Plus Pharmacy" reviews="489" average-review="4.6" wished="true" in-cart="0" quantity="200" price="28.50" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug6.jpg" name="Antiseptic Solution 100ml - Wound Care" last="995.90" store="HealthCare Plus Pharmacy" reviews="176" average-review="4.4" wished="false" in-cart="0" quantity="120" price="995.90" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug7.jpg" name="Adhesive Bandages Pack - First Aid" last="8766.75" store="HealthCare Plus Pharmacy" reviews="234" average-review="4.8" wished="true" in-cart="0" quantity="85" price="6.75" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug8.jpg" name="Cetirizine 10mg Tablets - Allergy Relief" last="418.40" store="HealthCare Plus Pharmacy" reviews="167" average-review="4.1" wished="false" in-cart="0" quantity="0" price="188.40" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug9.jpg" name="Insulin Injection Pen - Diabetes Management" last="1825.00" store="HealthCare Plus Pharmacy" reviews="89" average-review="4.9" wished="true" in-cart="0" quantity="12" price="7125.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug10.jpg" name="Aspirin 325mg Tablets - Cardiovascular Health" last="191.30" store="HealthCare Plus Pharmacy" reviews="29468" average-review="4.0" wished="false" in-cart="0" quantity="156" price="181.30" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug11.jpg" name="Calcium Carbonate Antacid - Digestive Health" last="7814.60" store="HealthCare Plus Pharmacy" reviews="203" average-review="3.8" wished="true" in-cart="3" quantity="78" price="128974.60" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug12.jpg" name="Lubricating Eye Drops - Vision Care" last="8722.90" store="HealthCare Plus Pharmacy" reviews="134" average-review="4.3" wished="false" in-cart="1" quantity="54" price="22.90" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug13.jpg" name="Digital Thermometer - Health Monitoring" last="1435.75" store="HealthCare Plus Pharmacy" reviews="112" average-review="4.5" wished="true" in-cart="0" quantity="28" price="6435.75" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug14.jpg" name="Probiotic Capsules 30ct - Gut Health" last="1742.20" store="HealthCare Plus Pharmacy" reviews="91" average-review="3.9" wished="false" in-cart="0" quantity="63" price="42.20" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug15.jpg" name="Hand Sanitizer 250ml - Hygiene Protection" last="187.45" store="HealthCare Plus Pharmacy" reviews="456" average-review="4.2" wished="true" in-cart="0" quantity="0" price="7.45" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug16.jpg" name="Omega-3 Fish Oil Capsules - Heart Health" last="3431.80" store="HealthCare Plus Pharmacy" reviews="178" average-review="4.4" wished="false" in-cart="0" quantity="94" price="31.80" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug17.jpg" name="Loratadine 10mg Tablets - Allergy Relief" last="120.50" store="Wellness Pharmacy" reviews="452" average-review="4.3" wished="false" in-cart="0" quantity="120" price="100.50" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug18.jpg" name="Metformin 500mg Tablets - Diabetes Control" last="850.00" store="CityCare Pharmacy" reviews="3120" average-review="4.5" wished="true" in-cart="0" quantity="76" price="820.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug19.jpg" name="Salbutamol 100mcg Inhaler - Asthma Relief" last="1750.00" store="GreenCross Pharmacy" reviews="890" average-review="4.6" wished="false" in-cart="1" quantity="34" price="1699.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug20.jpg" name="Hydrocortisone 1% Cream - Skin Relief" last="240.00" store="HealthMart Pharmacy" reviews="210" average-review="4.1" wished="false" in-cart="0" quantity="40" price="199.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug21.jpg" name="Nitrofurantoin 100mg Capsules - UTI Antibiotic" last="560.00" store="Community Pharmacy" reviews="134" average-review="4.2" wished="true" in-cart="0" quantity="22" price="540.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug22.jpg" name="ORS Sachets - Oral Rehydration" last="45.00" store="MedSupply Kenya" reviews="980" average-review="4.7" wished="false" in-cart="5" quantity="300" price="35.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug23.jpg" name="Clotrimazole 1% Cream - Antifungal" last="310.00" store="Wellness Pharmacy" reviews="67" average-review="4.0" wished="false" in-cart="0" quantity="56" price="289.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug24.jpg" name="Vitamin D3 1000 IU Softgels - Bone Health" last="950.00" store="Sunrise Pharmacy" reviews="412" average-review="4.5" wished="true" in-cart="0" quantity="140" price="899.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug25.jpg" name="Omeprazole 20mg Capsules - Acid Reducer" last="620.00" store="CityCare Pharmacy" reviews="254" average-review="4.2" wished="false" in-cart="0" quantity="88" price="599.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug26.jpg" name="Antiseptic Wipes Pack - Hygiene" last="120.00" store="GreenCross Pharmacy" reviews="143" average-review="4.4" wished="false" in-cart="2" quantity="240" price="99.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug27.jpg" name="Famotidine 20mg Tablets - Acid Reflux Relief" last="160.00" store="PharmaPlus Kenya" reviews="321" average-review="4.1" wished="false" in-cart="0" quantity="60" price="149.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug28.jpg" name="Blood Glucose Test Strips (50) - Diabetes Monitoring" last="1350.00" store="MediTrack Supplies" reviews="789" average-review="4.6" wished="true" in-cart="0" quantity="46" price="1299.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug29.jpg" name="Cefuroxime 250mg Tablets - Antibiotic" last="620.00" store="RiverSide Pharmacy" reviews="412" average-review="4.2" wished="false" in-cart="0" quantity="74" price="599.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug30.jpg" name="Prednisone 10mg Tablets - Anti-inflammatory" last="430.50" store="NorthGate Pharmacy" reviews="98" average-review="4.0" wished="true" in-cart="0" quantity="32" price="399.50" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug31.jpg" name="Loperamide 2mg Capsules - Anti-diarrheal" last="85.00" store="EastSide Pharmacy" reviews="256" average-review="4.3" wished="false" in-cart="1" quantity="180" price="79.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug32.jpg" name="Spironolactone 25mg Tablets - Diuretic" last="540.00" store="Central Pharmacy" reviews="64" average-review="3.9" wished="false" in-cart="0" quantity="48" price="519.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug33.jpg" name="Doxycycline 100mg Capsules - Antibiotic" last="720.00" store="UrbanMeds" reviews="512" average-review="4.4" wished="true" in-cart="0" quantity="90" price="699.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug34.jpg" name="Metronidazole 400mg Tablets - Antiprotozoal" last="310.00" store="Neighborhood Pharmacy" reviews="134" average-review="4.1" wished="false" in-cart="0" quantity="120" price="299.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug35.jpg" name="Saline Nasal Spray 30ml - Nasal Care" last="95.00" store="PrimeCare Pharmacy" reviews="76" average-review="4.0" wished="false" in-cart="0" quantity="210" price="89.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug36.jpg" name="Benzonatate 100mg Capsules - Cough Suppressant" last="420.00" store="Allied Pharmacy" reviews="48" average-review="3.8" wished="false" in-cart="0" quantity="28" price="399.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug37.jpg" name="Acyclovir 400mg Tablets - Antiviral" last="980.00" store="TrustMeds" reviews="214" average-review="4.5" wished="true" in-cart="0" quantity="66" price="949.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug38.jpg" name="Diclofenac 50mg Tablets - Pain & Inflammation" last="260.00" store="RapidMeds" reviews="612" average-review="4.2" wished="false" in-cart="1" quantity="132" price="239.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug39.jpg" name="Phenylephrine Nasal Drops - Decongestant" last="150.00" store="CarePoint Pharmacy" reviews="88" average-review="3.9" wished="false" in-cart="0" quantity="96" price="139.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug40.jpg" name="Ranitidine 150mg Tablets - Heartburn Relief" last="200.00" store="HealthCare Plus Pharmacy" reviews="178" average-review="4.0" wished="false" in-cart="0" quantity="84" price="189.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug41.jpg" name="Sodium Chloride IV Set - Medical Supply" last="1250.00" store="Wellness Pharmacy" reviews="34" average-review="4.3" wished="false" in-cart="0" quantity="18" price="1199.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug42.jpg" name="Calamine Lotion 100ml - Skin Soothe" last="110.00" store="CityCare Pharmacy" reviews="54" average-review="4.1" wished="false" in-cart="0" quantity="140" price="99.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug43.jpg" name="Erythromycin 250mg Tablets - Antibiotic" last="680.00" store="GreenCross Pharmacy" reviews="223" average-review="4.0" wished="true" in-cart="0" quantity="38" price="659.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug44.png" name="Saline Wound Wash 200ml - Wound Care" last="220.00" store="HealthMart Pharmacy" reviews="190" average-review="4.2" wished="false" in-cart="0" quantity="102" price="199.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug45.jpg" name="Mebendazole 100mg Tablets - Antiparasitic" last="75.00" store="Community Pharmacy" reviews="412" average-review="4.6" wished="false" in-cart="3" quantity="260" price="69.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug46.jpg" name="Lidocaine 5% Ointment - Local Anesthetic" last="520.00" store="MedSupply Kenya" reviews="58" average-review="4.1" wished="false" in-cart="0" quantity="44" price="499.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug47.jpg" name="Cetomacrogol Cream 500g - Moisturizer" last="330.00" store="Sunrise Pharmacy" reviews="76" average-review="4.0" wished="true" in-cart="0" quantity="72" price="299.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug48.jpg" name="Pramoxine Hydrocortisone Cream - Itch Relief" last="290.00" store="PharmaPlus Kenya" reviews="121" average-review="4.2" wished="false" in-cart="0" quantity="49" price="269.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug49.jpg" name="Dextrose 5% IV Fluid - Rehydration" last="980.00" store="MediTrack Supplies" reviews="22" average-review="4.1" wished="false" in-cart="0" quantity="30" price="949.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug50.jpg" name="Nitroglycerin 0.4mg Spray - Angina" last="2200.00" store="RiverSide Pharmacy" reviews="89" average-review="4.4" wished="true" in-cart="0" quantity="26" price="2149.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug51.jpg" name="Clarithromycin 250mg Tablets - Antibiotic" last="740.00" store="NorthGate Pharmacy" reviews="167" average-review="4.3" wished="false" in-cart="0" quantity="58" price="699.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug52.jpg" name="Azelastine Nasal Spray - Allergy Relief" last="1350.00" store="EastSide Pharmacy" reviews="44" average-review="3.9" wished="false" in-cart="0" quantity="40" price="1299.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug53.jpg" name="Glyceryl Trinitrate Patch - Cardiac Care" last="2890.00" store="Central Pharmacy" reviews="31" average-review="4.2" wished="false" in-cart="0" quantity="12" price="2799.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug54.jpg" name="Mupirocin Ointment 2% - Topical Antibiotic" last="420.00" store="UrbanMeds" reviews="98" average-review="4.5" wished="true" in-cart="0" quantity="36" price="399.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug55.jpg" name="Oxytocin Injection 10IU - Labor Aid" last="1600.00" store="Neighborhood Pharmacy" reviews="12" average-review="4.0" wished="false" in-cart="0" quantity="8" price="1499.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug56.jpg" name="Ferrous Sulfate 200mg Tablets - Iron Supplement" last="240.00" store="PrimeCare Pharmacy" reviews="302" average-review="4.3" wished="false" in-cart="2" quantity="184" price="229.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug57.jpg" name="Mometasone Nasal Spray - Rhinitis" last="1490.00" store="Allied Pharmacy" reviews="67" average-review="4.1" wished="false" in-cart="0" quantity="64" price="1399.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug58.jpg" name="Hydroxychloroquine 200mg Tablets - Antimalarial" last="820.00" store="TrustMeds" reviews="58" average-review="3.8" wished="false" in-cart="0" quantity="40" price="799.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug59.jpg" name="Brimonidine Eye Drops - Glaucoma Aid" last="1750.00" store="RapidMeds" reviews="43" average-review="4.0" wished="true" in-cart="0" quantity="22" price="1699.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug60.jpg" name="Polymyxin B Sulfate Ointment - Ophthalmic" last="940.00" store="CarePoint Pharmacy" reviews="27" average-review="4.2" wished="false" in-cart="0" quantity="18" price="899.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug61.jpg" name="Topiramate 25mg Tablets - Seizure Control" last="1320.00" store="HealthCare Plus Pharmacy" reviews="72" average-review="4.1" wished="false" in-cart="0" quantity="34" price="1299.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug62.jpg" name="Levofloxacin 500mg Tablets - Antibiotic" last="1120.00" store="Wellness Pharmacy" reviews="214" average-review="4.4" wished="true" in-cart="0" quantity="44" price="1099.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug63.jpg" name="Bromhexine 8mg Tablets - Mucolytic" last="98.00" store="CityCare Pharmacy" reviews="165" average-review="4.0" wished="false" in-cart="0" quantity="150" price="89.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug64.jpg" name="Guaifenesin 200mg Syrup - Expectorant" last="210.00" store="GreenCross Pharmacy" reviews="142" average-review="4.1" wished="false" in-cart="0" quantity="96" price="199.00" store-country="Kenya"></div>
      <div is="product-wrapper" product-image="/src/img/products/drug65.jpg" name="Risperidone 2mg Tablets - Antipsychotic" last="1890.00" store="HealthMart Pharmacy" reviews="53" average-review="3.9" wished="false" in-cart="0" quantity="26" price="1799.00" store-country="Kenya"></div>
    `;
  }

  getPagination = data => {
    const { current, total } = data;

    // if total is 1, return empty string
    if (total < 2) return "";

    const prev = this.createPrevNavigation(current);
    const currentPage = /*html*/`<button class="page current ${current > 99 ? "large" : ""}">${current}</button>`;
    const next = this.createNextNavigation(current, total);

    return /* html */`
      <div class="pagination">
        ${prev}
        ${currentPage}
        ${next}
      </div>
    `;
  }

  createPrevNavigation = current => {
    // if both current and total are not numbers, return empty string
    if (isNaN(current)) return "";

    /* if current page is 1, return empty string */
    if (current === 1) return "";

    /* if current page is less than 6, return 1 to 4 */
    if (current < 6) {
      let prev = "";
      for (let i = 1; i < current; i++) {
        prev += /* html */`<button class="page prev ${i > 99 ? "large" : ""}">${i}</button>`;
      }
      return /* html */`
        <div class="previous">
          ${prev}
        </div>
      `;
    }

    // anything greater than 6, return the last 3 pages and start page: 1
    if (current >= 6) {
      // loop to create the previous pages
      let prev = /* html */`<button class="page prev start">1</button>`;
      for (let i = current - 3; i < current; i++) {
        prev += /* html */`<button class="page prev ${i > 99 ? "large" : ""}">${i}</button>`;
      }

      return /* html */`
        <div class="previous">
          ${prev}
        </div>
      `;
    }
  }

  createNextNavigation = (current, total) => {
    // if both current and total are not numbers, return empty string
    if (isNaN(current) || isNaN(total)) return "";

    /* if current page is the last page, return empty string */
    if (current === total) return "";

    /* if current page is less than 6, and total is less than 6, return all pages */
    if (current < 6 && total < 6) {
      let next = "";
      for (let i = current + 1; i <= total; i++) {
        next += /* html */`<button class="page next ${i > 99 ? "large" : ""}">${i}</button>`;
      }

      // return the next pages
      return /* html */`
        <div class="nexts">
          ${next}
        </div>
      `;
    }

    /* if current page is less than 6, return after current: three after */
    if (current < 6 && (total - current) > 3) {
      let next = "";
      for (let i = current + 1; i <= current + 3; i++) {
        next += /* html */`<button class="page next ${i > 99 ? "large" : ""}">${i}</button>`;
      }

      // add last page
      next += /* html */`<button class="page next end ${total > 99 ? "large" : ""}">${total}</button>`;

      // return the next pages
      return /* html */`
        <div class="nexts">
          ${next}
        </div>
      `;
    }

    // if page is 6 or greater, and is less than the total by 3,2,1: return the last 3 pages
    if (current >= 6 && (total - current) <= 3) {
      let next = "";
      for (let i = current + 1; i <= total; i++) {
        next += /* html */`<button class="page next">${i}</button>`;
      }

      // return the next pages
      return /* html */`
        <div class="nexts">
          ${next}
        </div>
      `;
    }

    // if current page is 6 or greater, and is less the total by a value more than 3, return the next 3 pages and the last page
    if (current >= 6 && (total - current) > 3) {
      let next = "";
      for (let i = current + 1; i < current + 4; i++) {
        next += /* html */`<button class="page next ${i > 99 ? "large" : ""}">${i}</button>`;
      }

      // add the last page
      next += /* html */`<button class="page next end ${total > 99 ? "large" : ""}">${total}</button>`;

      // return the next pages
      return /* html */`
        <div class="nexts">
          ${next}
        </div>
      `;
    }
  }

  getLargeLoader = () => {
    return /*html*/`
      <div id="loader-wrapper" class="loader-wrapper">
        <div id="large-loader" class="loader large"></div>
      </div>
    `;
  }

  getStyles() {
    return /* css */`
	    <style>
	      *,
	      *:after,
	      *:before {
	        box-sizing: border-box !important;
	        font-family: inherit;
	        -webkit-box-sizing: border-box !important;
	      }

	      *:focus {
	        outline: inherit !important;
	      }

	      *::-webkit-scrollbar {
	        width: 3px;
	      }

	      *::-webkit-scrollbar-track {
	        background: var(--scroll-bar-background);
	      }

	      *::-webkit-scrollbar-thumb {
	        width: 3px;
	        background: var(--scroll-bar-linear);
	        border-radius: 50px;
	      }

	      h1,
	      h2,
	      h3,
	      h4,
	      h5,
	      h6 {
	        font-family: inherit;
	      }

	      a {
	        text-decoration: none;
	      }

	      :host {
          font-size: 16px;
          padding: 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 100%;
        }

        #loader-wrapper.loader-wrapper {
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          gap: 0;
          width: 100%;
          min-height: 250px;
        }

        #large-loader.loader {
          margin: 0;
          align-self: center;
          justify-self: center;
          width: 80px;
          aspect-ratio: 4;
          --c:var(--accent-color) 90%,#0000;
          --c1:var(--accent-alt)  90%,#0000;
          --c2:var(--alt-color)  90%,#0000;
          background:
            radial-gradient(circle closest-side at left  10px top 50%,var(--c)),
            radial-gradient(circle closest-side                     ,var(--c1)),
            radial-gradient(circle closest-side at right 10px top 50%,var(--c2));
          background-size: 100% 100%;
          background-repeat: no-repeat;
          animation: l5 1s infinite alternate;
        }

        @keyframes l5 {
          to { width: 20px; aspect-ratio: 1}
        }

        .content {
          padding: 20px 0 0;
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 100%;
        }

        .head {
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        .head > h3.title {
          display: flex;
          align-items: center;
          font-family: var(--font-text), sans-serif;
          color: var(--title-color);
          font-size: 1.35rem;
          font-weight: 500;
          line-height: 1.5;
          margin: 0;
          padding: 0 0;
        }

        .head > .desc {
          margin: 0;
          padding: 0;
          line-height: 1.3;
          color: var(--text-color);
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
        }

        .head > .desc * {
          margin: 0;
          padding: 0;
          line-height: inherit;
        }

        .head > .desc > p {
          margin: 5px 0 7px;
          padding: 0;
          line-height: 1.3;
          color: var(--text-color);
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
        }

        div.sticky {
          display: flex;
          flex-flow: column;
          gap: 5px;
          margin: 0;
          width: 100%;
          z-index: 2;
          position: sticky;
          top: 0px;
          padding: 10px 0 0 0;
          background: var(--background);
        }

        form.search {
          padding: 10px 0 0 0;
          background: var(--background);
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          width: 100%;
        }

        form.search > svg {
          position: absolute;
          left: -12px;
          top: calc(50% - 15px);
          color: var(--text-color);
          cursor: pointer;
          width: 40px;
          height: 40px;
        }

        form.search > svg:hover {
          color: var(--accent-color);
        }

        form.search > .contents {
          padding: 0;
          display: flex;
          flex-flow: row;
          align-items: center;
          flex-wrap: nowrap;
          gap: 0;
          margin: 0;
          width: 100%;
          position: relative;
        }

        form.search > .contents > input {
          border: var(--input-border);
          background-color: var(--background) !important;
          display: flex;
          flex-flow: row;
          align-items: center;
          font-family: var(--font-text),sans-serif;
          color: var(--text-color);
          font-size: 1rem;
          padding: 8px 10px 8px 35px;
          gap: 0;
          width: 100%;
          border-radius: 12px;
        }

        form.search > .contents > input:-webkit-autofill,
        form.search > .contents > input:-webkit-autofill:hover,
        form.search > .contents > input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px var(--background) inset;
          -webkit-text-fill-color: var(--text-color) !important;
          transition: background-color 5000s ease-in-out 0s;
          color: var(--text-color) !important;
        }

        form.search > .contents > input:-webkit-autofill {
          filter: none;
          color: var(--text-color) !important;
        }

        form.search > .contents > svg {
          position: absolute;
          height: 18px;
          color: var(--gray-color);
          width: 18px;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
        }

        form.search > .contents > button {
          position: absolute;
          right: 10px;
          top: calc(50% - 13px);
          border: none;
          cursor: pointer;
          color: var(--white-color);
          font-family: var(--font-text), sans-serif;
          background: var(--accent-linear);
          height: 26px;
          width: max-content;
          padding: 0 10px;
          font-size: 0.9rem;
          font-weight: 400;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          border-radius: 10px;
        }

        ul.tabs {
          border-bottom: var(--border);
          display: flex;
          flex-flow: row;
          gap: 15px;
          padding: 10px 0 10px;
          margin: 0;
          width: 100%;
          list-style: none;
          overflow-x: auto;
          overflow-y: hidden;
          white-space: nowrap;
          scrollbar-width: 0;
          -ms-overflow-style: none;
          z-index: 2;
          background: var(--background);
        }

        ul.tabs::-webkit-scrollbar {
          display: none;
          visibility: hidden;
        }

        ul.tabs > li.tab {
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 5px;
          padding: 5px 0;
          border-radius: 12px;
          /*background: var(--gray-background);*/
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: 0.3s;
        }

        ul.tabs > li.tab > span.count,
        ul.tabs > li.tab > svg {
          display: none;
        }

        ul.tabs > li.tab.active {
          background: var(--tab-background);
          padding: 5px 10px;
          color: var(--text-color);
        }

        ul.tabs > li.tab.active > span.count,
        ul.tabs > li.tab.active > svg,
        ul.tabs > li.tab:not(.active):hover > span.count,
        ul.tabs > li.tab:not(.active):hover > svg {
          display: flex;
        }

        /* style hover tab: but don't touch tab with active class */
        ul.tabs > li.tab:not(.active):hover {
          background: var(--tab-background);
          padding: 5px 10px;
          color: var(--text-color);
        }

        ul.tabs > li.tab > svg {
          width: 19px;
          height: 19px;
        }

        ul.tabs > li.tab > .text {
          font-size: 1rem;
          padding: 0 5px 0 0;
          font-weight: 500;
        }

        ul.tabs > li.tab > .count {
          font-size: 0.85rem;
          display: none;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-weight: 500;
          background: var(--accent-linear);
          font-family: var(--font-text), sans-serif;
          color: var(--white-color);
          padding: 1px 7px 2px;
          border-radius: 10px;
        }

        .products {
          padding: 20px 0;
          max-width: 100%;
          display: block;
          columns: 230px auto;
          column-gap: 10px;
          margin: 0;
        }

        .products > * {
          break-inside: avoid;
          margin-bottom: 10px;
          display: block;
          width: 100%;
        }

        .pagination {
          z-index: 0;
          display: flex;
          flex-flow: row;
          gap: 10px;
          justify-content: center;
          padding: 15px 0 20px;
          margin: 0;
          width: 100%;
        }

        .pagination > .previous {
          display: flex;
          flex-flow: row;
          gap: 5px;
          align-items: center;
        }

        .pagination > .nexts {
          display: flex;
          flex-flow: row;
          gap: 5px;
          align-items: center;
        }

        .pagination button {
          font-size: 0.9rem;
          outline: none;
          border: none;
          background: none;
          font-family: var(--font-text), sans-serif;
        }

        .pagination > button.current,
        .pagination > .nexts > .page,
        .pagination > .previous > .page {
          padding: 0;
          height: 30px;
          width: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50px;
          color: var(--text-color);
          border: var(--action-border);
          cursor: pointer;
          transition: 0.3s;
        }

        .pagination > .nexts > button.large,
        .pagination > .previous > button.large,
        .pagination > button.large {
          padding: 0;
          height: 30px;
          width: max-content;
          padding: 0 10px;
        }

        .pagination > button.current {
          color: var(--white-color);
          background: var(--accent-linear);
          cursor: default;
        }

        .pagination > .previous > .prev:hover,
        .pagination > .nexts > .next:hover {
          background: var(--tab-background);
          border: none;
        }

        .pagination > .previous > .start {
          margin-right: 10px;
          border: none;
          background: var(--tab-background);
        }

        .pagination > .nexts > .end {
          margin-left: 10px;
          border: none;
          background: var(--tab-background);
        }

        .pagination > .previous > .page.current,
        .pagination > .nexts > .page.current {
          background: var(--accent-linear);
          color: var(--white-color);
        }

				@media screen and (max-width:660px) {
					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

					a ,
          button,
          ul.tabs > li.tab {
						cursor: default !important;
          }

          div.sticky {
            position: sticky;
            top: 0;
          }

          ul.tabs {
            padding: 10px 0;
          }

          .products {
            padding: 20px 0;
            column-gap: 10px;
            row-gap: 10px;
          }

          .pagination {
            padding: 5px 0 25px;
          }
				}
	    </style>
    `;
  }
}