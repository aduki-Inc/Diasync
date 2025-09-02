export default class ChatApp extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.active_tab = null;
    this.mql = window.matchMedia("(max-width: 700px)");
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.render();
  }

  render() {
    this.shadow.innerHTML = this.getTemplate();
  }

  watchMql = () => {
    this.mql.addEventListener("change", e => {
      // console.log("Media query changed", e);
      this.render();
      this.setUpEventListeners();
    });
  }

  connectedCallback() {
    this.watchMql();
    this.setUpEventListeners();
  }

  setUpEventListeners = () => {
    const tabs = this.shadow.querySelector("ul.tabs");

    // if tabs exist, activate the tab controller
    if (tabs) this.activateTabController(tabs);
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

  getTemplate() {
    return /* html */`
      ${this.getChatsContainer()}
      <!--${this.getMessagingContainer()}-->
      ${this.getStyles()}
    `;
  }

  getChatsContainer = () => {
    return /* html */`
      <div class="chats">
        ${this.getForm()}
        <div class="container">
          ${this.getTab()}
          <div class="chats-container">
            ${this.getChats()}
          </div>
        </div>
      </div>
    `;
  }

  getEmptyChat = () => {
    return /* html */`
      <div class="empty-chat">
        <div class="head">
          <h3 class="title">Select a chat to start messaging</h3>
          <p class="subtitle">Your messages are private and secure</p>
        </div>
        <div class="image">
          <img src="/thumbs/chat.png" alt="chat">
        </div>
        <div class="new">
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="text">New Chat</span>
          </button>
        </div>
      </div>
    `;
  }

  getMessagingContainer = () => {
    return /* html */`
      <chat-container user-picture="https://randomuser.me/api/portraits/men/1.jpg"
        user-name="Dr Sarah Hannah" unread="0" active="true" user-verified="true"
        message="I have attached the needed documents below!" last-active="2024-12-26T01:25:15Z">
      </chat-container>
    `;
  }

  getForm = () => {
    return /*html*/`
      <form action="" method="get" class="search">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M15.28 5.22a.75.75 0 0 1 0 1.06L9.56 12l5.72 5.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-6.25-6.25a.75.75 0 0 1 0-1.06l6.25-6.25a.75.75 0 0 1 1.06 0Z"></path>
        </svg>
        <div class="contents">
          <input type="text" name="q" id="query" placeholder="Search your chats">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11.7666" cy="11.7667" r="8.98856" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"  stroke-linejoin="round" />
            <path d="M18.0183 18.4853L21.5423 22.0001" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <button type="submit">Search</button>
        </div>
      </form>
    `
  }

  getTab = () => {
    return /* html */`
      <ul class="tabs">
        <li class="tab active">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M12.5 3H11.5C7.02166 3 4.78249 3 3.39124 4.39124C2 5.78249 2 8.02166 2 12.5C2 16.9783 2 19.2175 3.39124 20.6088C4.78249 22 7.02166 22 11.5 22C15.9783 22 18.2175 22 19.6088 20.6088C21 19.2175 21 16.9783 21 12.5V11.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M22 5.5C22 7.433 20.433 9 18.5 9C16.567 9 15 7.433 15 5.5C15 3.567 16.567 2 18.5 2C20.433 2 22 3.567 22 5.5Z" stroke="currentColor" stroke-width="1.8" />
            <path d="M7 11H11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7 16H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">All</span>
          <span class="count">${this.number.format(this.getAttribute("all"))}</span>
        </li>
        <li class="tab">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M21.9598 10.9707C22.0134 11.8009 22.0134 12.6607 21.9598 13.4909C21.6856 17.7332 18.3536 21.1125 14.1706 21.3905C12.7435 21.4854 11.2536 21.4852 9.8294 21.3905C9.33896 21.3579 8.8044 21.2409 8.34401 21.0513C7.83177 20.8403 7.5756 20.7348 7.44544 20.7508C7.31527 20.7668 7.1264 20.9061 6.74868 21.1846C6.08268 21.6757 5.24367 22.0285 3.99943 21.9982C3.37026 21.9829 3.05568 21.9752 2.91484 21.7351C2.77401 21.495 2.94941 21.1626 3.30021 20.4978C3.78674 19.5758 4.09501 18.5203 3.62791 17.6746C2.82343 16.4666 2.1401 15.036 2.04024 13.4909C1.98659 12.6607 1.98659 11.8009 2.04024 10.9707C2.31441 6.72838 5.64639 3.34913 9.8294 3.07107C11.0318 2.99114 11.2812 2.97856 12.5 3.03368" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8.5 15H15.5M8.5 10H12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M22 5.5C22 7.433 20.433 9 18.5 9C16.567 9 15 7.433 15 5.5C15 3.567 16.567 2 18.5 2C20.433 2 22 3.567 22 5.5Z" stroke="currentColor" stroke-width="1.8" />
          </svg>
          <span class="text">Unread</span>
          <span class="count">${this.number.format(43)}</span>
        </li>
        <li class="tab">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M21.7109 9.3871C21.8404 9.895 21.9249 10.4215 21.9598 10.9621C22.0134 11.7929 22.0134 12.6533 21.9598 13.4842C21.6856 17.7299 18.3536 21.1118 14.1706 21.3901C12.7435 21.485 11.2536 21.4848 9.8294 21.3901C9.33896 21.3574 8.8044 21.2403 8.34401 21.0505C7.83177 20.8394 7.5756 20.7338 7.44544 20.7498C7.31527 20.7659 7.1264 20.9052 6.74868 21.184C6.08268 21.6755 5.24367 22.0285 3.99943 21.9982C3.37026 21.9829 3.05568 21.9752 2.91484 21.7349C2.77401 21.4946 2.94941 21.1619 3.30021 20.4966C3.78674 19.5739 4.09501 18.5176 3.62791 17.6712C2.82343 16.4623 2.1401 15.0305 2.04024 13.4842C1.98659 12.6533 1.98659 11.7929 2.04024 10.9621C2.31441 6.71638 5.64639 3.33448 9.8294 3.05621C10.2156 3.03051 10.6067 3.01177 11 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8.5 15H15.5M8.5 10H12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M14 4.5L22 4.5M14 4.5C14 3.79977 15.9943 2.49153 16.5 2M14 4.5C14 5.20023 15.9943 6.50847 16.5 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">Tickets</span>
          <span class="count">${this.number.format(3)}</span>
        </li>
      </ul>
    `;
  }

  getChats = () => {
    return /* html */`
      <div is="chat-item" user-picture="https://randomuser.me/api/portraits/women/45.jpg"
        user-name="Dr. Sarah Mwangi GGfffsssfsffffsfsffsffsfsfsffsssssffsfsfsf" unread="0" active="true" you="false" opened="true"
        message="I have attached your test results and treatment plan below!" is-even="true" datetime="2025-01-05T09:30:00Z"
        user-verified="true" user-profession="General Practitioner" user-location="Kenyatta National Hospital"
        attachments='[
          {
            "name": "Blood_Test_Results.pdf",
            "size": "1.2MB",
            "type": "pdf",
            "link": "https://example.com/blood-test-results.pdf"
          },
          {
            "name": "Treatment_Plan.pdf",
            "size": "2.4MB",
            "type": "pdf",
            "link": "https://example.com/treatment-plan.pdf"
          },
          {
            "name": "Prescription_Details.pdf",
            "size": "0.8MB",
            "type": "pdf",
            "link": "https://example.com/prescription.pdf"
          }
          ]'>
      </div>
      <div is="chat-item" user-picture="https://randomuser.me/api/portraits/men/32.jpg"
      user-name="James Ochieng" unread="0" active="false" you="true" message="Thank you doctor, I'll book the follow-up appointment today!"
      is-even="false" datetime="2025-01-05T09:28:00Z" recieved="true" user-verified="false" user-profession="Patient" user-location="Makongeni, Nairobi">
      </div>
      <div is="chat-item" user-picture="https://randomuser.me/api/portraits/women/38.jpg"
      user-name="Dr. Grace Wanjiku" unread="2" active="true" you="false"
      images="https://i.pravatar.cc/200?img=12,https://i.pravatar.cc/200?img=2,https://i.pravatar.cc/200?img=40"
      message="Your dental cleaning is scheduled for next week. Any sensitivity issues?" is-even="false" datetime="2025-01-04T14:30:00Z"
      user-verified="true" user-profession="Dentist" user-location="Westlands Dental Clinic">
      </div>
      <div is="chat-item" user-picture="https://randomuser.me/api/portraits/men/28.jpg"
      user-name="Peter Kimani" unread="1" active="false" you="true" opened="true"
      message="No sensitivity, just routine cleaning please." is-even="true" datetime="2025-01-04T10:15:00Z" user-verified="false" user-profession="Patient" user-location="Kiambu, Kenya">
      </div>
      <div is="chat-item" user-picture="https://randomuser.me/api/portraits/men/42.jpg"
      user-name="Dr. Michael Kiptoo" unread="0" active="true" you="false"
      message="Your heart monitor results look normal. Continue medication as prescribed." is-even="true" datetime="2025-01-03T16:45:00Z" user-verified="true" user-profession="Cardiologist" user-location="Nairobi Hospital">
      </div>
      <div is="chat-item" user-picture="https://randomuser.me/api/portraits/women/22.jpg"
      user-name="Mary Njeri" unread="1" active="false" you="true"
      message="Thank you Dr. Kiptoo, feeling much better now!" is-even="false" datetime="2025-01-03T11:20:00Z" user-verified="false" user-profession="Patient" user-location="Karen, Nairobi">
      </div>
      <div is="chat-item" user-picture="https://randomuser.me/api/portraits/women/35.jpg"
      user-name="Dr. Angela Wambui" unread="3" active="true" you="false"
      message="Your pregnancy check-up went well. Next appointment in 4 weeks." is-even="true" datetime="2025-01-02T09:15:00Z" user-verified="true" user-profession="Obstetrician" user-location="Aga Khan University Hospital">
      </div>
      <div is="chat-item" user-picture="https://randomuser.me/api/portraits/men/35.jpg"
      user-name="David Maina" unread="0" active="false" you="true"
      message="Perfect! My wife is very happy with the care." is-even="false" datetime="2025-01-01T18:30:00Z" user-verified="false" user-profession="Patient" user-location="Thika, Kiambu">
      </div>
      <div is="chat-item" user-picture="https://randomuser.me/api/portraits/women/28.jpg"
      user-name="Dr. Faith Cherop" unread="2" active="true" you="false"
      message="Your child's vaccination schedule is updated. See attached calendar." is-even="true" datetime="2024-12-30T14:20:00Z" user-verified="true" user-profession="Pediatrician" user-location="Gertrude's Children's Hospital">
      </div>
      <div is="chat-item" user-picture="https://randomuser.me/api/portraits/men/25.jpg"
      user-name="John Mutua" unread="1" active="false" you="true"
      message="Thank you! We'll bring him in next month." is-even="false" datetime="2024-12-29T16:45:00Z" user-verified="false" user-profession="Patient" user-location="Eastleigh, Nairobi">
      </div>
      <div is="chat-item" user-picture="https://randomuser.me/api/portraits/women/40.jpg"
      user-name="Dr. Rose Kiprotich" unread="0" active="true" you="false"
      message="Your eye exam results are ready for collection." is-even="true" datetime="2024-12-28T11:30:00Z" user-verified="true" user-profession="Ophthalmologist" user-location="Mater Misericordiae Hospital">
      </div>
      <div is="chat-item" user-picture="https://randomuser.me/api/portraits/men/40.jpg"
      user-name="Samuel Otieno" unread="2" active="false" you="true"
      message="Will my new glasses be ready this week?" is-even="false" datetime="2024-12-27T08:15:00Z" user-verified="false" user-profession="Patient" user-location="Kisumu, Kenya">
      </div>
      <div is="chat-item" user-picture="https://randomuser.me/api/portraits/women/33.jpg"
      user-name="Dr. Nancy Akinyi" unread="1" active="true" you="false"
      message="Your therapy session went well today. See you next week!" is-even="true" datetime="2024-12-26T17:00:00Z" user-verified="true" user-profession="Therapist" user-location="Karen Wellness Center">
      </div>
    `;
  }

  getUsersModel = () => {
    return /* html */`
      <users-modal api="/chat/users" name="Select a user to start a chat with"></users-modal>
    `;
  }

  getStyles = () => {
    return /* css */`
      <style>
        :host {
          display: flex;
          max-width: 100%;
          width: 100%;
          min-width: 100%;
          padding: 0;
          height: 100dvh;
          max-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: start;
          padding: 0;
          gap: 20px;
        }

        * {
          box-sizing: border-box;
          font-family: var(--font-main), sans-serif;
        }

        div.empty-chat {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 0;
          width: 100%;
          height: 100%;
        }

        div.empty-chat > div.head {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
        }

        div.empty-chat > div.head > h3.title {
          font-size: 1.35rem;
          margin: 0;
          font-weight: 600;
          line-height: 1.5;
          font-family: var(--font-title);
          color: var(--text-color);
        }

        div.empty-chat > div.head > p.subtitle {
          font-size: 1rem;
          margin: 0;
          line-height: 1.5;
          font-weight: 400;
          color: var(--gray-color);
        }

        div.empty-chat > div.image {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        div.empty-chat > div.image > img {
          width: 100%;
          max-width: 300px;
          height: auto;
          object-fit: contain;
        }

        div.empty-chat > div.new {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        div.empty-chat > div.new > button {
          border: none;
          cursor: pointer;
          color: var(--white-color);
          background: var(--accent-linear);
          height: 40px;
          width: max-content;
          padding: 0 20px;
          font-size: 1rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          border-radius: 12px;
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
        }

        div.empty-chat > div.new > button > svg {
          width: 20px;
          height: 20px;
        }

        div.empty-chat > div.new > button > span.text {
          font-size: 1rem;
          font-weight: 600;
          color: var(--white-color);
        }

        div.chats {
          width: 100%;
          height: 100%;
          max-height: 100%;
          display: flex;
          flex-direction: column;
          align-items: start;
          overflow-y: scroll;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          -ms-overflow-style: -ms-autohiding-scrollbar;
          scroll-snap-type: y mandatory;
        }
        
        div.chats::-webkit-scrollbar {
          display: none !important;
          visibility: hidden !important;
        }

        form.search {
          background: var(--background);
          padding: 0;
          margin: 10px 0 0;
          padding: 10px 0 10px;
          display: flex;
          flex-flow: column;
          align-items: start;
          flex-wrap: nowrap;
          gap: 5px;
          z-index: 6;
          width: 100%;
          position: sticky;
          top: 0;
        }

        form.search > svg {
          position: absolute;
          display: none;
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
          outline: none;
          font-family: var(--font-text);
          color: var(--highlight-color);
          font-size: 1rem;
          padding: 8px 10px 8px 35px;
          gap: 0;
          width: 100%;
          border-radius: 15px;
        }
        
        form.search > .contents > input:-webkit-autofill,
        form.search > .contents > input:-webkit-autofill:hover, 
        form.search > .contents > input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px var(--background) inset;
          -webkit-text-fill-color: var(--text-color) !important;
          transition: background-color 5000s ease-in-out 0s;
          color: var(--highlight-color) !important;
        }
        
        form.search > .contents > input:autofill {
          filter: none;
          color: var(--highlight-color) !important;
        }

        form.search > .contents > input::placeholder {
          color: var(--gray-color);
          font-family: var(--font-text), sans-serif;
          font-size: 1rem;
          opacity: 0.8;
        }

        form.search > .contents > input:focus {
          border: var(--input-border-focus);
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
          top: calc(50% - 14px);
          border: none;
          cursor: pointer;
          color: var(--white-color);
          background: var(--accent-linear);
          height: 28px;
          width: max-content;
          padding: 0 10px;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        .chats > .container {
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 10px;
          width: 100%;
          max-width: 100%;
          padding: 0;
        }

        ul.tabs {
          border-bottom: var(--border);
          display: flex;
          z-index: 1;
          flex-flow: row nowrap;
          gap: 15px;
          padding: 18px 0 10px;
          margin: 0;
          width: 100%;
          list-style: none;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          z-index: 1;
          position: sticky;
          top: 45px;
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
          display: flex;
          text-align: center;
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
          padding: 1px 7px 2.5px;
          border-radius: 10px;
        }

        div.chats-container {
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        @media screen and (max-width: 700px) {
          :host {
            border: none;
            width: 100%;
            max-width: 100%;
            min-width: 100%;
            max-height: unset;
            height: unset;
            min-height: unset;
            max-height: unset;
            padding: 0 0 65px;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: start;
          }

          div.main {
            width: 100%;
            min-width: 100%;
            height: unset;
            min-height: unset;
            max-height: unset;
            padding: 0;
            margin: 0;
          }

          div.chats {
            width: 100%;
            min-width: 100%;
            height: max-content;
            min-height: max-content;
            max-height: max-content;
            padding: 0 10px;
            margin: 0;
            position: relative;
            overflow-y: unset;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
            -ms-overflow-style: -ms-autohiding-scrollbar;
          }

          /* reset all cursor: pointer to cursor: default */
          a, button, input, label, select, textarea,
          ul.tabs > li.tab, ul.tabs > li.tab.active {
            cursor: default !important;
          }

          form.search {
            background: var(--background);
            padding: 0;
            margin: 5px 0;
            padding: 7px 0 0;
            display: flex;
            flex-flow: column;
            align-items: start;
            flex-wrap: nowrap;
            gap: 5px;
            z-index: 6;
            width: 100%;
            position: relative;
            top: unset;
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

          form.search > svg {
            position: absolute;
            display: none;
            left: -12px;
            top: calc(50% - 20px);
            color: var(--text-color);
            cursor: pointer;
            width: 40px;
            height: 40px;
          }

          .chats > .container {
            display: flex;
            flex-flow: column;
            align-items: start;
            gap: 0;
            width: 100%;
            max-width: 100%;
            padding: 0;
          }

          ul.tabs {
            border-bottom: var(--border);
            display: flex;
            z-index: 1;
            flex-flow: row nowrap;
            gap: 15px;
            padding: 12px 0 8px;
            margin: 0;
            width: 100%;
            list-style: none;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            z-index: 1;
            position: relative;
            top: unset;
            background: var(--background);
          }

          ul.tabs::-webkit-scrollbar {
            display: none;
            visibility: hidden;
          }

          ul.tabs > li.tab > .count {
            padding: 2px 7px;
          }

          div.chats > .container > div.chats-container {
            display: flex;
            flex-flow: column;
            align-items: start;
            gap: 0;
            padding: 0;
            width: 100%;
          }
        }
      </style>
    `;
  }
}