export default class ReviewWrapper extends HTMLDivElement {
  constructor() {

    // We are not even going to touch this.
    super();
    this.shadowObj = this.attachShadow({ mode: 'open' });
    this.utils = window.app.utils;
    this.number = this.utils.number.parseInteger(this.getAttribute('number'));
    this.render();
  }


  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
  }

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `
  }

  getBody() {
    return /* html */`
      ${this.getHead()}
      ${this.getDesc()}
      ${this.getFooter()}
    `
  }

  getHead = () => {
    return /* html */`
      <div class="head">
        <div class="image">
          <img src="${this.getAttribute('user-picture')}" alt="Picture" srcset="">
        </div>
        <div class="details">
          <h2 class="name">${this.getAttribute('user-name')}</h2>
          <div class="stars">
            <div class="all">
              ${this.getStars(this.number)}
            </div>
            <span class="number">${this.number.toFixed(1)}</span>
          </div>
        </div>
			</div>
    `;
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

  getDesc = () => {
    return /* html */`
      <div class="desc">
        ${this.innerHTML}
      </div>
    `;
  }

  getFooter = () => {
    return /* html */`
      <div class="footer">
        <span class="date">${this.utils.date.formatDateTime(this.getAttribute('date'))}</span>
        <span class="sp">•</span>
        <span class="verified">${this.getAttribute('purpose')}</span>
      </div>
    `;
  }

  getStyles() {
    return /* css */`
      <style>
        * {
          box-sizing: border-box !important;

          /* disable user select */
          user-select: none;
          /* disable text selection */
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -o-user-select: none;
          -khtml-user-select: none;
        }

        :host {
          border-top: var(--border);
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 10px 0;
          width: 100%;
          min-width: 100%;
        }

        .head {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0;
          width: 100%;
        }

        .head > .image {
          border-radius: 50%;
          height: 40px;
          width: 40px;
          min-width: 40px;
          min-height: 40px;
          overflow: hidden;
        }

        .head > .image > img {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }

        .head > .details {
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        .head > .details > .name {
          font-size: 1rem;
          font-weight: 500;
          color: var(--title-color);
          font-family: var(--font-main), sans-serif;
          margin: 0;
        }

        .head > .details > .stars {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .head > .details > .stars > .all {
          display: flex;
          gap: 5px;
          align-items: center;
          justify-content: center;
        }

        .head > .details > .stars > .all > svg {
          height: 16px;
          width: 16px;
          color: var(--rating-color);
        }

        .head > .details > .stars > .number {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-read), sans-serif;
        }

        .desc {
          font-size: 1rem;
          font-weight: 400;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          margin: 5px  0;
          line-height: 1.2;
        }

        .desc p {
          margin: 5px 0;
          padding: 0;
        }

        .footer {
          font-size: 0.9rem;
          font-weight: 400;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .footer > .date {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
          text-transform: uppercase;
        }

        .footer > .sp {
          font-size: 1rem;
          font-weight: 500;
          display: inline-block;
          margin: 0;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
        }

        .footer > .verified {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--anchor-color);
          font-family: var(--font-read), sans-serif;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          :host {
          }

          a,
          .buttons > .button {
            cursor: default !important;
          }
        }
        
      </style>
    `
  }
}