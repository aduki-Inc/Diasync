export default class Header extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.user = this.getUserData();
    this.render();
  }

  // if attribute values changes edit the header
  static get observedAttributes() {
    return ['section-title', 'description'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'section-title' || name === 'description') {
      const header = this.shadow.querySelector('header');
      if (header) {
        header.querySelector('.title').textContent = this.getAttribute('section-title') || 'Kuluhiro';
        header.querySelector('.subtitle').textContent = this.getAttribute('description') || 'Welcome to Kuluhiro';
      }
    }
  }

  render() {
    this.shadow.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    this.setupEventListeners();
    this.initTheme();
  }

  setupEventListeners() {
    const themeButton = this.shadow.querySelector('.link.theme');
    if (themeButton) {
      themeButton.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }

  initTheme() {
    // Get saved theme from localStorage, default to light
    const savedTheme = localStorage.getItem('user-theme') || 'light';

    // Update the icon to match the theme
    const isDark = savedTheme === 'dark';
    this.updateThemeIcon(isDark);
  }

  toggleTheme() {
    const switcher = this.shadow.querySelector('.theme-switcher');
    const isDark = switcher.classList.contains('dark');

    if (isDark) {
      switcher.classList.remove('dark');
      localStorage.setItem('user-theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      switcher.classList.add('dark');
      localStorage.setItem('user-theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  updateThemeIcon(isDark) {
    const switcher = this.shadow.querySelector('.theme-switcher');
    if (switcher) {
      if (isDark) {
        switcher.classList.add('dark');
      } else {
        switcher.classList.remove('dark');
      }
    }
  }

  // get user data from local storage
  getUserData() {
    try {
      const userData = window.sessionStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error retrieving user data from sessionStorage:', error);
      return null;
    }
  }

  getTemplate() {
    return /* html */`
      ${this.getHeader()}
      ${this.getStyles()}
    `;
  }

  getHeader = () => {
    return /* html */`
      <header class="header">
        <div class="header-title">
          <h1 class="title">${this.getAttribute('section-title')}</h1>
          <span class="subtitle">${this.getAttribute('description')}</span>
        </div>
        <ul class="links">
          <li class="link cart">
            <svg id="other" width="24" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M7.43787 7.4209C7.44386 4.91878 9.47628 2.8949 11.9793 2.8997C14.4811 2.90569 16.5052 4.93856 16.4999 7.44022C16.4999 7.44065 16.4999 7.44107 16.4999 7.44149L15.7499 7.4397L16.4999 7.44022V10.4717C16.4999 10.8859 16.1641 11.2217 15.7499 11.2217C15.3357 11.2217 14.9999 10.8859 14.9999 10.4717V7.4397L14.9999 7.4379C15.0039 5.76426 13.6501 4.4039 11.9764 4.39969C10.3019 4.39668 8.94233 5.75028 8.93787 7.42364V10.4717C8.93787 10.8859 8.60208 11.2217 8.18787 11.2217C7.77365 11.2217 7.43787 10.8859 7.43787 10.4717L7.43787 7.4209Z" fill="currentColor"></path>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M5.38521 10.2834C4.24823 11.1733 3.69995 12.6443 3.69995 15.2075C3.69995 17.7702 4.2482 19.2409 5.38518 20.1307C6.57922 21.0652 8.60338 21.5155 11.969 21.5155C15.3345 21.5155 17.3587 21.0652 18.5527 20.1307C19.6897 19.2409 20.238 17.7702 20.238 15.2075C20.238 12.6443 19.6897 11.1733 18.5527 10.2834C17.3587 9.34881 15.3345 8.8985 11.969 8.8985C8.60338 8.8985 6.57924 9.34881 5.38521 10.2834ZM4.46069 9.10214C6.08517 7.83069 8.57053 7.3985 11.969 7.3985C15.3674 7.3985 17.8527 7.83069 19.4772 9.10214C21.1587 10.4182 21.738 12.4767 21.738 15.2075C21.738 17.9378 21.1587 19.996 19.4772 21.312C17.8527 22.5833 15.3674 23.0155 11.969 23.0155C8.57052 23.0155 6.08519 22.5833 4.46072 21.312C2.7792 19.996 2.19995 17.9378 2.19995 15.2075C2.19995 12.4767 2.77918 10.4182 4.46069 9.10214Z" fill="currentColor"></path>
            </svg>
            <span class="text">Cart</span>
          </li>
          <li class="link updates">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none">
              <path id="animate" d="M22 5.5C22 7.433 20.433 9 18.5 9C16.567 9 15 7.433 15 5.5C15 3.567 16.567 2 18.5 2C20.433 2 22 3.567 22 5.5Z" stroke="currentColor" stroke-width="1.8" />
              <path d="M21.9506 11C21.9833 11.3289 22 11.6625 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C12.3375 2 12.6711 2.01672 13 2.04938" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M8 10H12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8 15H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="text">Updates</span>
          </li>
          <!--<li class="link theme">
            <div class="theme-switcher">
              <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
              <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M21.5 14.0784C20.3003 14.7189 18.9301 15.0821 17.4751 15.0821C12.7491 15.0821 8.91792 11.2509 8.91792 6.52485C8.91792 5.06986 9.28105 3.69968 9.92163 2.5C5.66765 3.49698 2.5 7.31513 2.5 11.8731C2.5 17.1899 6.8101 21.5 12.1269 21.5C16.6849 21.5 20.503 18.3324 21.5 14.0784Z"/>
              </svg>
            </div>
            <span class="text">Theme</span>
          </li>-->
          <li class="link settings">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M16.3083 4.38394C15.7173 4.38394 15.4217 4.38394 15.1525 4.28405C15.1151 4.27017 15.0783 4.25491 15.042 4.23828C14.781 4.11855 14.5721 3.90959 14.1541 3.49167C13.1922 2.52977 12.7113 2.04882 12.1195 2.00447C12.04 1.99851 11.96 1.99851 11.8805 2.00447C11.2887 2.04882 10.8077 2.52977 9.84585 3.49166C9.42793 3.90959 9.21897 4.11855 8.95797 4.23828C8.92172 4.25491 8.88486 4.27017 8.84747 4.28405C8.57825 4.38394 8.28273 4.38394 7.69171 4.38394H7.58269C6.07478 4.38394 5.32083 4.38394 4.85239 4.85239C4.38394 5.32083 4.38394 6.07478 4.38394 7.58269V7.69171C4.38394 8.28273 4.38394 8.57825 4.28405 8.84747C4.27017 8.88486 4.25491 8.92172 4.23828 8.95797C4.11855 9.21897 3.90959 9.42793 3.49166 9.84585C2.52977 10.8077 2.04882 11.2887 2.00447 11.8805C1.99851 11.96 1.99851 12.04 2.00447 12.1195C2.04882 12.7113 2.52977 13.1922 3.49166 14.1541C3.90959 14.5721 4.11855 14.781 4.23828 15.042C4.25491 15.0783 4.27017 15.1151 4.28405 15.1525C4.38394 15.4217 4.38394 15.7173 4.38394 16.3083V16.4173C4.38394 17.9252 4.38394 18.6792 4.85239 19.1476C5.32083 19.6161 6.07478 19.6161 7.58269 19.6161H7.69171C8.28273 19.6161 8.57825 19.6161 8.84747 19.716C8.88486 19.7298 8.92172 19.7451 8.95797 19.7617C9.21897 19.8815 9.42793 20.0904 9.84585 20.5083C10.8077 21.4702 11.2887 21.9512 11.8805 21.9955C11.96 22.0015 12.0399 22.0015 12.1195 21.9955C12.7113 21.9512 13.1922 21.4702 14.1541 20.5083C14.5721 20.0904 14.781 19.8815 15.042 19.7617C15.0783 19.7451 15.1151 19.7298 15.1525 19.716C15.4217 19.6161 15.7173 19.6161 16.3083 19.6161H16.4173C17.9252 19.6161 18.6792 19.6161 19.1476 19.1476C19.6161 18.6792 19.6161 17.9252 19.6161 16.4173V16.3083C19.6161 15.7173 19.6161 15.4217 19.716 15.1525C19.7298 15.1151 19.7451 15.0783 19.7617 15.042C19.8815 14.781 20.0904 14.5721 20.5083 14.1541C21.4702 13.1922 21.9512 12.7113 21.9955 12.1195C22.0015 12.0399 22.0015 11.96 21.9955 11.8805C21.9512 11.2887 21.4702 10.8077 20.5083 9.84585C20.0904 9.42793 19.8815 9.21897 19.7617 8.95797C19.7451 8.92172 19.7298 8.88486 19.716 8.84747C19.6161 8.57825 19.6161 8.28273 19.6161 7.69171V7.58269C19.6161 6.07478 19.6161 5.32083 19.1476 4.85239C18.6792 4.38394 17.9252 4.38394 16.4173 4.38394H16.3083Z" stroke="currentColor" stroke-width="1.8"></path>
              <path d="M15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12Z" stroke="currentColor" stroke-width="1.8"></path>
            </svg>
            <span class="text">Settings</span>
          </li>
          <!--<li class="link profile">
            <div class="image">
              ${this.getPicture(this.user?.picture)}
            </div>
            <span class="text">Profile</span>
          </li>
           <li class="link more">
            <span class="icon">
              <span class="sp"></span>
              <span class="sp"></span>
            </span>
            <span class="text">More</span>
          </li>
          <li class="link theme">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
              <path d="M21.5 14.0784C20.3003 14.7189 18.9301 15.0821 17.4751 15.0821C12.7491 15.0821 8.91792 11.2509 8.91792 6.52485C8.91792 5.06986 9.28105 3.69968 9.92163 2.5C5.66765 3.49698 2.5 7.31513 2.5 11.8731C2.5 17.1899 6.8101 21.5 12.1269 21.5C16.6849 21.5 20.503 18.3324 21.5 14.0784Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
            <span class="text">Theme</span>
          </li>-->
        </ul>
      </header>
    `
  }

  getPicture = url => {
    if (!this.user || !this.user.picture) {
      return /* html */`
        <img src="https://randomuser.me/api/portraits/men/41.jpg" alt="Default Profile Picture" />
      `;
    }
    return /* html */`
      <img src="${url}" alt="User Profile Picture" />
    `;
  }

  getStyles = () => {
    return /* css */`
      <style>
        :host {
          display: flex;
          max-width: 100%;
          width: 100%;
          display: flex;
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          padding: 0 10px;
          background: var(--background);
          z-index: 50;
        }

        * {
          box-sizing: border-box;
          font-family: var(--font-main), sans-serif;
        }

        /* Header Styles */
        header.header {
          height: 60px;
          max-height: 60px;
          width: 100%;
          border-bottom: var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 5px 0;
          backdrop-filter: blur(10px);
        }

        header.header > div.header-title {
          flex: 1;
          width: calc(100% - 250px);
          display: flex;
          flex-direction: column;
          padding: 0;
          transition: all 0.3s ease;
        }

        header.header > div.header-title > h1.title {
          font-family: var(--font-main), sans-serif;
          font-size: 1.35rem;
          font-weight: 700;
          line-height: 1.4;
          color: var(--text-color);
          margin: 0;
          padding: 0;
          text-transform: capitalize;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        header.header > div.header-title > span.subtitle {
          font-family: var(--font-read), sans-serif;
          font-size: 0.8rem;
          font-weight: 400;
          line-height: 1;
          color: var(--gray-color);
          margin: 0;
          padding: 0;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        header.header > ul.links {
          display: flex;
          align-items: center;
          gap: 15px;
          margin: 5px 0 0;
          padding: 0;
          list-style: none;
        }

        header.header > ul.links > li.link {
          background: var(--gray-background);
          display: flex;
          align-items: center;
          gap: 8px;
          width: 36px;
          height: 36px;
          max-width: 36px;
          max-height: 36px;
          padding: 0;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: var(--text-color);
          position: relative;
        }

        header.header > ul.links > li.link:hover {
          color: var(--accent-color);
        }

        header.header > ul.links > li.link.profile > div.image {
          width: 36px;
          height: 36px;
          max-height: 36px;
          max-width: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        header.header > ul.links > li.link.profile > div.image > img {
          width: 32px;
          height: 32px;
          max-height: 32px;
          max-width: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        header.header > ul.links > li.link > span.text {
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

        header.header > ul.links > li.link > span.text::before {
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

        /*header.header > ul.links > li.link:hover > span.text {
          display: block;
          animation: fadeInTooltip 0.2s ease-in-out;
        }*/

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

        header.header > ul.links > li.link.updates {
          position: relative;
        }

        /* Animate the updates notification circle */
        header.header > ul.links > li.link.updates svg path#animate {
          animation: updatesPulse 2s ease-in-out infinite;
          transform-origin: center;
          z-index: 1;
          color: var(--error-color);
        }

        @keyframes updatesPulse {
          0%, 100% {
            transform: scale(0.9);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.7;
          }
        }

        /* Alternative breathing animation for the updates icon */
        header.header > ul.links > li.link.updates:hover svg path#animate {
          animation: updatesBreath 1.8s ease-in-out infinite;
          z-index: 1;
          background: var(--error-background);
        }

        @keyframes updatesBreath {
          0%, 100% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }

        header.header > ul.links > li.link > svg {
          width: 24px;
          height: 24px;
          color: inherit;
        }

        header.header > ul.links > li.link.cart > svg {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 3px;
          color: inherit;
        }

        /* Theme Switcher Styles */
        .theme-switcher {
          position: relative;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .theme-switcher svg {
          position: absolute;
          width: 24px;
          height: 24px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }

        /* Light mode - show sun */
        .theme-switcher .sun-icon {
          opacity: 1;
          transform: scale(1) rotate(0deg);
          color: var(--text-color);
        }

        .theme-switcher .moon-icon {
          opacity: 0;
          transform: scale(0.8) rotate(180deg);
          color: var(--text-color);
        }

        /* Dark mode - show moon */
        .theme-switcher.dark .sun-icon {
          opacity: 0;
          transform: scale(0.8) rotate(-180deg);
        }

        .theme-switcher.dark .moon-icon {
          opacity: 1;
          transform: scale(1) rotate(0deg);
          color: var(--text-color);
        }

        /* Hover effects */
        header.header > ul.links > li.link.theme:hover .theme-switcher svg {
          transform: scale(1.1) rotate(0deg);
        }

        header.header > ul.links > li.link.theme:hover .theme-switcher.dark svg {
          transform: scale(1.1) rotate(0deg);
        }

        header.header > ul.links > li.link.more > span.icon {
          display: flex;
          gap: 5px;
          align-items: center;
          justify-content: center;
        }

        header.header > ul.links > li.link.more > span.icon > span.sp {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: var(--text-color);
          color: inherit;
          border-radius: 50%;
        }
      </style>
    `;
  }
}