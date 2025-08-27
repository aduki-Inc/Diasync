export default class Sidebar extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.mql = window.matchMedia('(max-width: 700px)');
    this.user = this.getUserData();
    this.render();
  }

  render() {
    this.shadow.innerHTML = this.getTemplate();
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

  connectedCallback() {
    this.watchMql();
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

  watchMql() {
    this.mql.addEventListener('change', () => {
      this.render();
    });
  }

  getTemplate() {
    return /* html */`
      ${this.getHeader()}
      <div class="content-wrapper">
        <chats-section all="628" unread="3" requests="2"></chats-section>
      </div>
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
            <svg id="Bag" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.3638 6.86985C16.3638 4.48385 14.4298 2.54985 12.0438 2.54985C9.65783 2.53885 7.71583 4.46485 7.70483 6.85085V6.86985" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M14.9727 11.3738H14.9267" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M9.14153 11.3738H9.09553" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0342 21.4894C5.52619 21.4894 4.77719 19.4394 3.31619 14.0224C1.85019 8.58842 4.79119 6.55542 12.0342 6.55542C19.2772 6.55542 22.2182 8.58842 20.7522 14.0224C19.2912 19.4394 18.5422 21.4894 12.0342 21.4894Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <span class="text">Cart</span>
          </li>
          <li class="link theme">
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
          <li class="link profile">
            <div class="image">
              ${this.getPicture(this.user?.picture)}
            </div>
            <span class="text">Profile</span>
          </li>
        </ul>
      </header>
    `
  }

  getPicture = url => {
    if (!this.user || !this.user.picture) {
      return /* html */`
        <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Default Profile Picture" />
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
          height: 100dvh;
          max-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: start;
          padding: 0 10px;
          gap: 0;
        }

        * {
          box-sizing: border-box;
          font-family: var(--font-main), sans-serif;
        }

        /* Content Wrapper */
        .content-wrapper {
          width: 100%;
          max-width: 100%;
          padding: 0;
          display: flex;
          flex-direction: column;
        }

         /* Header Styles */
        header.header {
          height: 70px;
          max-height: 70px;
          width: 100%;
          padding: 25px 0;
          background: var(--background);
          border-bottom: var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          position: sticky;
          top: 0;
          z-index: 10;
          backdrop-filter: blur(10px);
        }

        header.header > div.header-title {
          flex: 1;
          width: calc(100% - 230px);
          display: flex;
          flex-direction: column;
          padding: 2px;
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
          font-family: var(--font-text), sans-serif;
          font-size: 0.8rem;
          font-weight: 400;
          line-height: 1.4;
          color: var(--gray-color);
          margin: 0;
          padding: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        header.header > ul.links {
          display: flex;
          align-items: center;
          gap: 15px;
          margin: 0;
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
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-color);
          position: relative;
        }

        header.header > ul.links > li.link:hover {
          background: var(--tab-background);
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

        header.header > ul.links > li.link:hover > span.text {
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