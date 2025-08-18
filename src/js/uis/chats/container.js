export default class ChatContainer extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.active_tab = null;
    this.openedContextNode = null;
    this.expanded = false;
    this.reply = null;
    this.app = window.app || {};
    this.number = this.app?.utils?.number;
    this.date = this.app?.utils?.date;
    this.render();
  }

  setOpenedContextNode = node => {
    this.openedContextNode = node;
  }

  render() {
    this.shadow.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    this.scrollMessages();
    const editor = this.shadow.querySelector('.editor');
    this.growTextarea(editor);
    this.dispatchVisualViewportResize();
  }

  disconnectedCallback() {
    // remove event listeners
    window.visualViewport?.removeEventListener('resize', this.adjustContentHeight);
  }

  setReply = data => {
    const editor = this.shadow.querySelector('.editor');

    if (editor) {
      // select textarea
      const textarea = editor.querySelector('textarea#message');
      // select existing reply element
      const reply = editor.querySelector('.reply');

      // if reply element exists, remove it
      if (reply) {
        reply.remove();
      }

      // set the reply data
      this.reply = data;
      editor.insertAdjacentHTML('afterbegin', this.getReply(data));
      this.activateReplyCancel(editor);

      // focus on the textarea
      textarea.focus();
    }
  }

  activateReplyCancel = editor => {
    const reply = editor.querySelector('.reply');

    if (reply) {
      const cancel = reply.querySelector('.cancel');

      cancel.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.reply = null;
        reply.remove();
      });
    }
  }

  scrollMessages = () => {
    const messages = this.shadow.querySelector('main.main');
    messages.scrollTop = messages.scrollHeight;
  }

  growTextarea = editor => {
    const form = editor.querySelector('form');
    const input = form.querySelector('textarea#message');
    const actionsContainer = form.querySelector('.actions-container');
    const actions = actionsContainer.querySelector('div.actions');
    const expand = actionsContainer.querySelector('div.expand');
    // select expand icon(svg)
    const icon = expand.querySelector('svg');

    const adjustRows = () => {
      const maxRows = 5;
      const style = window.getComputedStyle(input);
      const lineHeight = parseInt(style.lineHeight, 10);

      // rotate the expand button
      icon.style.transform = 'rotate(0deg)';

      // Calculate the height offset (padding + border)
      const paddingHeight = parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10);
      const borderHeight = parseInt(style.borderTopWidth, 10) + parseInt(style.borderBottomWidth, 10);
      const offset = paddingHeight + borderHeight;

      // Reset the rows to 1 to calculate the new height
      input.rows = 1;

      // Calculate the number of rows based on scrollHeight minus the offset
      let newRows = Math.floor((input.scrollHeight - offset) / lineHeight);
      input.rows = Math.min(maxRows, Math.max(newRows, 1)); // Ensure at least 1 row

      // Toggle actions visibility based on input
      if (input.value.trim().length > 0) {
        // hide actions in animation width
        actions.style.animation = 'hide-actions 0.3s forwards';
        actions.style.width = '0';

        // show expand button
        expand.style.opacity = '0';
        expand.style.animation = 'show-expand 0.3s forwards';
        expand.style.display = 'flex';
        expand.style.opacity = '1';

        // adjust the width of the input
        input.style.setProperty('width', 'calc(100% - 80px)')
        // input.style.setProperty('min-width', 'calc(100% - 80px)')
        // input.style.setProperty('max-width', 'calc(100% - 80px)')

        // scroll to the bottom
        this.scrollMessages();
      } else {
        // hide expand button
        expand.style.animation = 'hide-expand 0.3s forwards';
        expand.style.opacity = '0';
        expand.style.display = 'none';

        // show actions in animation width
        actions.style.animation = 'show-actions 0.3s forwards';
        actions.style.width = '100px';
        actions.style.display = 'flex';
        actions.style.opacity = '1';

        // shrink the input
        input.style.setProperty('width', 'calc(100% - 150px)')
        // input.style.setProperty('min-width', 'calc(100% - 150px)')
        // input.style.setProperty('max-width', 'calc(100% - 150px)')
      }
    };

    input.addEventListener('input', adjustRows);
    input.addEventListener('paste', adjustRows);

    // click on expand button
    expand.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (this.expanded) {
        // hide actions in animation width with expand button
        actions.style.animation = 'hide-actions 0.3s forwards';

        // remove .one-line class from the input
        input.classList.remove('one-line');

        // adjust the width of the input
        input.width = 'calc(100% - 80px)';

        // trigger input event to adjust the rows
        input.dispatchEvent(new Event('input'));

        // show expand button
        expand.style.opacity = '1';
        expand.style.animation = 'show-expand 0.3s forwards';

        // rotate the expand button
        icon.style.transform = 'rotate(0deg)';
        this.expanded = false;
        return;
      } else {
        // show actions in animation width with expand button
        actions.style.animation = 'show-actions 0.3s forwards';
        actions.style.width = '100px';
        actions.style.display = 'flex';
        actions.style.opacity = '1';

        // add .one-line class to the input
        input.classList.add('one-line');
        input.rows = 1;
        input.style.setProperty('width', 'calc(100% - 170px)');
        // rotate the expand button
        icon.style.transform = 'rotate(180deg)';
        this.expanded = true;
        return;
      }
    })

    // Initial adjustment on page load
    adjustRows();
  }

  adjustContentHeight = () => {
    // const editor = this.shadow.querySelector('.editor');
    const header = this.shadow.querySelector('.header');
    const content = this.shadow.querySelector('main.main');
    const messages = content.querySelector('.messages');
    // const docElement = document.documentElement;
    if (window.visualViewport) {
      // console.log('Visual Viewport Height: ', window.visualViewport.height);
      const viewportHeight = window.visualViewport.height;
      const headerHeight = header.offsetHeight;
      const messagesHeight = messages.offsetHeight;

      // window.alert(`Viewport Height: ${viewportHeight}, Header Height: ${headerHeight}, Messages Height: ${messagesHeight}, Editor Height: ${editorHeight}`);

      // if the messages height is less than the viewport height - (header height + editor height)
      if (messagesHeight) {
        // set content height to viewport height - (header height + editor height)
        content.style.height = `${viewportHeight - headerHeight}px`;
        content.style.setProperty('max-height', `${viewportHeight - headerHeight}px`);
        content.style.setProperty('min-height', `${viewportHeight - headerHeight}px`);

        // make it scrollable
        content.style.overflowY = 'scroll';

        // style body max-height
        document.body.style.setProperty('max-height', `${viewportHeight}px`)
        document.body.style.setProperty('height', `${viewportHeight}px`)
        document.body.style.setProperty('min-height', `${viewportHeight}px`)

        // scroll to the bottom
        this.scrollMessages();

        // hide scrollbar
        content.style.scrollbarWidth = 'none';
        content.style.msOverflowStyle = 'none';
        content.style.overflow = '-moz-scrollbars-none';
      }
    } else {
      console.error('Visual Viewport is not supported');
    }
  }

  dispatchVisualViewportResize = () => {
    window.visualViewport?.addEventListener('resize', this.adjustContentHeight);
  }

  textToBoolean = text => {
    return text === 'true' ? true : false;
  }

  getTemplate() {
    return /* html */`
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    return /* html */`
      ${this.getHeader()}
      <main class="main">
        <div class="messages">
          ${this.getMessages()}
        </div>
        ${this.getEditor()}
      </main>
    `;
  }

  getHeader = () => {
    return /*html*/`
      <header class="header">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M15.28 5.22a.75.75 0 0 1 0 1.06L9.56 12l5.72 5.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-6.25-6.25a.75.75 0 0 1 0-1.06l6.25-6.25a.75.75 0 0 1 1.06 0Z"></path>
        </svg>
        <div class="contents">
          <div class="profile">
            <div class="avatar">
              ${this.getImage(this.getAttribute('user-picture'))}
            </div>
            <span class="info">
              <span class="name">
                <span class="text">${this.getAttribute('user-name')}</span>
                ${this.checkVerified(this.textToBoolean(this.getAttribute('user-verified')))}
              </span>
              <span class="active">
                ${this.getActive(this.textToBoolean(this.getAttribute('active')))}
              </span>
            </span>
          </div>
          <div class="actions">
            ${this.getActions()}
          </div>
        </div>
      </header>
    `
  }

  getImage = image => {
    if (!image || image === '' || image === 'null') {
      return /* html */`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"></path>
        </svg>
      `;
    } else {
      return /* html */`
        <img src="${image}" alt="avatar">
      `;
    }
  }

  checkVerified = verified => {
    if (verified) {
      return /* html */`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
        <path id="outer" d="M18.9905 19H19M18.9905 19C18.3678 19.6175 17.2393 19.4637 16.4479 19.4637C15.4765 19.4637 15.0087 19.6537 14.3154 20.347C13.7251 20.9374 12.9337 22 12 22C11.0663 22 10.2749 20.9374 9.68457 20.347C8.99128 19.6537 8.52349 19.4637 7.55206 19.4637C6.76068 19.4637 5.63218 19.6175 5.00949 19C4.38181 18.3776 4.53628 17.2444 4.53628 16.4479C4.53628 15.4414 4.31616 14.9786 3.59938 14.2618C2.53314 13.1956 2.00002 12.6624 2 12C2.00001 11.3375 2.53312 10.8044 3.59935 9.73817C4.2392 9.09832 4.53628 8.46428 4.53628 7.55206C4.53628 6.76065 4.38249 5.63214 5 5.00944C5.62243 4.38178 6.7556 4.53626 7.55208 4.53626C8.46427 4.53626 9.09832 4.2392 9.73815 3.59937C10.8044 2.53312 11.3375 2 12 2C12.6625 2 13.1956 2.53312 14.2618 3.59937C14.9015 4.23907 15.5355 4.53626 16.4479 4.53626C17.2393 4.53626 18.3679 4.38247 18.9906 5C19.6182 5.62243 19.4637 6.75559 19.4637 7.55206C19.4637 8.55858 19.6839 9.02137 20.4006 9.73817C21.4669 10.8044 22 11.3375 22 12C22 12.6624 21.4669 13.1956 20.4006 14.2618C19.6838 14.9786 19.4637 15.4414 19.4637 16.4479C19.4637 17.2444 19.6182 18.3776 18.9905 19Z" stroke="currentColor" stroke-width="1.8" />
        <path d="M9 12.8929C9 12.8929 10.2 13.5447 10.8 14.5C10.8 14.5 12.6 10.75 15 9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      `;
    } else return '';
  }

  getActive = active => {
    if (active) {
      return /* html */`
        <span class="online-status">
          <span class="active"></span>
        </span>
        <span class="time online">online</span>
      `;
    } else {
      return /* html */`
        <span class="online-status">
          <span class="inactive"></span>
        </span>
        <span class="time offline">
          <span class="text">Seen</span>
          <span class="date">${this.date.message(this.getAttribute('last-active'))}</span>
        </span>
      `;
    }
  }

  getActions = () => {
    return /* html */`
      <button class="action video">
        <svg id="video" width="24" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M9.06137 5.10962C3.59137 5.10962 1.65137 7.05962 1.65137 12.5396C1.65137 18.0196 3.59137 19.9596 9.06137 19.9596C14.5214 19.9596 16.4514 18.0196 16.4514 12.5396C16.4514 7.05962 14.5214 5.10962 9.06137 5.10962Z" fill="currentColor"></path>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M22.1513 7.46967C21.3713 6.62967 18.9713 8.13967 17.6113 9.09967C17.8413 10.0897 17.9513 11.2397 17.9513 12.5397C17.9513 13.8297 17.8413 14.9597 17.6213 15.9497C18.7113 16.7197 20.4913 17.8497 21.5313 17.8497C21.7913 17.8497 22.0113 17.7797 22.1513 17.6197C23.0813 16.6297 23.0813 8.46967 22.1513 7.46967Z" fill="currentColor"></path>
        </svg>
        <span class="text">Meeting</span>
      </button>
      <button class="action search">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/message-search-01-bulk-rounded.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="currentColor">
          <path opacity="0.4" d="M12.1335 2.37231C12.5617 2.37553 12.7758 2.37714 12.8645 2.5048C12.9532 2.63246 12.8722 2.85524 12.7101 3.30081C12.4933 3.89668 12.375 4.53989 12.375 5.21071C12.375 8.29562 14.8758 10.7964 17.9607 10.7964C18.4468 10.7964 18.9194 10.734 19.3703 10.6167C19.5542 10.5688 19.6462 10.5449 19.7231 10.5657C19.8 10.5865 19.8623 10.6486 19.9869 10.7728L20.1101 10.8956C20.5895 11.3735 21.2143 11.6165 21.8416 11.6248C22.2477 11.6302 22.4507 11.6328 22.5371 11.7202C22.6235 11.8075 22.624 11.9692 22.6249 12.2926C22.6262 12.751 22.6123 13.2099 22.5832 13.6606C22.2853 18.2704 18.662 21.9567 14.0954 22.2602C12.6351 22.3573 11.1119 22.3571 9.65465 22.2602C9.08972 22.2227 8.47478 22.0891 7.93339 21.8661C7.84733 21.8307 7.77126 21.7994 7.70361 21.7718C7.56703 21.7161 7.49873 21.6883 7.42104 21.6979C7.34335 21.7076 7.28359 21.7515 7.16407 21.8394C7.13446 21.8612 7.10278 21.8845 7.0688 21.9096C6.27636 22.4939 5.27592 22.9039 3.85617 22.8693L3.81044 22.8682C3.53655 22.8617 3.24461 22.8547 3.00652 22.8086C2.71975 22.7531 2.36496 22.6145 2.14291 22.2359C1.90123 21.8238 1.99813 21.4071 2.09188 21.1447C2.18036 20.8971 2.33374 20.6066 2.49042 20.3098L2.5119 20.2691C2.97823 19.3854 3.10814 18.6633 2.85881 18.1818C2.02648 16.9254 1.27772 15.377 1.1668 13.6606C1.11107 12.7982 1.11107 11.9061 1.1668 11.0437C1.46472 6.43391 5.088 2.74762 9.65465 2.44406C10.4679 2.39001 11.3016 2.36605 12.1335 2.37231Z" fill="currentColor"></path>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.625 15.125C7.625 15.5392 7.96079 15.875 8.375 15.875H15.375C15.7892 15.875 16.125 15.5392 16.125 15.125C16.125 14.7108 15.7892 14.375 15.375 14.375H8.375C7.96079 14.375 7.625 14.7108 7.625 15.125ZM7.625 10.125C7.625 10.5392 7.96079 10.875 8.375 10.875H11.875C12.2892 10.875 12.625 10.5392 12.625 10.125C12.625 9.71079 12.2892 9.375 11.875 9.375H8.375C7.96079 9.375 7.625 9.71079 7.625 10.125Z" fill="currentColor"></path>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.875 5.21071C13.875 2.95424 15.7042 1.125 17.9607 1.125C20.2172 1.125 22.0464 2.95424 22.0464 5.21071C22.0464 5.97725 21.8353 6.69449 21.4681 7.30746L22.581 8.41676C22.9721 8.80666 22.9731 9.43982 22.5832 9.83097C22.1933 10.2221 21.5602 10.2231 21.169 9.83324L20.053 8.72078C19.441 9.08636 18.7254 9.29643 17.9607 9.29643C15.7042 9.29643 13.875 7.46719 13.875 5.21071ZM19.4332 6.68782C19.812 6.3102 20.0464 5.78783 20.0464 5.21071C20.0464 4.05881 19.1126 3.125 17.9607 3.125C16.8088 3.125 15.875 4.05881 15.875 5.21071C15.875 6.36262 16.8088 7.29643 17.9607 7.29643C18.5355 7.29643 19.056 7.06392 19.4332 6.68782Z" fill="currentColor"></path>
        </svg>
        <span class="text">Search</span>
      </button>
      <button class="action info">
        <svg id="info" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="Iconly/Bulk/Info-Circle" stroke="none" stroke-width="1.5" fill="none" fill-rule="evenodd">
                <path d="M21.9999,11.9998 C21.9999,17.5238 17.5229,21.9998 11.9999,21.9998 C6.4769,21.9998 1.9999,17.5238 1.9999,11.9998 C1.9999,6.4778 6.4769,1.9998 11.9999,1.9998 C17.5229,1.9998 21.9999,6.4778 21.9999,11.9998" id="Fill-1" fill="currentColor" fill-rule="nonzero" opacity="0.400000006"></path>
                <path d="M11.995,14.9285 C12.488,14.9285 12.88,15.3215 12.88,15.8035 C12.88,16.2855 12.488,16.6785 12.005,16.6785 C11.52,16.6785 11.125,16.2855 11.125,15.8035 C11.125,15.3215 11.516,14.9285 11.995,14.9285 Z M11.995,7.3357 C12.477,7.3357 12.87,7.7287 12.87,8.2107 L12.87,8.2107 L12.87,12.6307 C12.87,13.1127 12.477,13.5057 11.995,13.5057 C11.513,13.5057 11.12,13.1127 11.12,12.6307 L11.12,12.6307 L11.12,8.2107 C11.12,7.7287 11.513,7.3357 11.995,7.3357 Z" id="Combined-Shape" fill="currentColor" fill-rule="nonzero"></path>
            </g>
        </svg>
        <span class="text">Info</span>
      </button>
    `;
  }

  getMessages = () => {
    return /* html */`
      ${this.getDisclaimer()}
      <div is="message-item" class="message" user-name="Dr. Sarah Mwangi" user-picture="https://randomuser.me/api/portraits/women/45.jpg" datetime="2025-01-05T09:00:00Z"
        you="false" verified="true" status="seen" active="true" kind="message">
        Good morning.
      </div>
      <div is="message-item" class="message" user-name="James Ochieng" user-picture="https://randomuser.me/api/portraits/men/32.jpg" datetime="2025-01-05T09:03:00Z"
        you="true" verified="false" status="seen" active="false" kind="message">
        Hello Doctor. I've been experiencing persistent headaches for the past week, especially in the mornings. Also feeling quite fatigued lately.
      </div>
      <div is="message-item" class="message" user-name="Dr. Sarah Mwangi" user-picture="https://randomuser.me/api/portraits/women/45.jpg" datetime="2025-01-05T09:05:00Z"
        you="false" verified="true" status="delivered" active="true" kind="message">
        I understand your concern. Can you tell me more about the headaches? Are they throbbing, sharp, or dull? Any specific triggers you've noticed?
      </div>
      <div is="message-item" class="message" user-name="James Ochieng" user-picture="https://randomuser.me/api/portraits/men/32.jpg" datetime="2025-01-05T09:08:00Z"
        you="true" verified="false" status="seen" active="false" kind="message"
        images="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1470&auto=format&fit=crop, https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1470&auto=format&fit=crop">
        They're mostly dull but persistent. I've attached photos of my blood pressure readings from home - they seem higher than usual. Could this be related?
      </div>
      <div is="message-item" class="message" user-name="Dr. Sarah Mwangi" user-picture="https://randomuser.me/api/portraits/women/45.jpg" datetime="2025-01-05T09:12:00Z"
        you="false" verified="true" status="delivered" active="true" kind="reply" to-you="true" reply-to="James Ochieng" reply-text="They're mostly dull but persistent. I've attached photos of my blood pressure readings from home"
        reactions='{ "from": null, "to": "care" }'>
        Thank you for sharing those readings. Yes, elevated blood pressure can definitely cause morning headaches and fatigue. Have you been taking any medications or supplements recently?
      </div>
      <div is="message-item" class="message" user-name="James Ochieng" user-picture="https://randomuser.me/api/portraits/men/32.jpg" datetime="2025-01-05T09:15:00Z"
        you="true" verified="false" status="seen" active="false" kind="message">
        Just my usual multivitamin. No prescription medications. Should I be worried about these readings?
      </div>
      <div is="message-item" class="message" user-name="Dr. Sarah Mwangi" user-picture="https://randomuser.me/api/portraits/women/45.jpg" datetime="2025-01-05T09:18:00Z"
        you="false" verified="true" status="delivered" active="true" kind="message"
        attachments='[
          {
            "name": "Hypertension_Guidelines_Kenya.pdf",
            "size": "2.1MB",
            "type": "pdf",
            "link": "https://example.com/hypertension-guidelines.pdf"
          },
          {
            "name": "Lifestyle_Recommendations.pdf",
            "size": "1.8MB",
            "type": "pdf",
            "link": "https://example.com/lifestyle-recommendations.pdf"
          }
          ]'>
        Your readings are in the elevated range and need attention. I'm sending you some guidelines and lifestyle recommendations. We should schedule an in-person consultation within the next few days.
      </div>
      <div is="message-item" class="message" user-name="James Ochieng" user-picture="https://randomuser.me/api/portraits/men/32.jpg" datetime="2025-01-05T09:22:00Z"
        you="true" verified="false" status="delivered" active="false" kind="message">
        Thank you Doctor. Can I book an appointment through Diasync for this week? Also, any immediate steps I should take?
      </div>
      <div is="message-item" class="message" user-name="Dr. Sarah Mwangi" user-picture="https://randomuser.me/api/portraits/women/45.jpg" datetime="2025-01-05T09:25:00Z"
        you="false" verified="true" status="delivered" active="true" kind="message"
        reactions='{ "from": null, "to": "thumbs_up" }'>
        Absolutely, yes. Please book through the Diasync appointment system. Meanwhile: reduce salt intake, stay hydrated, get adequate sleep, and monitor your BP twice daily. Call emergency services if you experience severe headache, chest pain, or vision changes.
      </div>
      <div is="message-item" class="message" user-name="James Ochieng" user-picture="https://randomuser.me/api/portraits/men/32.jpg" datetime="2025-01-05T09:28:00Z"
        you="true" verified="false" status="sent" active="false" kind="reply" to-you="false" reply-to="Dr. Sarah" reply-text="reduce salt intake, stay hydrated, get adequate sleep, and monitor your BP twice daily"
        reactions='{ "from": "thumbs_up", "to": "care" }'>
        Perfect, I'll book the appointment right after this chat. Thank you for the quick response and guidance, Doctor. This gives me peace of mind.
      </div>
      <div is="message-item" class="message" user-name="Dr. Sarah Mwangi" user-picture="https://randomuser.me/api/portraits/women/45.jpg" datetime="2025-01-05T09:30:00Z"
        you="false" verified="true" status="seen" active="true" kind="message">
        You're very welcome! Early intervention is key. See you soon for the detailed consultation. Take care and don't hesitate to reach out if symptoms worsen.
      </div>
      ${this.getTyping()}
    `;
  }

  getDisclaimer = () => {
    return /* html */`
      <div class="disclaimer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
          <path d="M22 13.4908C21.7253 17.7331 18.3866 21.1124 14.1951 21.3904C12.7652 21.4853 11.2722 21.4851 9.84518 21.3904C9.35376 21.3578 8.81812 21.2408 8.3568 21.0512C7.84352 20.8402 7.58684 20.7347 7.45641 20.7507C7.32598 20.7667 7.13674 20.906 6.75825 21.1845C6.09091 21.6756 5.25021 22.0284 4.00346 21.9981C3.37302 21.9828 3.0578 21.9751 2.91669 21.735C2.77557 21.4949 2.95132 21.1625 3.30283 20.4977C3.79035 19.5757 4.09923 18.5202 3.63119 17.6745C2.82509 16.4665 2.14038 15.0359 2.04032 13.4908C1.98656 12.6606 1.98656 11.8008 2.04032 10.9706C2.31504 6.72826 5.65374 3.34901 9.84518 3.07095C10.7223 3.01277 11.6242 2.99027 12.5212 3.0036" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M8.5 14.9999H15.5M8.5 9.99988H12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M16.7374 5.17553L16.7374 3.78517C16.7374 3.5798 16.746 3.37188 16.8196 3.1801C17.0155 2.66962 17.5346 2.00085 18.4795 2.00085C19.4245 2.00085 19.9639 2.66962 20.1598 3.1801C20.2335 3.37188 20.242 3.5798 20.242 3.78517L20.242 5.17553M16.8069 10.9984H20.1929C21.1898 10.9984 21.9979 10.1918 21.9979 9.19686V7.19551C21.9979 6.20053 21.1898 5.39394 20.1929 5.39394H16.8069C15.8101 5.39394 15.002 6.20053 15.002 7.19551V9.19686C15.002 10.1918 15.8101 10.9984 16.8069 10.9984Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>Messages and calls are end-to-end encrypted.</span>
      </div>
    `;
  }

  getTyping = () => {
    return /* html */`
      <div class="typing-container">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    `;
  }

  getEditor = () => {
    return /* html */`
      <div class="editor" id="editor">
        <form class="form message-form">
          <div class="actions-container">
            <div class="actions">
              <button class="action attachment" title="Attachment" type="button">
                <svg id="small" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <defs>
                    <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#18a565" />
                      <stop offset="100%" style="stop-color:#21d029" />
                    </linearGradient>
                  </defs>
                  <path d="M9.14339 10.691L9.35031 10.4841C11.329 8.50532 14.5372 8.50532 16.5159 10.4841C18.4947 12.4628 18.4947 15.671 16.5159 17.6497L13.6497 20.5159C11.671 22.4947 8.46279 22.4947 6.48405 20.5159C4.50532 18.5372 4.50532 15.329 6.48405 13.3503L6.9484 12.886" stroke="url(#strokeGradient)" stroke-width="1.8" stroke-linecap="round" fill="none"/>
                  <path d="M17.0516 11.114L17.5159 10.6497C19.4947 8.67095 19.4947 5.46279 17.5159 3.48405C15.5372 1.50532 12.329 1.50532 10.3503 3.48405L7.48405 6.35031C5.50532 8.32904 5.50532 11.5372 7.48405 13.5159C9.46279 15.4947 12.671 15.4947 14.6497 13.5159L14.8566 13.309" stroke="url(#strokeGradient)" stroke-width="1.8" stroke-linecap="round" fill="none"/>
                </svg>
              </button>
              <button class="action image" title="Image" type="button">
                <svg id="small" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <defs>
                    <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#18a565" />
                      <stop offset="100%" style="stop-color:#21d029" />
                    </linearGradient>
                  </defs>
                  <circle cx="7.5" cy="7.5" r="1.5" stroke="url(#strokeGradient)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                  <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="url(#strokeGradient)" stroke-width="1.8" fill="none"/>
                  <path d="M5 21C9.37246 15.775 14.2741 8.88406 21.4975 13.5424" stroke="url(#strokeGradient)" stroke-width="1.8" fill="none"/>
                </svg>
              </button>
              <button class="action video" title="Video" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <defs>
                    <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#18a565" />
                      <stop offset="100%" style="stop-color:#21d029" />
                    </linearGradient>
                  </defs>
                  <path d="M11 8L13 8" stroke="url(#strokeGradient)" stroke-width="1.8" stroke-linecap="round" fill="none"/>
                  <path d="M2 11C2 7.70017 2 6.05025 3.02513 5.02513C4.05025 4 5.70017 4 9 4H10C13.2998 4 14.9497 4 15.9749 5.02513C17 6.05025 17 7.70017 17 11V13C17 16.2998 17 17.9497 15.9749 18.9749C14.9497 20 13.2998 20 10 20H9C5.70017 20 4.05025 20 3.02513 18.9749C2 17.9497 2 16.2998 2 13V11Z" stroke="url(#strokeGradient)" stroke-width="1.8" fill="none"/>
                  <path d="M17 8.90585L17.1259 8.80196C19.2417 7.05623 20.2996 6.18336 21.1498 6.60482C22 7.02628 22 8.42355 22 11.2181V12.7819C22 15.5765 22 16.9737 21.1498 17.3952C20.2996 17.8166 19.2417 16.9438 17.1259 15.198L17 15.0941" stroke="url(#strokeGradient)" stroke-width="1.8" stroke-linecap="round" fill="none"/>
                </svg>
              </button>
            </div>
            <div class="expand">
              <button class="action expand" title="Expand" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <defs>
                    <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#18a565" />
                      <stop offset="100%" style="stop-color:#21d029" />
                    </linearGradient>
                  </defs>
                  <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="url(#strokeGradient)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </svg>
              </button>
            </div>
          </div>
          <textarea name="message" id="message" cols="30" rows="1" placeholder="Message" required></textarea>
          <button type="submit" class="send" title="Send">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <defs>
                <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#18a565" />
                  <stop offset="100%" style="stop-color:#21d029" />
                </linearGradient>
              </defs>
              <path d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z" fill="url(#circleGradient)" />
              <path d="M16 12L12 16L8 12" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12 8V16" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    `;
  }

  getReply = ({ id: _id, user: replyUser, you: toYou, text: replyText }) => {
    // if both are null or empty, return nothing
    if (!replyText || replyText.trim() === '' || replyText.trim().length === 0) return '';

    let text = '';
    if (toYou) {
      text = 'Replying to yourself';
    } else {
      text = `Replying to ${replyUser}`;
    }

    return /* html */`
      <div class="reply">
        <span class="cancel" title="Cancel">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <div class="head">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
            <path d="M21.7109 9.3871C21.8404 9.895 21.9249 10.4215 21.9598 10.9621C22.0134 11.7929 22.0134 12.6533 21.9598 13.4842C21.6856 17.7299 18.3536 21.1118 14.1706 21.3901C12.7435 21.485 11.2536 21.4848 9.8294 21.3901C9.33896 21.3574 8.8044 21.2403 8.34401 21.0505C7.83177 20.8394 7.5756 20.7338 7.44544 20.7498C7.31527 20.7659 7.1264 20.9052 6.74868 21.184C6.08268 21.6755 5.24367 22.0285 3.99943 21.9982C3.37026 21.9829 3.05568 21.9752 2.91484 21.7349C2.77401 21.4946 2.94941 21.1619 3.30021 20.4966C3.78674 19.5739 4.09501 18.5176 3.62791 17.6712C2.82343 16.4623 2.1401 15.0305 2.04024 13.4842C1.98659 12.6533 1.98659 11.7929 2.04024 10.9621C2.31441 6.71638 5.64639 3.33448 9.8294 3.05621C10.2156 3.03051 10.6067 3.01177 11 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8.5 15H15.5M8.5 10H12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M14 4.5L22 4.5M14 4.5C14 3.79977 15.9943 2.49153 16.5 2M14 4.5C14 5.20023 15.9943 6.50847 16.5 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text">${text}</span>
        </div>
        <div class="summary">
          ${replyText}
        </div>
      </div>
    `;
  }

  getImagesEditor = () => {
    return /* html */`
      <div is="chat-images" class="images" id="images" url="/s/add"></div>
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
          justify-content: space-between;
          gap: 0;
        }

        * {
          box-sizing: border-box;
          font-family: var(--font-main), sans-serif;
        }

        header.header {
          box-sizing: border-box;
          border-bottom: var(--border);
          background: var(--background);
          padding: 15px 0 10px 25px;
          height: 70px;
          max-height: 70px;
          display: flex;
          flex-flow: column;
          align-items: start;
          flex-wrap: nowrap;
          gap: 5px;
          margin: 0;
          z-index: 6;
          width: 100%;
          position: sticky;
          top: 0;
        }

        header.header > svg {
          position: absolute;
          display: inline-block;
          left: -12px;
          margin: 2px 0 0;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-color);
          cursor: pointer;
          width: 40px;
          height: 40px;
          justify-content: center;
          align-items: center;
        }

        header.header > svg:hover {
          color: var(--accent-color);
        }

        header.header > .contents {
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
          flex-wrap: nowrap;
          gap: 10px;
          margin: 0;
          width: 100%;
          position: relative;
        }

        header.header > .contents > .profile {
          width: calc(100% - 120px);
          min-width: calc(100% - 120px);
          max-width: calc(100% - 120px);
          display: flex;
          flex-flow: row;
          align-items: center;
          flex-wrap: nowrap;
          gap: 10px;
        }

        header.header > .contents > .profile > .avatar {
          border: var(--border);
          width: 40px;
          height: 40px;
          max-width: 40px;
          max-height: 40px;
          min-width: 40px;
          min-height: 40px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        header.header > .contents > .profile > .avatar > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        header.header > .contents > .profile > .avatar > svg {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80%;
          height: 80%;
          fill: var(--gray-color);
        }

        header.header > .contents > .profile > .info {
          width: calc(100% - 50px);
          min-width: calc(100% - 50px);
          max-width: calc(100% - 50px);
          display: flex;
          flex-flow: column;
          align-items: start;
          flex-wrap: nowrap;
          gap: 0;
        }

        header.header > .contents > .profile > .info > .name {
          font-family: var(--font-main), sans-serif;
          width: 100%;
          min-width: 100%;
          max-width: 100%;
          font-family: var(--font-text), sans-serif;
          font-weight: 500;
          font-size: 1rem;
          line-height: 1.4;
          color: var(--text-color);
          display: flex;
          justify-content: start;
          align-items: center;
          gap: 2px;
        }

        header.header > .contents > .profile > .info > .name > .text {
          width: max-content;
          max-width: calc(100% - 28px);
          text-align: start;
          gap: 5px;

          /** add ellipsis */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        header.header > .contents > .profile > .info > .name > svg {
          width: 18px;
          height: 18px;
          margin-bottom: 0px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: var(--white-color);
          fill: var(--accent-color);
        }

        header.header > .contents > .profile > .info > .name > svg > path#outer {
          stroke: var(--accent-color);
          color: var(--accent-color);
        }

        header.header > .contents > .profile > .info > .active {
          display: flex;
          justify-content: start;
          align-items: center;
          gap: 5px;
        }

        header.header > .contents > .profile > .info > .active > .online-status {
          border: var(--border);
          display: flex;
          background: var(--background);
          justify-content: center;
          align-items: center;
          text-align: center;
          height: 14px;
          width: 14px;
          min-width: 14px;
          min-height: 14px;
          max-width: 14px;
          max-height: 14px;
          border-radius: 50%;
          padding: 3px;
          margin-bottom: -1px;
        }

        header.header > .contents > .profile > .info > .active > .online-status > .active {
          width: 8px;
          height: 8px;
          max-width: 8px;
          max-height: 8px;
          min-width: 8px;
          min-height: 8px;
          border-radius: 50%;
          background: var(--accent-linear);
        }

        header.header > .contents > .profile > .info > .active > .online-status > .inactive {
          width: 8px;
          height: 8px;
          max-width: 8px;
          max-height: 8px;
          min-width: 8px;
          min-height: 8px;
          border-radius: 50%;
          background: var(--gray-color);
        }

        header.header > .contents > .profile > .info > .active > .time {
          font-family: var(--font-read), sans-serif;
          font-weight: 500;
          font-size: 0.85rem;
          text-transform: uppercase;
          color: var(--gray-color);
        }

        header.header > .contents > .profile > .info > .active > .time.online {
          color: var(--accent-color);
          text-transform: capitalize;
          font-family: var(--font-text), sans-serif;
        }

        header.header > .contents > .profile > .info > .active > .time.offline {
          display: flex;
          justify-content: start;
          align-items: center;
          gap: 5px;
        }

        header.header > .contents > .profile > .info > .active > .time.offline > .text {
          display: none;
          justify-content: start;
          align-items: center;
          font-family: var(--font-text), sans-serif;
          gap: 5px;
          text-transform: capitalize;
        }

        header.header > .contents > .profile > .info > .active > .time.offline > .date {
          font-family: var(--font-text), sans-serif;
          font-weight: 400;
          font-size: 0.85rem;
          color: var(--gray-color);
        }

        header.header > .contents > .actions {
          /* border: var(--border);*/
          width: 100px;
          min-width: 100px;
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: end;
          flex-wrap: nowrap;
          gap: 12px;
        }

        header.header > .contents > .actions > button {
          border: none;
          position: relative;
          display: flex;
          background: var(--background);
          justify-content: center;
          align-items: center;
          padding: 0;
          cursor: pointer;
          color: var(--gray-color);
        }

        header.header > .contents > .actions > button:hover {
          color: var(--accent-color);
        }

        header.header > .contents > .actions > button > svg {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 24px;
          height: 24px;
          color: var(--accent-color);
        }

        header.header > .contents > .actions > button > svg#video {
          width: 30px;
          height: 30px;
        }

        header.header > .contents > .actions > button > svg#info {
          width: 28px;
          height: 28px;
        }

        header.header > .contents > .actions > button > span.text {
          display: none;
          position: absolute;
          bottom: -38px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--background);
          color: var(--text-color);
          padding: 6px 10px;
          border-radius: 12px;
          font-family: var(--font-text), sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          white-space: nowrap;
          z-index: 1000;
          border: var(--border);
          box-shadow: var(--card-box-shadow);
          pointer-events: none;
        }

        header.header > .contents > .actions > button > span.text::before {
          content: '';
          position: absolute;
          top: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 10px;
          height: 10px;
          rotate: 45deg;
          background: var(--background);
          border-top: var(--border);
          border-left: var(--border);
        }

        header.header > .contents > .actions > button:hover > span.text {
          display: block;
          animation: fadeInTooltip 0.2s ease-in-out;
        }

        @keyframes fadeInTooltip {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        main.main {
          /* border: 2px solid red; */
          display: flex;
          flex-flow: column;
          align-items: start;
          justify-content: space-between;
          gap: 0;
          padding: 0;
          height: calc(100dvh - 70px);
          min-height: calc(100vh - 70px);
          max-height: calc(100vh - 70px);
          width: 100%;
          overflow-y: scroll;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        main.main::-webkit-scrollbar {
          display: none;
          visibility: hidden;
        }

        main.main > .messages {
          display: flex;
          flex-flow: column;
          align-items: start;
          justify-content: start;
          width: 100%;
          max-width: 100%;
          min-width: 100%;
          gap: 10px;
          padding: 10px 0 30px;
          background-image: var(--chat-container);
          background-size: 50px 50px, 30px 30px, 30px 30px;
        }

        main.main > .messages > div.disclaimer {
          display: inline-block;
          gap: 5px;
          width: 70%;
          align-self: center;
          padding: 5px 10px;
          background: var(--background);
          color: var(--gray-color);
          font-size: 0.9rem;
          font-weight: 400;
          font-family: var(--font-read), sans-serif;
          text-align: center;
          margin: 0 0 10px;
        }

        main.main > .messages > div.disclaimer > svg {
          width: 16px;
          height: 16px;
          color: var(--accent-color);
          display: inline-block;
          margin-bottom: -2px;
        }

        .typing-container {
          align-items: center;
          display: flex;
          justify-content: center;
          gap: 0.25rem;
          width: max-content;
          /*background: rgb(226 232 240);*/
          border-radius: 15px;
          padding: 7px 20px;
          margin: 5px 0 20px;
        }

        .typing-container .dot {
          border-radius: 50%;
          height: 8px;
          width: 8px;
          background: var(--typing-color);
          opacity: 0;
          animation: blink 1s infinite;
        }
        .typing-container .dot:nth-child(1) {
          animation-delay: 0.3333s;
        }
        .typing-container .dot:nth-child(2) {
          animation-delay: 0.6666s;
        }
        .typing-container .dot:nth-child(3) {
          animation-delay: 0.9999s;
        }
      
        @keyframes blink {
          50% {
            opacity: 1;
          }
        }

        /* editor */
        div.editor#editor {
          /* border: 1px solid red; */
          display: flex;
          flex-flow: column;
          align-items: start;
          justify-content: end;
          position: sticky;
          bottom: 0;
          z-index: 5;
          gap: 0;
          width: 100%;
          margin: 0;
          padding: 5px 0;
          background: var(--background);
        }

        div.editor#editor > .reply {
          z-index: 0;
          padding: 0;
          border-radius: 15px;
          margin: 5px 0 0 0;
          width: max-content;
          display: flex;
          max-width: 100%;
          flex-direction: column;
          gap: 4px;
          left: 10px;
          width: calc(100% - 10px);
          margin-bottom: -20px;
          position: relative;
        }

        div.editor#editor > .reply > .cancel {
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          cursor: pointer;
          z-index: 1;
          top: 2px;
          right: 5px;
        }

        div.editor#editor > .reply > .cancel > svg {
          width: 16px;
          height: 16px;
          color: var(--error-color);
        }

        div.editor#editor > .reply > .head {
          display: flex;
          align-items: center;
          gap: 5px;
          opacity: 0.8;
          color: var(--gray-color);
          font-family: var(--font-read), sans-serif;
        }

        div.editor#editor > .reply > .head > svg {
          width: 16px;
          height: 16px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }

        div.editor#editor > .reply > .head > .text {
          font-size: 0.95rem;
          font-weight: 400;
          font-family: inherit;
        }

        .reply > .summary {
          font-size: 0.9rem;
          font-weight: 400;
          width: max-content;
          max-width: 100%;
          background: var(--reply-background);
          padding: 8px 10px 25px;
          font-family: inherit;
          color: var(--gray-color);
          border-radius: 15px;
          /* add ellipsis to the text */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        div.editor#editor > form.message-form {
          display: flex;
          flex-flow: row;
          align-items: flex-end;
          justify-content: space-between;
          background: var(--background);
          z-index: 1;
          gap: 0;
          padding: 0;
          margin: 0;
          width: 100%;
        }

        div.editor#editor > form.message-form > div.actions-container {
          /* border: 1px solid red; */
          padding: 0 0 2px;
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: center;
          gap: 0;
          width: max-content;
        }

        div.editor#editor > form.message-form > div.actions-container > div.actions {
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: start;
          width: 100px;
          margin: 0 3px 0 0;
          overflow: hidden;
          gap: 5px;
        }

        div.editor#editor > form.message-form > div.actions-container > div.actions > button {
          border: none;
          display: flex;
          background: var(--background);
          justify-content: center;
          align-items: center;
          padding: 0;
          cursor: pointer;
          width: 30px;
          height: 30px;
          color: var(--gray-color);
        }

        div.actions-container > div.actions > button > svg {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 23px;
          height: 23px;
          color: var(--accent-color);
        }

        div.actions-container > div.actions > button > svg.small {
          width: 20px;
          height: 22px;
        }

        div.actions-container > div.expand  {
          display: none;
          justify-content: center;
          align-items: center;
          width: 25px;
          max-width: 25px;
          height: 25px;
          min-width: 25px;
          margin: 0;
          max-height: 25px;
        }

        div.actions-container > div.expand > button {
          border: none;
          display: flex;
          background: transparent;
          justify-content: center;
          align-items: center;
          padding: 0;
          cursor: pointer;
          color: var(--gray-color);
        }

        div.actions-container > div.expand > button > svg {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 24px;
          height: 24px;
          color: var(--accent-color);
        }

        div.editor#editor > form.message-form > textarea {
          border: var(--input-border);
          font-family: var(--font-main), sans-serif;
          background: var(--background);
          font-size: 1rem;
          padding: 5px 10px;
          outline: none;
          margin: 0;
          width: calc(100% - 140px);
          /*min-width: calc(100% - 140px);
          max-width: calc(100% - 140px);*/
          resize: none;
          height: auto;
          line-height: 1.5;
          scroll-padding-top: 7px;
          scroll-padding-bottom: 7px;
          transition: linear 0.2s;
          gap: 5px;
          font-weight: 400;
          color: var(--text-color);
          scrollbar-width: 3px;
          border-radius: 15px;
        }

        div.editor#editor > form.message-form > textarea.one-line {
          width: calc(100% - 170px);

          /* hide overflow */
          overflow: hidden;
        }

        div.editor#editor > form.message-form > textarea::placeholder {
          color: var(--gray-color);
          font-weight: 400;
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
        }

        div.editor#editor > form.message-form > textarea::-webkit-scrollbar {
          width: 3px;
          -webkit-appearance: auto;
        }

        div.editor#editor > form.message-form > textarea:focus {
          border: var(--input-border-focus);
        }

        div.editor#editor > form.message-form > button.send {
          border: none;
          display: flex;
          background: var(--background);
          justify-content: center;
          align-items: center;
          padding: 0;
          cursor: pointer;
          width: 40px;
          height: 40px;
          color: var(--gray-color);
        }

        div.editor#editor > form.message-form > button.send > svg {
          display: flex;
          justify-content: end;
          align-items: flex-end;
          margin-bottom: -4px;
          width: 34px;
          height: 34px;
          fill: var(--accent-color);
          color: var(--accent-color);
          rotate: 180deg;
        }

        div.editor#editor > form.message-form > button.send > svg > path#outer  {
          /*fill: var(--white-color);
          color: var(--white-color);*/
          stroke: var(--white-color);
        }

        @keyframes show-actions {
          from {
            width: 0;
            opacity: 0;
            visibility: hidden;
          }
          to {
            width: 100px;
            opacity: 1;
            visibility: visible;
          }
        }
        
        @keyframes hide-actions {
          from {
            width: 100px;
            opacity: 1;
            visibility: visible;
          }
          to {
            width: 0;
            opacity: 0;
            visibility: hidden;
          }
        }
        
        @keyframes show-expand {
          from {
            width: 0;
            opacity: 0;
            visibility: hidden;
            transform: translateX(-10px);
          }
          to {
            width: calc(100% - 90px);
            opacity: 1;
            visibility: visible;
            transform: translateX(0);
          }
        }
        
        @keyframes hide-expand {
          from {
            width: calc(100% - 90px);
            opacity: 1;
            visibility: visible;
            transform: translateX(0);
          }
          to {
            width: 0;
            opacity: 0;
            visibility: hidden;
            transform: translateX(-10px);
          }
        }

        @media screen and (max-width: 768px) {
          header.header > svg {
            position: absolute;
            left: -15px;
            margin: 2px 0 0;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-color);
            cursor: default !important;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
  
          header.header > svg:hover {
            color: var(--accent-color);
          }
  
          header.header > .contents {
            display: flex;
            flex-flow: row;
            align-items: center;
            justify-content: space-between;
            flex-wrap: nowrap;
            gap: 10px;
            margin: 0 0 0 20px;
            width: calc(100% - 20px);
            position: relative;
          }
        }
       
        @media screen and (max-width: 660px) {
          :host {
            /* border: 2px solid green; */
            height: unset;
            max-height: unset;
            min-height: unset;
            width: 100%;
            min-width: 100%;
            max-width: 100%;
          }

          /* reset all cursor: pointer to cursor: default */
          a, button, input, label, select, textarea,
          ul.tabs > li.tab, ul.tabs > li.tab.active,
          div.editor#editor > .reply > .cancel {
            cursor: default !important;
          }

          header.header {
            border-bottom: var(--border);
            background: var(--background);
            padding: 0;
            padding: 10px 0 10px;
            display: flex;
            flex-flow: column;
            align-items: start;
            flex-wrap: nowrap;
            height: 60px;
            max-height: 60px;
            gap: 5px;
            margin: 0;
            z-index: 6;
            width: 100%;
            position: sticky;
            top: 0;
          }

          main.main {
            /* border: 2px solid blue; */
            max-height: calc(100dvh - 60px);
            height: calc(100dvh - 60px);
            min-height: calc(100dvh - 60px);
            width: 100%;
          }

          main.main > .messages {
            padding: 10px 0 0;
            /* border: 2px solid red; */
            width: 100%;
            height: max-content;
          }

          main.main > .messages > div.disclaimer {
            width: 100%;
            font-size: 0.8rem;
          }

          main.main > .messages > div.disclaimer > svg {
            width: 14px;
            height: 14px;
            margin-bottom: -2.5px;
          }
        }
      </style>
    `;
  }
}