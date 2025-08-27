export default class CheckoutContainer extends HTMLElement {
  constructor() {

    // We are not even going to touch this.
    super();

    // lets create our shadow root
    this.shadowObj = this.attachShadow({ mode: 'open' });

    this.render();

    this.countiesData = {
      "Baringo": ["Baringo Central", "Baringo North", "Baringo South", "Eldama Ravine", "Mogotio", "Tiaty"],
      "Bomet": ["Bomet Central", "Bomet East", "Chepalungu", "Sotik"],
      "Bungoma": ["Bumula", "Bungoma East", "Bungoma North", "Bungoma South", "Bungoma West", "Cheptais", "Kanduyi", "Kimilili", "Mount Elgon", "Sirisia", "Tongaren"],
      "Busia": ["Budalang'i", "Bunyala", "Butula", "Nambale", "Samia"],
      "Elgeyo-Marakwet": ["Keiyo North", "Keiyo South", "Marakwet East", "Marakwet West"],
      "Embu": ["Manyatta", "Mbeere North", "Mbeere South", "Runyenjes"],
      "Garissa": ["Balambala", "Dadaab", "Fafi", "Garissa Township", "Hulugho", "Ijara"],
      "Homa Bay": ["Homa Bay Town", "Kasipul", "Kabondo Kasipul", "Karachuonyo", "Ndhiwa", "Rangwe", "Suba"],
      "Isiolo": ["Isiolo North", "Isiolo South"],
      "Kajiado": ["Kajiado Central", "Kajiado East", "Kajiado North", "Kajiado West"],
      "Kakamega": ["Butere", "Kakamega Central", "Kakamega East", "Kakamega North", "Kakamega South", "Lugari", "Malava", "Matungu", "Mumias East", "Mumias West"],
      "Kericho": ["Ainamoi", "Belgut", "Bureti", "Kipkelion East", "Kipkelion West"],
      "Kiambu": ["Gatundu North", "Gatundu South", "Juja", "Kabete", "Kiambaa", "Kiambu Town", "Kikuyu", "Lari", "Limuru", "Ruiru", "Thika"],
      "Kilifi": ["Ganze", "Kaloleni", "Kilifi North", "Kilifi South", "Magarini", "Malindi", "Rabai"],
      "Kirinyaga": ["Gichugu", "Kirinyaga Central", "Kirinyaga East", "Kirinyaga West", "Mwea"],
      "Kisii": ["Bobasi", "Bomachoge Borabu", "Bonchari", "Kitutu Chache North", "Kitutu Chache South", "Nyamache", "South Mugirango"],
      "Kisumu": ["Kisumu Central", "Kisumu East", "Kisumu West", "Seme", "Nyando", "Muhoroni", "Nyakach"],
      "Kitui": ["Kitui Central", "Kitui East", "Kitui Rural", "Kitui South", "Kitui West", "Mwingi Central", "Mwingi North", "Mwingi West"],
      "Kwale": ["Kinango", "Lunga Lunga", "Matuga"],
      "Laikipia": ["Laikipia East", "Laikipia North", "Laikipia West"],
      "Lamu": ["Lamu East", "Lamu West"],
      "Machakos": ["Athi River", "Kangundo", "Kathiani", "Machakos", "Masinga", "Matungulu", "Mavoko", "Mwala", "Yatta"],
      "Makueni": ["Kaiti", "Kibwezi East", "Kibwezi West", "Kilome", "Makueni", "Mbooni"],
      "Mandera": ["Banisa", "Lafey", "Mandera East", "Mandera North", "Mandera South", "Mandera West"],
      "Marsabit": ["Laisamis", "Marsabit Central", "Moyale", "North Horr", "Saku"],
      "Meru": ["Buuri", "Igembe Central", "Igembe North", "Igembe South", "Imenti Central", "Imenti North", "Imenti South", "Meru Central", "Meru South", "Tharaka"],
      "Migori": ["Kuria East", "Kuria West", "Migori", "Nyatike", "Rongo", "Suna East", "Suna West"],
      "Mombasa": ["Changamwe", "Jomvu", "Kisauni", "Likoni", "Mvita", "Nyali"],
      "Murang'a": ["Gatanga", "Kahuro", "Kandara", "Kangema", "Kigumo", "Kiharu", "Mathioya", "Murang'a South"],
      "Nairobi": ["Dagoretti", "Embakasi", "Kamukunji", "Kasarani", "Lang'ata", "Makadara", "Mathare", "Nairobi West"],
      "Nakuru": ["Gilgil", "Kuresoi North", "Kuresoi South", "Molo", "Naivasha", "Nakuru East", "Nakuru North", "Nakuru West", "Njoro", "Rongai", "Subukia"],
      "Nandi": ["Aldai", "Chesumei", "Emgwen", "Mosop", "Nandi Central", "Tinderet"],
      "Narok": ["Narok East", "Narok North", "Narok South", "Narok West", "Trans Mara East", "Trans Mara West"],
      "Nyamira": ["Borabu", "Manga", "Masaba North", "Masaba South", "Nyamira North", "Nyamira South"],
      "Nyandarua": ["Kipipiri", "Ndaragwa", "Ol Kalou"],
      "Nyeri": ["Kieni East", "Kieni West", "Mathira East", "Mathira West", "Mukurweini", "Nyeri South", "Tetu"],
      "Samburu": ["Samburu Central", "Samburu East", "Samburu North"],
      "Siaya": ["Alego Usonga", "Gem", "Rarieda", "Siaya", "Ugenya", "Ugunja"],
      "Taita-Taveta": ["Mwatate", "Taveta", "Voi"],
      "Tana River": ["Bura", "Garsen"],
      "Tharaka-Nithi": ["Chuka", "Igambang'ombe", "Maara", "Tharaka"],
      "Trans Nzoia": ["Cherang'any", "Endebess", "Kwanza", "Saboti", "Sirisia"],
      "Turkana": ["Loima", "Turkana Central", "Turkana East", "Turkana North", "Turkana South"],
      "Uasin Gishu": ["Ainabkoi", "Kapseret", "Kesses", "Moiben", "Soy", "Turbo"],
      "Vihiga": ["Emuhaya", "Hamisi", "Luanda", "Sabatia", "Vihiga"],
      "Wajir": ["Eldas", "Tarbaj", "Wajir East", "Wajir North", "Wajir South", "Wajir West"],
      "West Pokot": ["Kacheliba", "Pokot Central", "Pokot North", "Pokot South"],
    };
  }

  render() {
    // this.shadowObj.innerHTML = this.getTemplate();
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    this.populateCountiesDropdown()
    this.updateSubCounties()

    // let stepCounter = 1;
    const stepValue = this.shadowObj.querySelector("#content .content-head > .actions > span.steps > .step")

    const contentContainer = this.shadowObj.querySelector("section#content > #container");
    // const prevBtn = this.shadowObj.querySelector("section#content > .footer > .action.prev");
    const nextBtn = this.shadowObj.querySelector("section#content > .footer > .action.next");

    //Creating the data object
    const data = {};

    nextBtn.addEventListener('click', (e) => {
      e.preventDefault()

      switch (parseInt(stepValue.textContent)) {
        case 1:
          this.validateInputs(data, stepValue, contentContainer)
          console.log(data)
          console.log(stepValue.textContent)
          break;
        case 2:
          this.validateStepTwo(data, stepValue, contentContainer, nextBtn)
          console.log(data)
          console.log(stepValue.textContent)
          break;
        case 3:
          this.validateStepThree(data, stepValue, contentContainer)
          console.log(data)
          console.log(stepValue.textContent)
          break;
        case 4:
          this.validateStepFour(data, stepValue, contentContainer, nextBtn)
          console.log(data)
          console.log(stepValue.textContent)
        default:
          break;
      }

    })
  }

  disconnectedCallback() {
    // console.log('We are inside disconnectedCallback');
    this.enableScroll()
  }

  disableScroll() {
    // Get the current page scroll position
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    let scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    document.body.classList.add("stop-scrolling");

    // if any scroll is attempted, set this to the previous value
    window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

  enableScroll() {
    document.body.classList.remove("stop-scrolling");
    window.onscroll = function () { };
  }

  populateCountiesDropdown() {
    const countySelect = this.shadowObj.querySelector("section#content > .container > .fields  .field #county");
    const subCountySelect = this.shadowObj.querySelector("section#content > .container > .fields  .field #subCounty");
    for (let county in this.countiesData) {
      let option = document.createElement("option");
      option.value = county;
      option.text = county;
      countySelect.add(option);
    }

    let selectedCounty = countySelect.value;

    subCountySelect.innerHTML = "";

    this.countiesData[selectedCounty].forEach(subCounty => {
      let option = document.createElement("option");
      option.value = subCounty;
      option.text = subCounty;
      subCountySelect.add(option);
    });
  }

  updateSubCounties() {
    const self = this;
    const countySelect = this.shadowObj.querySelector("section#content > .container > .fields  .field #county");
    countySelect.addEventListener('change', e => {
      e.preventDefault()
      e.stopPropagation()

      const subCountySelect = this.shadowObj.querySelector("section#content > .container > .fields  .field #subCounty");
      let selectedCounty = countySelect.value;

      subCountySelect.innerHTML = "";

      self.countiesData[selectedCounty].forEach(subCounty => {
        let option = document.createElement("option");
        option.value = subCounty;
        option.text = subCounty;
        subCountySelect.add(option);
      });
    })
  }

  validateInputs(data, stepValue, contentContainer) {
    data.UserData = {}
    const hideError = (element) => {
      setTimeout(() => {
        element.style.display = 'none'
      }, 2000);
    }

    const container = this.shadowObj.querySelector("section#content > .container > .fields")

    const inputs = container.querySelectorAll('.field input')
    if (inputs) {
      let next = true;
      inputs.forEach(input => {
        switch (input.dataset.type) {
          case 'name':
            if (input.value.length < 3) {
              next = false;
              const errSpan = input.parentElement.querySelector('.error')
              errSpan.style.display = 'flex'
              hideError(errSpan)
            }
            else {
              data.UserData[`${input.dataset.name}`] = input.value
            }
            break;

          case 'number':
            if (input.value.length < 9 || input.value.length > 10) {
              next = false;
              const errSpan = input.parentElement.parentElement.querySelector('.error')
              errSpan.style.display = 'flex'
              hideError(errSpan)
            }
            else if (input.value.length === 10 || input.value[0] === "0") {
              next = false;
              const errSpan = input.parentElement.parentElement.querySelector('.error')
              errSpan.textContent = "Don't start with 0, start with 7 or 1";
              errSpan.style.display = 'flex'
              hideError(errSpan)
            }
            else {
              data.UserData[`${input.dataset.name}`] = input.value
            }
          default:
            break;
        }
      });

      const countySelect = this.shadowObj.querySelector("section#content > .container > .fields  .field #county");
      const subCountySelect = this.shadowObj.querySelector("section#content > .container > .fields  .field #subCounty");

      if (countySelect.value.length < 1) {
        next = false;
        const errSpan = countySelect.parentElement.querySelector('.error')
        errSpan.style.display = 'flex'
        hideError(errSpan)
      }
      else {
        data.UserData[`${countySelect.dataset.name}`] = countySelect.value
      }

      if (subCountySelect.value.length < 1) {
        next = false;
        const errSpan = subCountySelect.parentElement.querySelector('.error')
        errSpan.style.display = 'flex'
        hideError(errSpan)
      }
      else {
        data.UserData[`${subCountySelect.dataset.name}`] = subCountySelect.value
      }

      if (next) {
        stepValue.textContent = 2;
        contentContainer.innerHTML = this.getStepTwo()
        this.activateStepTwo()
      }
    }
  }

  activateStepTwo() {
    const options = this.shadowObj.querySelectorAll("section#content > .container > .services > .options > .option")
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault()
        option.classList.toggle('selected')
      })
    });
  }

  validateStepFour(data, stepValue, contentContainer, nextBtn) {
    const packageItem = this.shadowObj.querySelector('section#content .packages > .package.selected')

    const no = this.shadowObj.querySelector('section#content .select-manually > .picker span.no');

    if (packageItem) {
      data.Package = packageItem.dataset.value

      stepValue.textContent = 5;
      contentContainer.innerHTML = this.getStepFive()
    }
    else if (parseInt(no.textContent) > 0) {
      data.Photos = no.textContent

      stepValue.textContent = 5;
      contentContainer.innerHTML = this.getStepFive()
      const text = nextBtn.querySelector('.text')
      text.textContent = 'Deposit'
    }
  }

  getTemplate() {
    // Show HTML Here
    return /* html */`
      <section id="content" class="content">
        <div class="content-head">
          <div class="actions">
            <span class="steps">
              <span class="text">Step</span>
              <span class="step">1</span>
              <span class="slash">/</span>
              <span class="all">5</span>
            </span>
          </div>
        </div>
        <div id="container" class="container">
          ${this.getStepOne()}
        </div>
        <div class="footer">
          <div class="action prev">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M15.4992 19.7504C15.3692 19.7504 15.2382 19.7174 15.1182 19.6464C14.3642 19.1994 7.75024 15.1914 7.75024 12.0004C7.75024 8.81043 14.3632 4.80143 15.1182 4.35443C15.4732 4.14343 15.9352 4.26143 16.1452 4.61843C16.3562 4.97543 16.2382 5.43543 15.8822 5.64643C13.3182 7.16543 9.25024 10.2334 9.25024 12.0004C9.25024 13.7704 13.3182 16.8374 15.8822 18.3544C16.2382 18.5654 16.3562 19.0254 16.1452 19.3824C16.0052 19.6184 15.7562 19.7504 15.4992 19.7504Z" fill="black"/>
            </svg>
            <span class="text">Cancel</span>
          </div>
          <div class="action next">
            <span class="text">Next</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8.50076 19.7504C8.63076 19.7504 8.76176 19.7174 8.88176 19.6464C9.63576 19.1994 16.2498 15.1914 16.2498 12.0004C16.2498 8.81043 9.63676 4.80143 8.88176 4.35443C8.52676 4.14343 8.06476 4.26143 7.85476 4.61843C7.64375 4.97543 7.76176 5.43543 8.11776 5.64643C10.6818 7.16543 14.7498 10.2334 14.7498 12.0004C14.7498 13.7704 10.6818 16.8374 8.11776 18.3544C7.76176 18.5654 7.64375 19.0254 7.85476 19.3824C7.99476 19.6184 8.24376 19.7504 8.50076 19.7504Z" fill="black"/>
            </svg>
          </div>
        </div>
      </section>
    ${this.getStyles()}`;
  }

  getStepOne() {
    return /* html */`
      <div class="head">
        <h2 class="step-title">Your Information</h2>
        <p class="description">
          Please fill in the informatiom about your delivery address.
        </p>
      </div>
      <form class="fields">
        <div class="field name">
          <div class="input-group">
            <label for="firstname">First Name</label>
            <input data-name="first_name" data-type="name" type="text" name="firstname" id="firstname" placeholder="Your first name" required>
            <span class="error">Name is required</span>
          </div>
          <div class="input-group">
            <label for="lastname">Last Name</label>
            <input data-name="last_name"  data-type="name" type="text" name="lastname" id="lastname" placeholder="Your last name" required>
            <span class="error">Name is required</span>
          </div>
        </div>
        <div class="field contact">
          <div class="input-group">
            <label for="phone">Phone Number</label>
            <span class="wrapper">
              <span class="country">+254</span>
              <input data-name="phone"  data-type="number" type="text" name="number" id="number" placeholder="Phone number" required>
            </span>
            <span class="error">Phone is required</span>
          </div>
          <div class="input-group">
            <label for="email">Email</label>
            <input data-name="email" data-type="name" type="email" name="email" id="email" placeholder="Your email" required>
            <span class="error">Email is required</span>
          </div>
        </div>
        <div class="field location">
          <div class="input-group">
            <label for="county">County</label>
            <select data-name="county" id="county">
                <!-- Counties dropdown will be populated dynamically -->
            </select>
            <span class="error">County is required</span>
          </div>
          <div class="input-group">
            <label for="subCounty">Sub-County</label>
            <select data-name="sub_county" id="subCounty"></select>
            <span class="error">Sub-County is required</span>
          </div>
        </div>
        <div class="field address">
          <div class="input-group">
            <label for="postal">Address/Postal</label>
            <input data-name="address" data-type="name" type="text" name="postal" id="postal" placeholder="Address/Postal Code/Town/Apartment" required>
            <span class="error">Address/Postal is required</span>
          </div>
        </div>
      </form>
    `
  }

  getStepTwo() {
    return /* html */`
      <div class="head">
        <h2 class="step-title">Make your selections</h2>
        <p class="description">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>
      <div class="services">
        <div class="options">
          <span class="option" data-value="event">
            <span class="text">Event</span>
          </span>
          <span class="option" data-value="hicking">
            <span class="text">Hicking</span>
          </span>
          <span class="option" data-value="outdoor">
            <span class="text">Outdoor</span>
          </span>
          <span class="option" data-value="party">
            <span class="text">Party</span>
          </span>
          <span class="option" data-value="advertising">
            <span class="text">Advertising</span>
          </span>
          <span class="option" data-value="wedding">
            <span class="text">Wedding</span>
          </span>
          <span class="option" data-value="videography">
            <span class="text">Videography</span>
          </span>
          <span class="option" data-value="editing">
            <span class="text">Editing</span>
          </span>
          <span class="option" data-value="product">
            <span class="text">Product</span>
          </span>
          <span class="option" data-value="cultural">
            <span class="text">Cultural</span>
          </span>
          <span class="option" data-value="professional">
            <span class="text">Professional</span>
          </span>
          <span class="option" data-value="graduation">
            <span class="text">Graduation</span>
          </span>
          <span class="option" data-value="wildlife">
            <span class="text">Wildlife</span>
          </span>
          <span class="option" data-value="traditional">
            <span class="text">Traditional</span>
          </span>
        </div>
        <div class="other">
          <span class="text">Others, Please specify</span>
          <input type="text" name="other" id="other" placeholder="Enter others">
        </div>
      </div>
    `
  }

  getStepThree() {
    return /* html */`
      <div class="head">
        <h2 class="step-title">Chose the day</h2>
        <p class="description">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>
      <div class="schedules">
        <div class="schedules-header">
          <div class="title-wrapper">
            <div id="selected-date"class="selected-date">January 2023</div>
            <div class="navs">
              <div id="left-day-nav" class="nav">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
              </div>
              <div id="right-day-nav" class="nav">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </div>
            </div>
          </div>
          <div class="days">
            <div data-date="" data-month="" data-year="" class="day" id="day-item">
              <span class="name">Sun</span>
              <span class="date">15</span>
              <span class="dot"></span>
            </div>
            <div data-date="" data-month="" data-year="" class="day" id="day-item">
              <span class="name">Mon</span>
              <span class="date">16</span>
              <span class="dot"></span>
            </div>
            <div data-date="" data-month="" data-year="" class="day" id="day-item">
              <span class="name">Tue</span>
              <span class="date">17</span>
              <span class="dot"></span>
            </div>
            <div data-date="" data-month="" data-year="" class="day" id="day-item">
              <span class="name">Wed</span>
              <span class="date">18</span>
              <span class="dot"></span>
            </div>
            <div data-date="" data-month="" data-year="" class="day" id="day-item">
              <span class="name">Thu</span>
              <span class="date">19</span>
              <span class="dot"></span>
            </div>
            <div data-date="" data-month="" data-year="" class="day" id="day-item">
              <span class="name">Fri</span>
              <span class="date">20</span>
              <span class="dot"></span>
            </div>
            <div data-date="" data-month="" data-year="" class="day" id="day-item">
              <span class="name">Sat</span>
              <span class="date">21</span>
              <span class="dot"></span>
            </div>
          </div>
        </div>
      </div>
      <div id="calendar-action" class="calendar-action">
        <!-- ${this.calendarWaiting()} -->
      </div>
    `
  }

  calendarWaiting() {
    return /* html */ `
      <span class="look">
        <span class="text">Checking the availability...</span>
      </span>
    `
  }

  calendarEmpty() {
    return /* html */`
      <span class="empty">
        No photographers Available! Please choose another day to check.
      </span>
    `
  }

  calendarResults() {
    return /* html */`
        <div class="results">
          <span class="inform">*Select photographer(s) to continue</span>
          <div class="photographer" data-value="Photographer X">
            <div class="info">
              <div class="image">
                <img src="/img/explore/by/femar.jpg" alt="Photo" />
              </div>
              <div class="name">
                <p> Photographer X </p>
                <span>Available</span>
              </div>
            </div>
            <span class="select">Select</span>
          </div>
          <div class="photographer" data-value="Photographer Y">
            <div class="info">
              <div class="image">
                <img src="/img/explore/by/femar.jpg" alt="Photo" />
              </div>
              <div class="name">
                <p> Photographer Y </p>
                <span>Available</span>
              </div>
            </div>
            <span class="select">Select</span>
          </div>
        </div>
    `
  }

  getStepFour() {
    return /* html */`
      <div class="head">
        <h2 class="step-title">Select a package</h2>
        <p class="description">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </div>
      <div class="packages">
        <div class="package" data-value="Package I">
          <div class="name">
            <p class="name">Package I</p>
            <span>Lorem ipsum dolor.</span>
          </div> 
          <div class="items">
            <span class="item">63+ Photos</span>
            <span class="item">Albums</span>
            <span class="item">HD</span>
            <span class="item">Frames</span>
          </div>
          <div class="price"><span>Ksh.</span> 60,232.00</div>
          <span class="select">Select</span>
        </div>
        <div class="package" data-value="Package II">
          <div class="name">
            <p class="name">Package II</p>
            <span>Lorem ipsum dolor.</span>
          </div> 
          <div class="items">
            <span class="item">63+ Photos</span>
            <span class="item">Albums</span>
            <span class="item">HD</span>
            <span class="item">Frames</span>
          </div>
          <div class="price"><span>Ksh.</span> 40,232.00</div>
          <span class="select">Selected</span>
        </div>
        <div class="package"  data-value="Package III">
          <div class="name">
            <p class="name">Package III</p>
            <span>Lorem ipsum dolor.</span>
          </div> 
          <div class="items">
            <span class="item">63+ Photos</span>
            <span class="item">Albums</span>
            <span class="item">HD</span>
            <span class="item">Frames</span>
          </div>
          <div class="price"><span>Ksh.</span> 20,232.00</div>
          <span class="select">Select</span>
        </div>
      </div>
      <p class="manual-title">Or choose no of Photos<span>(@Ksh. 400 each)</span></p>
      <div class="select-manually">
        <div class="picker">
          <div id="left-nav" class="nav">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
          </div>
          <span class="no">0</span>
          <div id="right-nav" class="nav">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </div>
        </div>
        <!-- <div class="price"><span>Ksh.</span> <span class="ammount">400.00</span></div> -->
      </div>
    `
  }

  activatePackages() {
    const packages = this.shadowObj.querySelectorAll('section#content .packages > .package')
    const selectBtns = this.shadowObj.querySelectorAll('section#content .packages > .package .select')

    const no = this.shadowObj.querySelector('section#content .select-manually > .picker span.no'),
      leftNav = this.shadowObj.querySelector('section#content .select-manually > .picker #left-nav'),
      rightNav = this.shadowObj.querySelector('section#content .select-manually > .picker #right-nav');

    if (selectBtns) {
      selectBtns.forEach(selectBtn => {
        selectBtn.addEventListener('click', (e) => {
          e.preventDefault()
          packages.forEach(packageItem => {
            packageItem.classList.remove('selected')
          });
          selectBtn.parentElement.classList.toggle('selected')
          no.textContent = 0
        })
      });

      rightNav.addEventListener('click', (e) => {
        e.preventDefault()
        no.textContent = parseInt(no.textContent) + 1
        packages.forEach(packageItem => {
          packageItem.classList.remove('selected')
        });
      })

      leftNav.addEventListener('click', (e) => {
        if (parseInt(no.textContent) === 0) {
          no.textContent = 0
        }
        else {
          no.textContent = parseInt(no.textContent) - 1
        }
        packages.forEach(packageItem => {
          packageItem.classList.remove('selected')
        });
      })

    }
  }

  getStepFive() {
    return /* html */`
      <div class="head">
        <h2 class="step-title">Make your deposit</h2>
        <p class="description">
          Based on your selection you need to make a deposit of Ksh. 5,300.
        </p>
      </div>
      <div class="pay">
        <div class="field phone">
          <p class="confirm">Confirm Your Number </p>
          <span class="wrapper">
            <span class="country">+254</span>
            <input type="text" value="0713253018" name="number" id="number" placeholder="Phone number" required readonly>
          </span>
        </div>
      </div>
    `
  }

  getStyles() {
    return /* css */`
      <style>
        * {
          box-sizing: border-box !important;
        }

        :host{
          border: none;
          padding: 0;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
        }

        section#content {
          padding: 15px 0;
          display: flex;
          flex-flow: column;
          justify-content: start;
          align-items: center;
          gap: 0;
          width: 100%;
        }

        #content .content-head {
          margin: 0;
          width: 100%;
          padding: 5px 0 10px 0;
          display: flex;
          flex-flow: column;
          gap: 0px;
          justify-content: center;
        }

        #content .content-head > .actions {
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: center;
        }

        #content .content-head > .actions > span.steps {
          color: var(--gray-color);
          padding: 4px 15px 5px 12px;
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: center;
          gap: 3px;
          cursor: pointer;
          border-top-right-radius: 15px;
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
        }

        #content .content-head > .actions > span.steps > .text{
          padding: 0 5px 0 0;
        }

        #content .content-head > .actions > span.steps > .step {
          color: var(--rating-color);
        }

        section#content > .footer {
          border-top: var(--border);
          margin: 0;
          width: 100%;
          padding: 20px 0 10px 0;
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          align-items: center;
          justify-self: end;
        }

        section#content > .footer > .action {
          display: flex;
          flex-flow: row;
          justify-content: center;
          align-items: center;
          gap: 5px;
          border-radius: 15px;
          font-family: var(--font-alt);
          line-height: 1.2;
          font-size: 1.1rem;
          font-weight: 500;
          width: 130px;
          color: var(--text-color);
          cursor: pointer;
        }

        section#content > .footer > .action.prev {
          padding: 8px 20px 8px 15px;
          background: var(--background);
          border: var(--border);
        }

        section#content > .footer > .action.prev svg path {
          fill: var(--text-color);
        }

        section#content > .footer > .action.next {
          padding: 8px 18px 8px 23px;
          color: var(--anchor-color);
          background: var(--background);
          border: var(--action-border);
        }

        section#content > .footer > .action.next svg path {
          fill: var(--anchor-color);
        }

        section#content > .footer > .action.disabled {
          background: var(--gray-background);
          pointer-events: none;
          user-select: none;
          opacity: .7;
        }

        section#content > .container {
          width: 100%;
          padding: 0;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
        }

        section#content > .container > .head {
          width: 100%;
          margin: 0 0 30px 0;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          gap: 0px;
        }
        
        section#content > .container > .head > h2.step-title {
          margin: 0;
          font-family: var(--font-alt);
          line-height: 1.2;
          font-size: 2rem;
          font-weight: 500;
          color: var(--text-color);
        }
        
        section#content > .container > .head > p.description {
          margin: 0;
          font-family: var(--font-main), sans-serif;
          font-size: 0.93rem;
          font-weight: 400;
          line-height: 1.5;
          color: var(--gray-color);
          text-align: center;
        }

        section#content > .container > .fields {
          margin: 0 0 20px 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          gap: 20px;
        }

        section#content > .container > .fields > .field {
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          gap: 2px;
        }

        section#content > .container > .fields  .field.location,
        section#content > .container > .fields  .field.contact,
        section#content > .container > .fields  .field.name {
          width: 100%;
          display: flex;
          flex-flow: row;
          justify-content: center;
          align-items: start;
          gap: 20px;
        }

        section#content > .container > .fields  .field .input-group {
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          color: var(--text-color);
          gap: 0;
        }

        section#content > .container > .fields  label {
          padding: 0 0 5px 5px;
          color: var(--text-color);
        }

        section#content > .container > .fields  .field  span.error {
          color: var(--warn-color);
          font-size: 0.8rem;
          display: none;
        }

        section#content > .container > .fields  .field  span.wrapper {
          display: flex;
          align-items: center;
          gap: 0;
          width: 100%;
        }
        section#content > .container > .fields  .field  span.wrapper > span {
          border: var(--input-border);
          border-right: none;
          font-size: 1rem;
          width: 60px;
          height: 40px;
          padding: 10px 12px;
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
          color: var(--accent-color);
          display: flex;
          align-items: center;
        }

        section#content > .container > .fields  .field  span.wrapper > input {
          border: var(--input-border);
          font-size: 1rem;
          width: calc(100% - 60px);
          outline: none;
          height: 40px;
          padding: 10px 12px;
          border-radius: 0;
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
          color: var(--text-color);
        }

        section#content > .container > .fields  .field   span.wrapper > input:focus {
          border: var(--input-border-focus);
        }

        section#content > .container > .fields  .field  input {
          border: var(--input-border);
          font-size: 1rem;
          width: 100%;
          height: 40px;
          outline: none;
          padding: 10px 12px;
          border-radius: 12px;
          color: var(--text-color);
        }

        section#content > .container > .fields  .field  input:focus {
          border: var(--input-border-focus);
        }

        section#content > .container > .fields  .field select {
          font-size: 1rem;
          width: 100%;
          height: 40px;
          outline: none;
          padding: 10px 12px;
          border: var(--input-border);
          border-radius: 4px;
          box-sizing: border-box;
          background-color: var(--background);
          color: var(--text-color);
          border-radius: 12px;
        }

        select:hover {
          border-color: var(--accent-color);
        }

        select:focus {
          outline: none;
          border-color: var(--accent-color);
        }

        
        section#content > .container > .fields  .field  textarea:focus{
          border: var(--input-border-focus);
        }

        section#content > .container > .services {
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          gap: 15px;
        }

        section#content > .container > .services > .options {
          width: 100%;
          display: flex;
          flex-flow: row;
          flex-wrap: wrap;
          justify-content: center;
          align-items: start;
          gap: 15px;
        }

        section#content > .container > .services > .options > .option {
          border: 1px solid #80808037;
          font-size: 1rem;
          padding: 8px 20px;
          border-radius: 50px;
          color: #666666;
          cursor: pointer;
          font-family: var(--font-alt);
          line-height: 1.2;
        }

        section#content > .container > .services > .options > .option.selected {
          border: none;
          background: linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%);
          color: #ffffff;
        }


        section#content > .container > .services > .other{
          /*border-top: 1px solid #80808017;*/
          width: 100%;
          padding: 15px 0px;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }
        section#content > .container > .services > .other span.text {
          color: #666666;
          /*text-transform: capitalize;*/
          font-family: var(--font-alt);
          line-height: 1.2;
        }

        section#content > .container > .services > .other > input {
          border: 1px solid #80808037;
          font-size: 1rem;
          width: 100%;
          outline: none;
          padding: 10px 12px;
          border-radius: 12px;
          color: var(--text-color);
        }

        section#content > .container > .services > .other > input:focus {
          border: 1px solid #08b86f60;
        }

        /*Schedules*/

        .schedules {
          background-color: #80808010;
          width: 100%;
          min-width: 100%;
          position: relative;
          padding: 20px 25px;
          display: flex;
          gap: 0px;
          flex-flow: column;
          border-radius: 25px;
        }

        .schedules>.schedules-header{
          /*border: 1px solid #808080;*/
          display: flex;
          flex-flow: column;
          gap: 10px;
        }

        .schedules>.schedules-header>.title-wrapper{
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .schedules>.schedules-header>.title-wrapper>.navs {
          /*border: 1px solid #808080;*/
          padding: 0 5px 0 0;
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }

        .schedules > .schedules-header > .title-wrapper > .navs > .nav {
          background-color: #80808013;
          width: 28px;
          height: 28px;
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: center;
          color: #808080;
          cursor: pointer;
          border-radius: 50px;
        }

        .schedules > .schedules-header > .title-wrapper > .navs > .nav:hover {
          background-color: #08b86f;
          color: #ffffff;
        }

        .schedules > .schedules-header > .title-wrapper > .navs > .nav > svg {
          width: 16px;
          height: 16px;
          stroke-width: 1.8;
        }

        .schedules > .schedules-header > .title-wrapper > .selected-date {
          font-size: 1.2rem;
          color: #666666;
        }

        .schedules > .schedules-header > .days{
          /*border: 1px solid #808080;*/
          display: flex;
          flex-wrap: nowrap;
          align-items: stretch;
          justify-content: space-between;
          gap: 5px;
        }

        .schedules>.schedules-header>.days>.day {
          padding: 8px 10px;
          width: 65px;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          border-radius: 15px;
          color: #808080;
          cursor: pointer;
        }

        .schedules > .schedules-header > .days > .day.selected {
          /*background-color: #ffffff;
          font-weight: bold;
          color: var(--text-color);*/
          background:  rgb(223, 121, 26);
          background: linear-gradient(0deg, rgb(223, 121, 26) 0%, rgb(240, 156, 78) 100%);
          background-color: rgb(247, 145, 162);
          color: #ffffff;
        }

        .schedules > .schedules-header > .days > .day.selected > span.dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          background-color: #ffffff;
          border-radius: 25px;
        }

        .schedules > .schedules-header > .days > .day:hover {
          background-color: #90909017;
        }

        .schedules > .schedules-header > .days > .selected:hover {
          background-color: #ffffff;
        }

        .schedules > .schedules-header > .days > .day > .name {
          color: inherit;
        }
      
        .schedules > .schedules-header > .days > .day > .date {
          display: inline-block;
          color: inherit;
        }
        
        .calendar-action {
        /* border: 1px solid #808080;*/
          width: 100%;
          padding: 20px 25px;
          display: flex;
          flex-flow: column;
          align-items: center;
          gap: 10px;
        }

        .calendar-action > span.look {
          background-color: #80808057;
          color: #808080;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: max-content;
          padding: 10px 20px;
          border-radius: 50px;
          animation: skeleton 1s linear infinite alternate;
        }

        @keyframes skeleton {
            0%{
              opacity: 1;
            }
            100%{
              opacity: .25;
            }
          }

        .calendar-action > .results {
          width: 100%;
          display: flex;
          flex-flow: column;
          align-items: center;
          gap: 18px;
        }

        .calendar-action  span.inform {
          color: #808080;
        }

        .calendar-action  span.empty {
          color: #ff9500;
          padding: 25px 20px;
          font-family: var(--font-alt);
          font-weight: 500px;
          text-align: center;
        }

        .calendar-action > .results  > .photographer {
          background-color: #80808010;
          padding: 12px 18px;
          display: flex;
          flex-flow: row;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: space-between;
          width: 80%;
          border-radius: 25px;
        }

        .calendar-action > .results  > .photographer .info {
          display: flex;
          flex-flow: row;
          flex-wrap: nowrap;
          align-items: center;
          gap: 10px;
        }

        .calendar-action > .results  > .photographer .info > .image {
          width: 32px;
          height: 32px;
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 50px;
        }

        .calendar-action > .results  > .photographer .info > .image > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50px;
        }


        .calendar-action > .results  > .photographer .info > .name {
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 0;
        }

        .calendar-action > .results  > .photographer .info > .name  p {
          margin: 0;
          font-family: var(--font-alt);
          font-weight: 500px;
          color: var(--text-color);
        }

        .calendar-action > .results  > .photographer .info > .name  span {
          margin: 0;
          color: #808080;
          font-size: 0.9rem;
          text-transform: lowercase;
        }

        .calendar-action > .results  > .photographer .select {
          background-color: #099eef18;
          display: flex;
          flex-flow: row;
          flex-wrap: nowrap;
          align-items: center;
          color: #08b86f;
          padding: 8px 18px;
          border-radius: 15px;
          cursor: pointer;
        }

        .calendar-action > .results  > .photographer .selected {
          background-color: #08b86f;
          color: #ffffff;
        }

        section#content .packages {
          /* border: 1px solid black; */
          width: 100%;
          display: flex;
          flex-flow: row;
          padding: 15px 0 25px 0;
          align-items: start;
          gap: 15px;
        }

        section#content .packages > .package {
          border: 1px solid #80808027;
          width: 200px;
          max-width: 200px;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          gap: 10px;
          padding: 15px 15px;
          border-radius: 20px;
        }

        section#content .packages > .package.selected {
          background-color: #80808010;
          border: none;
        }

        section#content .packages > .package >  .name {
          /* border: 1px solid #80808027; */
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          gap: 2px;
        }

        section#content .packages > .package .name >p.name {
          margin: 0;
          font-family: var(--font-alt);
          font-weight: 500px;
          font-size: 1.2rem;
          color: var(--text-color);
        }

        section#content .packages > .package .name > span {
          margin: 0;
          font-size: 0.8rem;
          color: #808080;
        }

        section#content .packages > .package .items {
          /* border: 1px solid #80808027; */
          display: flex;
          flex-flow: row;
          flex-wrap: wrap;
          justify-content: start;
          align-items: center;
          gap: 5px;
        }

        section#content .packages > .package .items > .item{
          border: 1px solid #80808027;
          display: flex;
          flex-flow: row;
          justify-content: center;
          align-items: center;
          padding: 3px 10px;
          border-radius: 50px;
          font-size: 0.8rem;
          color: #808080;
        }

        section#content .packages > .package .price{
          border-top: 1px solid #80808027;
          width: 100%;
          font-family: var(--font-alt);
          display: flex;
          flex-flow: row;
          justify-content: start;
          align-items: start;
          padding: 10px 0 0 0;
          font-size: 1.1rem;
          color: #808080;
        }

        section#content .packages > .package .price span {
          display: inline-block;
          padding: 0 5px 0 0;
        }

        section#content .packages > .package .select {
          background-color: #099eef18;
          font-family: var(--font-alt);
          width: 100%;
          text-align: center;
          color: #08b86f;
          padding: 8px 18px;
          border-radius: 15px;
          cursor: pointer;
        }

        section#content .packages > .package.selected .select {
          background-color: #08b86f;
          color: #ffffff;
        }

        section#content  p.manual-title {
          /* align-self: start; */
          margin: 0;
          font-family: var(--font-alt);
          font-weight: 500px;
          font-size: 1.2rem;
          color: var(--text-color);
        }

        section#content  p.manual-title span {
          /* align-self: start; */
          padding: 0 5px;
          font-family: var(--font-alt);
          /* font-weight: 500px; */
          font-size:0.93rem;
          color: var(--text-color);
        }

        section#content .select-manually {
          /* border: 1px solid black; */
          /* align-self: start; */
          display: flex;
          flex-flow: row;
          padding: 15px 0 25px 0;
          align-items: start;
          gap: 15px;
        }

        section#content .select-manually > .picker {
          /* border: 1px solid black; */
          background-color: #80808010;
          align-self: start;
          display: flex;
          flex-flow: row;
          padding: 15px 15px;
          border-radius: 15px;
          align-items: start;
          gap: 15px;
        }

        section#content .select-manually > .picker span.no {
          /* border: 1px solid black; */
          background-color: #ffffff;
          width: 30px;
          height: 30px;
          text-align: center;
          padding: 5px;
          border-radius: 50px;
          color:  #099eef;
        }

        section#content .select-manually > .picker > .nav {
          width: 28px;
          height: 28px;
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          cursor: pointer;
          border-radius: 50px;
          background:  rgb(223, 121, 26);
          background: linear-gradient(0deg, rgb(223, 121, 26) 0%, rgb(240, 156, 78) 100%);
          background-color: rgb(247, 145, 162);
        }

        section#content .select-manually > .picker > .nav > svg {
          rotate: -90deg;
          width: 16px;
          height: 16px;
          stroke-width: 1.8;
        }

        section#content .pay {
          /* border: 1px solid black; */
          width: 100%;
          display: flex;
          flex-flow: row;
          padding: 15px 0 25px 0;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }

        section#content .pay > .field  p {
          margin: 0 0 10px 0;
          font-family: var(--font-alt);
          font-weight: 500px;
          color: var(--text-color);
        }

        section#content .pay > .field > span.wrapper {
          display: flex;
          align-items: center;
          gap: 0;
          width: 100%;
        }

        section#content .pay > .field > span.wrapper > span {
          border: 1px solid #80808037;
          border-right: none;
          font-size: 1rem;
          width: 60px;
          padding: 10px 12px;
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
          color: #08b86f;
          display: flex;
          align-items: center;
        }

        section#content .pay > .field > span.wrapper > input {
          border: 1px solid #80808037;
          font-size: 1rem;
          width: calc(100% - 60px);
          outline: none;
          padding: 10px 12px;
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
          color: #505050;
        }

        section#content .pay > .field >  span.wrapper > input:focus {
          border: 1px solid #08b86f60;
        }

        @media all and (max-width: 660px) {
          section#content > .container > .fields  .field.location,
          section#content > .container > .fields  .field.contact,
          section#content > .container > .fields  .field.name {
            width: 100%;
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: start;
            gap: 20px;
            height: max-content;
          }
        }

      </style>
    `;
  }
}