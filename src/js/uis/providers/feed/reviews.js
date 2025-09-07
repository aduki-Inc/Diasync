export default class Reviews extends HTMLElement {
  constructor() {
    super();

    // lets create our shadow root
    this.shadowObj = this.attachShadow({ mode: 'open' });
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.selected = true;
    this.activeSection = 'products';
    this.mql = window.matchMedia("(max-width: 700px)");
    this.owner = this.getAttribute('owner') === 'true';
    this.totalReviews = this.number.parseInteger(this.getAttribute('reviews'));
    this.averageReview = this.number.parse(this.getAttribute('average-review'));
    this.render();
  }

  render = () => this.shadowObj.innerHTML = this.getTemplate();

  connectedCallback() {
    // add event
  }

  disconnectedCallback() {
    // remove event
  }

  getTemplate() {
    return /* html */`
      ${this.getBody()}
      ${this.getStyles()}
    `
  }

  getBody = () => {
    return /* html */`
      ${this.getHeader()}
      ${this.getReviews()}
    `;
  }

  getHeader = () => {
    const title = this.owner ? 'Your Reviews' : 'Provider Reviews';
    return /* html */`
      <div class="head">
        <h3 class="title">${title}</h3>
      </div>
    `;
  }

  getReviews() {
    let distribution = this.getAttribute('reviews-distribution');
    try {
      distribution = JSON.parse(distribution);
    } catch (error) {
      console.error(error);
    }

    return /* html */`
      <div class="reviews">
        <div id="reviews-container" class="reviews-container">
          <div class="stats">
            ${this.reviewsStats(distribution)}
          </div>
          <div class="user-reviews">
            ${this.getReviewsItems()}
          </div>
        </div>
      </div>
    `
  }

  reviewsStats(totals) {
    const percantageAverage = (this.averageReview / 5) * 100;
    return /* html */`
      <div class="total">
        <span class="of">
          <span class="score">${this.getAttribute('average-review')}</span>
          <span class="slash"></span>
          <span class="of-total">5.0</span>
        </span>
        <span class="stars" style="width: ${percantageAverage}%;">
          ${this.getStars(5)}
        </span>
        <p class="text">${this.number.withCommas(this.totalReviews)} Reviews</p>
      </div>
      <div class="individual-scores">
        <span class="score five">
        <span class="no">5</span>
        <span class="bar">
          <span class="progress" style="width: ${this.getRatingPercentage(totals.five)}%;"></span>
        </span>
      </span>
      <span class="score four">
        <span class="no">4</span>
        <span class="bar">
          <span class="progress" style="width: ${this.getRatingPercentage(totals.four)}%;"></span>
        </span>
      </span>
      <span class="score three">
        <span class="no">3</span>
        <span class="bar">
          <span class="progress" style="width: ${this.getRatingPercentage(totals.three)}%;"></span>
        </span>
      </span>
      <span class="score two">
          <span class="no">2</span>
          <span class="bar">
            <span class="progress" style="width: ${this.getRatingPercentage(totals.two)}%;"></span> 
        </span>
      </span>
      <span class="score one">
        <span class="no">1</span>
        <span class="bar">
          <span class="progress" style="width: ${this.getRatingPercentage(totals.one)}%;"></span>
        </span>
      </span>
    </div>
    `
  }

  getStars = number => {
    // if number is not a number return empty string or less than 1 or greater than 5
    if (isNaN(number) || number < 1 || number > 5) return '';

    let stars = '';
    for (let i = 0; i < number; i++) {
      stars += this.getStarIcon();
    }
    return stars;
  }

  getStarIcon = () => {
    return /* html */`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
        <path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  }

  getRatingPercentage(no) {
    return ((no / parseFloat(this.totalReviews)) * 100).toFixed(2);
  }

  getReviewsItems = () => {
    return /* html */`
    <product-review user-name="John Smith" user-picture="https://randomuser.me/api/portraits/men/11.jpg" number="5" date="2024-11-15T00:00:00Z" purpose="Diagnosed">
      <p>Excellent product! Exceeded my expectations. Highly recommended.</p>
      <p>Will definitely purchase again.</p>
    </product-review>
    <product-review user-name="Emily Johnson" user-picture="https://randomuser.me/api/portraits/women/12.jpg" number="4" date="2024-10-20T00:00:00Z" purpose="Diagnosed">
      <p>Very satisfied with this product. Great quality and value for money.</p>
      <p>Would recommend to others.</p>
    </product-review>
    <product-review user-name="Michael Brown" user-picture="https://randomuser.me/api/portraits/men/13.jpg" number="3" date="2024-09-25T00:00:00Z" purpose="Purchase">
      <p>Good product but had some issues with delivery. Overall, happy with the purchase.</p>
      <p>May consider buying again.</p>
    </product-review>
    <product-review user-name="Jessica Davis" user-picture="https://randomuser.me/api/portraits/women/14.jpg" number="5" date="2024-08-30T00:00:00Z" purpose="Prescription">
      <p>Amazing product! Works perfectly and as described. Highly recommend.</p>
      <p>Will definitely buy again.</p>
    </product-review>
    <product-review user-name="David Wilson" user-picture="https://randomuser.me/api/portraits/men/15.jpg" number="4" date="2024-07-05T00:00:00Z" purpose="Prescription">
      <p>Very good product. Met all my expectations. Would recommend.</p>
      <p>Happy with the purchase.</p>
    </product-review>
    <product-review user-name="Sarah Miller" user-picture="https://randomuser.me/api/portraits/women/16.jpg" number="5" date="2024-06-10T00:00:00Z" purpose="Prescription">
      <p>Outstanding product! Great quality and performance. Highly recommend.</p>
      <p>Will buy again for sure.</p>
    </product-review>
    <product-review user-name="James Martinez" user-picture="https://randomuser.me/api/portraits/men/17.jpg" number="4" date="2024-05-15T00:00:00Z" purpose="Prescription">
      <p>Good product overall. Had a minor issue but customer service resolved it quickly.</p>
      <p>Would consider buying again.</p>
    </product-review>
    <product-review user-name="Linda Anderson" user-picture="https://randomuser.me/api/portraits/women/18.jpg" number="5" date="2024-04-20T00:00:00Z" purpose="Prescription">
      <p>Excellent quality product. Very happy with the purchase. Highly recommend.</p>
      <p>Will definitely buy again.</p>
    </product-review>
    <product-review user-name="Robert Thomas" user-picture="https://randomuser.me/api/portraits/men/19.jpg" number="4" date="2024-03-25T00:00:00Z" purpose="Prescription">
      <p>Very good product. Met my expectations. Would recommend to others.</p>
      <p>Happy with the purchase.</p>
    </product-review>
    <product-review user-name="Patricia Jackson" user-picture="https://randomuser.me/api/portraits/women/20.jpg" number="5" date="2024-02-28T00:00:00Z" purpose="Prescription">
      <p>Outstanding product! Great value for money. Highly recommend.</p>
      <p>Will buy again for sure.</p>
    </product-review>
    `;
  }

  getStyles() {
    return /* css */`
      <style>
        * {
          box-sizing: border-box !important;
        }

        :host {
          padding: 0;
          padding: 5px 0 0 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        div.head {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        div.head > h3.title {
          display: flex;
          align-items: center;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          font-size: 1.2rem;
          font-weight: 600;
          line-height: 1;
          margin: 0;
          padding: 0;
        }

        /* Tabs Styles */
        ul.tabs {
          list-style: none;
          display: flex;
          flex-flow: row nowrap;
          gap: 8px;
          padding: 0;
          position: relative;
          overflow-x: scroll;
          scrollbar-width: none;
          padding: 8px 10px;
          margin: 18px 0 0;
          border-radius: 10px;
          background: var(--tabs-background);
        }

        ul.tabs::-webkit-scrollbar {
          visibility: hidden;
          display: none;
        }

        ul.tabs > li.tab {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          gap: 8px;
          padding: 5px 10px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.3;
          white-space: nowrap;
          border-radius: 8px;
          transition: color 0.3s ease-in-out;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          -moz-backface-visibility: hidden;
          -ms-backface-visibility: hidden;
          position: relative;
        }

        ul.tabs > li.tab > span.icon {
          display: flex;
          justify-content: center;
          align-items: center;
          color: inherit;
        }

        ul.tabs > li.tab > span.icon > svg {
          width: 20px;
          height: 20px;
          color: inherit;
          transition: color 0.3s ease-in-out;
        }

        ul.tabs > li.tab.reviews > span.icon > svg {
          width: 18px;
          height: 18px;
        }

        ul.tabs > li.tab.services > span.icon > svg {
          width: 19px;
          height: 19px;
        }

        ul.tabs > li.tab.active,
        ul.tabs > li.tab:hover {
          color: var(--accent-color);
          background: var(--gray-background);
          font-weight: 600;
        }

        ul.tabs > li.tab:hover {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: background 0.3s ease-in-out;
        }

        div.doctors {
          padding: 15px 0;
          max-width: 100%;
          display: block;
          columns: 300px auto;
          column-gap: 10px;
          row-gap: 20px;
          margin: 0;
        }

        div.doctors > * {
          break-inside: avoid;
          margin-bottom: 10px;
          display: block;
        }

        div.no-bookings {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.4;
          margin: 15px 0;
          padding: 20px;
          width: 100%;
          text-align: center;
          border: var(--border);
          border-radius: 12px;
          background: var(--unselctable-background);
        }

        div.month-separator {
          display: flex;
          align-items: center;
          font-family: var(--font-main), sans-serif;
          color: var(--text-color);
          font-size: 1.2rem;
          font-weight: 500;
          line-height: 1;
          margin: 0;
          padding: 0;
        }

        div.reviews {
          display: flex;
          flex-flow: column;
          padding: 15px 0 0;
          gap: 35px;
          width: 100%;
        }

        #reviews-container {
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 100%;
        }

        #reviews-container .stats {
          width: 100%;
          padding: 0;
          display: flex;
          gap: 20px;
        }

        #reviews-container .stats > .total {
          background-color: var(--review-background);
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 180px;
          padding: 20px 20px;
          border-radius: 10px;
        }

        #reviews-container .stats > .total .of {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        #reviews-container .stats > .total > .of .score {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--rating-color);
        }

        #reviews-container .stats > .total > .of .of-total {
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--text-color);
        }

        #reviews-container .stats > .total > .of .slash {
          display: inline-block;
          width: 3px;
          height: 22px;
          border-radius: 5px;
          background-color: var(--text-color);
          rotate: 15deg;
        }

        #reviews-container .stats > .total .stars {
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 5px;
          overflow: hidden;
        }

        #reviews-container .stats > .total .stars svg {
          width: 23px;
          height: 23px;
          min-width: 23px;
          min-height: 23px;
          color: var(--rating-color);
         /* fill: var(--rating-color); */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        #reviews-container .stats > .total > p.text {
          font-size: 1rem;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          margin: 10px 0 0 0;
          font-weight: 500;
          line-height: 1.4;
        }

        #reviews-container .stats > .individual-scores {
          display: flex;
          flex-flow: column;
          gap: 2px;
          width: calc(100% - 200px);
          padding: 5px 0;
          justify-content: space-between;
        }

        #reviews-container .stats > .individual-scores span.score {
          color: var(--text-color);
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        #reviews-container .stats > .individual-scores span.score .no {
          display: inline-block;
          width: 20px;
          font-weight: 600;
          margin: 0;
        }

        #reviews-container .stats > .individual-scores span.score .bar {
          background-color: var(--gray-background);
          display: inline-block;
          width: calc(100% - 30px);
          height: 8px;
          margin: 0;
          border-radius: 50px;
          display: flex;
        }

        #reviews-container .stats > .individual-scores span.score .bar .progress {
          display: inline-block;
          width: 45%;
          height: 100%;
          border-radius: 50px;
          background: var(--rating-linear);
        }

        #reviews-container .stats > .individual-scores span.score.five .bar .progress {
          display: inline-block;
          width: 55%;
        }

        #reviews-container .stats > .individual-scores span.score.four .bar .progress {
          display: inline-block;
          width: 30%;
        }

        #reviews-container .stats > .individual-scores span.score.three .bar .progress {
          display: inline-block;
          width: 20%;
        }

        #reviews-container .stats > .individual-scores span.score.two .bar .progress {
          display: inline-block;
          width: 15%;
        }

        #reviews-container .stats > .individual-scores span.score.one .bar .progress {
          display: inline-block;
          width: 5%;
        }

        #reviews-container .user-reviews {
          padding: 20px 0 0;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

      </style>
    `
  }
}