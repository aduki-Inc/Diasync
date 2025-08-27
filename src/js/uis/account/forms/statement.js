export default class StatementForm extends HTMLElement {
	constructor() {
		super();
		this.shadowObj = this.attachShadow({ mode: "open" });
		this.utils = window.app.utils;
		this.render();
	}
	
	render() {
		this.shadowObj.innerHTML = this.getTemplate();
	}
	
	// noinspection JSUnusedGlobalSymbols
	connectedCallback() {
		const form = this.shadowObj.querySelector(".form");
		
		// add event listeners
		this.inputListener(form);
	}

  getYearsArray = (start, end) => {
    const years = [];
    for (let i = start; i <= end; i++) {
      years.push(i);
    }
    return years;
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
      <div class="content">
        ${this.getHead()}
        ${this.getForm(this.getAttribute("kind"))}
      </div>
    `;
	}
	
	getHead = () => {
		return /* html */`
      <div class="head">
        <h2 class="title">${this.getAttribute("name")}</h2>
        <div class="desc">
          ${this.innerHTML}
        </div>
      </div>
    `;
	}

  getForm = kind => {
    switch (kind) {
      case "year":
        return this.getYearForm();
      case "month":
        return this.getMonthlyForm();
      case "three-months":
        return this.getThreeMonthsForm();
      case "six-months":
        return this.getSixMonthsForm();
      case "week":
        return this.getWeeklyForm();
      case "day":
        return this.getDailyForm();
      default:
        return this.getYearForm();
    }
  }

  getDailyForm = () => {
    return /* html */`
      <form class="form">
        ${this.getFormHeader()}
        <div class="input-group">
          <span class="label">Day</span>
          <select name="data">
            <option value="" selected disabled>Select a day</option>
            ${this.createDailyOptions()}
          </select>
        </div>
        ${this.getConset()}
        ${this.getActions()}
      </form>
    `;
  }

  getWeeklyForm = () => {
    return /* html */`
      <form class="form">
        ${this.getFormHeader()}
        <div class="input-group">
          <span class="label">Week</span>
          <select name="data">
            <option value="" selected disabled>Select a week</option>
            ${this.createWeekOptions()}
          </select>
        </div>
        ${this.getConset()}
        ${this.getActions()}
      </form>
    `;
  }

  getMonthlyForm = () => {
    return /* html */`
      <form class="form">
        ${this.getFormHeader()}
        <div class="input-group">
          <span class="label">Month</span>
          <select name="data">
            <option value="" selected disabled>Select a month</option>
            ${this.createMonthlyOptions()}
          </select>
        </div>
        ${this.getConset()}
        ${this.getActions()}
      </form>
    `;
  }

  getThreeMonthsForm = () => {
    return /* html */`
      <form class="form">
        ${this.getFormHeader()}
        <div class="input-group">
          <span class="label">Three Months</span>
          <select name="data">
            <option value="" selected disabled>Select a three-month period</option>
            ${this.createThreeMonthsOptions()}
          </select>
        </div>
        ${this.getConset()}
        ${this.getActions()}
      </form>
    `;
  }

  getSixMonthsForm = () => {
    return /* html */`
      <form class="form">
        ${this.getFormHeader()}
        <div class="input-group">
          <span class="label">Six Months</span>
          <select name="data">
            <option value="" selected disabled>Select a six-month period</option>
            ${this.createSixMonthsOptions()}
          </select>
        </div>
        ${this.getConset()}
        ${this.getActions()}
      </form>
    `;
  }
	
	getYearForm = () => {
		return /* html */`
      <form class="form">
        ${this.getFormHeader()}
        <div class="input-group">
          <span class="label">Year</span>
          <select name="data">
            <option value="" selected disabled>Select a year</option>
            ${this.createYearOptions()}
          </select>
        </div>
        ${this.getConset()}
        ${this.getActions()}
      </form>
    `;
	}

  getFormHeader = () => {
    return /* html */`
      <div class="head">
        <h2 class="title">${this.getFormTitle(this.getAttribute("kind"))}</h2>
        <p class="description">It will be generated in PDF format and sent to your email address.</p>
      </div>
    `;
  }

  getFormTitle = kind => {
    switch (kind) {
      case "year":
        return "Choose a year to view your statement";
      case "month":
        return "Choose a month to view your statement";
      case "six-months":
        return "Choose a six-month period to view your statement";
      case "quarter":
        return "Choose a quarter to view your statement";
      case "three-months":
        return "Choose a three-month period to view your statement";
      case "day":
        return "Choose a day to view your statement";
      case "week":
        return "Choose a week to view your statement";
      default:
        return "Choose a year to view your statement";
    }
  }

  getConset = () => {
    return /* html */`
      <div class="consent">
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" stroke-width="1.8" />
            <path d="M8 12.5L10.5 15L16 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>Note: <b>Generating</b> this statement will cost you<span class="cost">${this.getAttribute('cost')} EAC.</span> 
          Check out our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms of Service</a> for more information.</span>
        </p>
      </div>
    `;
  }

  getActions = () => {
    return /* html */`
      <div class="actions">
        <button type="button" class="action cancel">Cancel</button>
        <button type="submit" class="action buy disabled">Generate</button>
      </div>
    `;
  }
	
  createYearOptions = () =>  {
    const years = this.getYearsArray(2024, new Date().getFullYear());
    let options = "";
    years.forEach((year) => {
      options += `<option value="year-${year}">${year}</option>`;
    });
    return options;
  }

  createSixMonthsOptions = () => {
    // create six months from todays date for upto last 1year: 2 options
    // option 1: current month to 6 months back
    const date = new Date();
    const currentEndMonth = date.toLocaleDateString("default", { month: "long" });
    const currentStartMonth = new Date(date.setMonth(date.getMonth() - 6)).toLocaleString("default", { month: "long" });
    return /* html */`
      <option value="six-months">${currentStartMonth} - ${currentEndMonth}</option>
    `;
  }

  createThreeMonthsOptions = () => {
    const date = new Date();
    const currentEndMonth = date.toLocaleDateString("default", { month: "long" });
    const currentStartMonth = new Date(date.setMonth(date.getMonth() - 3)).toLocaleString("default", { month: "long" });
    return /* html */`
      <option value="three-months">${currentStartMonth} - ${currentEndMonth}</option>
    `;
  }

  createMonthlyOptions = () => {
    // create twelve months from todays date for upto last 1year: 12 options
    const date = new Date();
    const months = [];
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(date.getFullYear(), date.getMonth() - i, 1);
      months.push({
        number: monthDate.getMonth() + 1,
        name: monthDate.toLocaleString("default", { month: "long" })
      });
    }
    let options = "";
    months.forEach((month) => {
      options += `<option value="month-${month.number}">${month.name}</option>`;
    });
    return options;
  }

  createWeekOptions = () => {
    // Create four weeks of options from today's date
    const date = new Date();
    const weeks = [];
  
    for (let i = 0; i < 4; i++) {
      // Get the start of each week (going backwards)
      const weekDate = new Date(date);
      weekDate.setDate(date.getDate() - (i * 7));
      
      // Format the date properly
      const formattedDate = weekDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
  
      weeks.push({
        number: weekDate.getDate(),
        date: formattedDate
      });
    }
  
    // Create options string using template literals
    return weeks
      .map(week => `<option value="week-${week.number}">Week of ${week.date}</option>`)
      .join('');
  };

  createDailyOptions = () => {
    // create thirty days from todays date for upto last 1month: 30 options
    const date = new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - i);
      days.push({
        number: dayDate.getDate(),
        name: dayDate.toLocaleString("default", { weekday: "long" })
      });
    }
    let options = "";
    days.forEach((day) => {
      options += `<option value="day-${day.number}">${day.name}</option>`;
    });
    return options;
  }

  inputListener = (form) => {
    const data = form.querySelector("select[name='data']");
    const submit = form.querySelector(".actions > button.buy");
    data.addEventListener("change", () => {
      if (data.value) {
        submit.classList.remove("disabled");
      } else {
        submit.classList.add("disabled");
      }
    });
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
          padding: 15px 0 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          height: max-content;
          align-items: start;
          justify-content: space-between;
          gap: 0;
          width: 100%;
        }

        .content {
          display: flex;
          flex-flow: column;
          gap: 2px;
          padding: 0;
          align-items: start;
          justify-content: space-between;
          transition: 0.3s;
          overflow: hidden;
        }

        .content > .head {
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 100%;
          padding: 0;
        }

        .content > .head > .title {
          font-size: 1.5rem;
          font-weight: 500;
          padding: 0;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          margin: 0;
          line-height: 1.4;
        }

        .content > .head > .desc {
          margin: 0;
          font-size: 1rem;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
        }

        .content > .head > .desc * {
          margin: 0;
          padding: 0;
          line-height: 1.4;
          font-size: 1rem;
          color: var(--gray-color);
          font-family: inherit;
        }

        .content > .head > .desc  p {
          margin: 5px 0 0;
        }

        .content > .head > .desc  a {
          color: var(--anchor-color);
        }


        .form {
          /* border-top: var(--border); */
          display: flex;
          flex-flow: column;
          gap: 15px;
          width: 100%;
          padding: 10px 0;
          margin: 0 0 10px;
        }
        
        .form > .head {
          display: flex;
          flex-flow: column;
          align-content: start;
          align-items: start;
          gap: 0;
          width: 100%;
          padding: 0;
        }
        
        .form > .head > .title {
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          margin: 0;
          line-height: 1.4;
        }
        
        .form > .head > .description {
          display: inline-block;
          margin: 0;
          font-size: .9rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
        }
        
        .form > .head > .description > b {
          font-weight: 600;
          color: var(--gray-color);
          font-family: var(--font-text), sans-serif;
        }

        .form > .input-group {
          border: var(--border);
          display: flex;
          flex-flow: column;
          gap: 10px;
          width: 100%;
          padding: 15px;
          border-radius: 12px;
        }

        .form > .input-group > .label {
          font-size: 1.15rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-read), sans-serif;
        }

        .form > .input-group > select {
          width: 100%;
          padding: 12px;
          border: var(--input-border);
          outline: none;
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          border-radius: 10px;
          background: none;
        }

        .form > .input-group > select:focus {
          border: var(--input-border-focus);
        }

        .form > .input-group > select option {
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-text), sans-serif;
        }

        .form > .input-group > select option[disabled] {
          color: var(--gray-color);
        }

        .form > .input-group > select option[selected] {
          color: var(--accent-color);
        }

        .form > .input-group > select option:hover {
          background: var(--accent-linear);
          color: var(--white-color);
        }

        .form > .input-group > select option:focus {
          background: var(--accent-linear);
          color: var(--white-color);
        }

        .form > .input-group > select option:checked {
          background: var(--accent-linear);
          color: var(--white-color);
        }
        
        .form > .consent {
          display: flex;
          flex-flow: row;
          gap: 5px;
          width: 100%;
          padding: 0;
        }
        
        .form > .consent > p {
          margin: 5px 0 0;
          display: flex;
          gap: 5px;
          font-size: 1rem;
          font-weight: 400;
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
        }
        
        .form > .consent > p b {
          font-weight: 500;
          color: var(--text-color);
        }
        
        .form > .consent > p > svg {
          min-width: 18px;
          max-width: 18px;
          min-height: 18px;
          margin: 0 0;
          color: var(--accent-color);
        }
        
        .form > .consent > p a {
          color: var(--anchor-color);
        }
        
        .form > .consent > p a:hover {
          text-decoration: underline;
        }

        .form > .consent > p .cost {
          font-weight: 500;
          color: var(--accent-color);
          display: inline-block;
          font-family: var(--font-text), sans-serif;
          padding: 0 5px;
        }

        .form > .actions {
          display: flex;
          flex-flow: row;
          padding: 10px 0;
          gap: 10px;
          width: 100%;
          justify-content: space-between;
          align-items: center;
        }

        .form > .actions > button.action {
          width: calc(50% - 10px);
          padding: 12px 0;
          border: none;
          outline: none;
          cursor: pointer;
          background: var(--gray-background);
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--text-color);
          font-family: var(--font-text), sans-serif;
          border-radius: 15px;
        }

        .form > .actions > button.action.buy {
          background: var(--accent-linear);
          color: var(--white-color);
        }

        .form > .actions > button.action.buy.disabled {
          background: var(--gray-background);
          color: var(--gray-color);
          border: none;
          opacity: 0.8;
          pointer-events: none;
        }

				@media screen and (max-width:660px) {
					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

					a {
						cursor: default !important;
          }
          
          .form > .consent > p {
            font-size: .8rem;
          }
          
          .form > .consent > p > svg {
            min-width: 14px;
            min-height: 14px;
            color: var(--accent-color);
          }
				}
	    </style>
    `;
	}
}