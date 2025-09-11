export default class Provider extends HTMLElement {
  constructor() {
    super();
    this.shadowObj = this.attachShadow({ mode: "open" });
    this.app = window.app;
    this.api = this.app.api;
    this.owner = this.getAttribute('owner') === 'true';
    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // Set up event listeners and intervals
  }

  getTemplate() {
    return /* html */ `
      ${this.getStyles()}
      ${this.getBody()}
    `;
  }

  getBody = () => {
    const actions = this.owner ? this.getOwnerActions() : this.getUserActions();
    return /* html */ `
      ${actions}
    `;
  };

  getOwnerActions = () => {
    return /* html */ `
      <div class="actions">
        <button class="action">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M10.5502 3C6.69782 3.00694 4.6805 3.10152 3.39128 4.39073C2 5.78202 2 8.02125 2 12.4997C2 16.9782 2 19.2174 3.39128 20.6087C4.78257 22 7.0218 22 11.5003 22C15.9787 22 18.218 22 19.6093 20.6087C20.8985 19.3195 20.9931 17.3022 21 13.4498" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M11.0556 13C10.3322 3.86635 16.8023 1.27554 21.9805 2.16439C22.1896 5.19136 20.7085 6.32482 17.8879 6.84825C18.4326 7.41736 19.395 8.13354 19.2912 9.02879C19.2173 9.66586 18.7846 9.97843 17.9194 10.6036C16.0231 11.9736 13.8264 12.8375 11.0556 13Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9 17C11 11.5 12.9604 9.63636 15 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">Manage</span>
        </button>
        <button class="action">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" currentColor fill="none">
            <path d="M15 2.4578C14.053 2.16035 13.0452 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 10.9548 21.8396 9.94704 21.5422 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            <path d="M8.5 9.5L12 13L21.0002 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <span class="text">Schedule</span>
        </button>
        <button class="action">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M4 18.6458V8.05426C4 5.20025 4 3.77325 4.87868 2.88663C5.75736 2 7.17157 2 10 2H14C16.8284 2 18.2426 2 19.1213 2.88663C20 3.77325 20 5.20025 20 8.05426V18.6458C20 20.1575 20 20.9133 19.538 21.2108C18.7831 21.6971 17.6161 20.6774 17.0291 20.3073C16.5441 20.0014 16.3017 19.8485 16.0325 19.8397C15.7417 19.8301 15.4949 19.9768 14.9709 20.3073L13.06 21.5124C12.5445 21.8374 12.2868 22 12 22C11.7132 22 11.4555 21.8374 10.94 21.5124L9.02913 20.3073C8.54415 20.0014 8.30166 19.8485 8.03253 19.8397C7.74172 19.8301 7.49493 19.9768 6.97087 20.3073C6.38395 20.6774 5.21687 21.6971 4.46195 21.2108C4 20.9133 4 20.1575 4 18.6458Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M11 11H8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M14 7L8 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">Invoices</span>
        </button>
      </div>
    `;
  };

  getUserActions = () => {
    return /* html */ `
      <div class="actions">
        <button class="action">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M21.7109 9.3871C21.8404 9.895 21.9249 10.4215 21.9598 10.9621C22.0134 11.7929 22.0134 12.6533 21.9598 13.4842C21.6856 17.7299 18.3536 21.1118 14.1706 21.3901C12.7435 21.485 11.2536 21.4848 9.8294 21.3901C9.33896 21.3574 8.8044 21.2403 8.34401 21.0505C7.83177 20.8394 7.5756 20.7338 7.44544 20.7498C7.31527 20.7659 7.1264 20.9052 6.74868 21.184C6.08268 21.6755 5.24367 22.0285 3.99943 21.9982C3.37026 21.9829 3.05568 21.9752 2.91484 21.7349C2.77401 21.4946 2.94941 21.1619 3.30021 20.4966C3.78674 19.5739 4.09501 18.5176 3.62791 17.6712C2.82343 16.4623 2.1401 15.0305 2.04024 13.4842C1.98659 12.6533 1.98659 11.7929 2.04024 10.9621C2.31441 6.71638 5.64639 3.33448 9.8294 3.05621C10.2156 3.03051 10.6067 3.01177 11 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M8.5 15H15.5M8.5 10H12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M14 4.5L22 4.5M14 4.5C14 3.79977 15.9943 2.49153 16.5 2M14 4.5C14 5.20023 15.9943 6.50847 16.5 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <span class="text">Message</span>
        </button>
        <button class="action">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M4 5L16 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M4 12L20 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M4 19L12 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <span class="text">Services</span>
        </button>
        <button class="action">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M16 2V6M8 2V6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M3 10H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M17.5 15V22M21 18.5L14 18.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">Book</span>
        </button>
      </div>
    `;
  };

  getStyles = () => {
    return /* html */ `
      <style>
        :host {
          display: block;
          width: 100%;
          padding: 0;
          margin: 8px 0 0 0;
          font-family: var(--font-text), sans-serif;
          line-height: 1.6;
          color: var(--text-color);
        }

        * {
          box-sizing: border-box;
        }

        div.actions {
          display: flex;
          flex-flow: row nowrap;
          gap: 20px;
          padding: 0 0 15px;
          overflow-x: scroll;
          width: 100%;
          scroll-behavior: smooth;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none;  /* IE and Edge */
          &::-webkit-scrollbar { /* WebKit */
            display: none;
            visibility: hidden;
            width: 0;
          }
        }

        /* Action Cards */
        .action {
          background-color: var(--gray-background);
          border-radius: 15px;
          padding: 8px 15px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          color: var(--text-color);
          width: max-content;
          min-width: fit-content;
          border: 2px solid transparent;
          background-color: var(--hover-background);
          box-shadow: var(--box-shadow);
          border-color: var(--gray-color);
        }

        .action:hover {
          color: var(--accent-color);
          border-color: var(--accent-color);
        }

        /* Action Icons */
        .action > svg {
          width: 18px;
          height: 18px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: inherit;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .action > span.text {
          font-size: 1rem;
          font-weight: 500;
          color: inherit;
          margin: 0;
          line-height: 1.1;
          font-family: var(--font-main), sans-serif;
          letter-spacing: -0.01em;
        }

        @media screen and (max-width: 700px) {
          .action {
            background-color: var(--gray-background);
            border-radius: 12px;
            padding: 7px 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: default !important;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            color: var(--text-color);
            width: max-content;
            min-width: fit-content;
            background-color: var(--hover-background);
            box-shadow: unset;
            border-color: unset;
            border: var(--border);
          }

          .action > svg {
            width: 16px;
            height: 16px;
            display: inline-block;
            margin-top: -1px;
          }

          .action > span.text {
            font-size: 0.8rem;
            font-weight: 500;
            color: inherit;
            margin: 0;
            line-height: 1;
            font-family: var(--font-main), sans-serif;
            letter-spacing: -0.01em;
          }
        }
      </style>
    `;
  };
}