export default class DateManager {
	constructor(stringDate) {
		this.date = stringDate ? new Date(stringDate) : new Date();
	}

	set = stringDate => {
		this.date = new Date(stringDate);
	}

	parse = stringDate => {
		return new Date(stringDate);
	}

	// set date
	setDate = str => {
		this.date = new Date(str);
	}

	// get date
	getDate = () => {
		return this.date;
	}

	// Get day: Mon, Tue, Wed, Thu, Fri, Sat, Sun
	// kind can be long or short
	day = kind => {
		if (kind === 'long') {
			return this.date.toLocaleString('default', { weekday: 'long' });
		} else {
			return this.date.toLocaleString('default', { weekday: 'short' });
		}
	}

	// Get month: January, February, March, April, May, June, July, August, September, October, November, December
	// kind can be long or short
	month = kind => {
		if (kind === 'long') {
			return this.date.toLocaleString('default', { month: 'long' });
		} else {
			return this.date.toLocaleString('default', { month: 'short' });
		}
	}

	// Get year: 2021, 2022, 2023
	year = () => {
		return this.date.getFullYear();
	}

	// Get time: HH:MM AM/PM
	// kind can 12 or 24
	time = kind => {
		if (kind === 24) {
			return this.date.toLocaleString('default', { hour: '2-digit', minute: '2-digit', hour12: false });
		} else {
			return this.date.toLocaleString('default', { hour: '2-digit', minute: '2-digit', hour12: true });
		}
	}

	// get time: 12:00 PM
	// kind can 12 or 24
	getTime = (date, kind = 12) => {
		if (!(date instanceof Date)) {
			date = new Date(date);
		}

		if (kind === 24) {
			return date.toLocaleString('default', { hour: '2-digit', minute: '2-digit', hour12: false });
		} else {
			return date.toLocaleString('default', { hour: '2-digit', minute: '2-digit', hour12: true });
		}
	}

	// get date: 24, 25, 26
	getDate = () => {
		return this.date.getDate();
	}

	// Lapse time from now to the date:
	lapseTime = str => {
		const date = new Date(str);
		const now = new Date();
		const diff = now - date;
		const sec = Math.floor(diff / 1000);
		const min = Math.floor(sec / 60);
		const hour = Math.floor(min / 60);
		const day = Math.floor(hour / 24);
		const week = Math.floor(day / 7);
		const month = Math.floor(week / 4);
		const year = Math.floor(month / 12);

		if (year > 0) {
			return `${year} year${year > 1 ? "s" : ""} ago`;
		} else if (month > 0) {
			return `${month} month${month > 1 ? "s" : ""} ago`;
		} else if (week > 0) {
			return `${week} week${week > 1 ? "s" : ""} ago`;
		} else if (day > 0) {
			return `${day} day${day > 1 ? "s" : ""} ago`;
		} else if (hour > 0) {
			return `${hour} hour${hour > 1 ? "s" : ""} ago`;
		} else if (min > 0) {
			return `${min} minute${min > 1 ? "s" : ""} ago`;
		} else {
			return `${sec} second${sec > 1 ? "s" : ""} ago`;
		}
	}

	formatDateTime = str => {
		const date = new Date(str);

		// get th, st, nd, rd for the date
		const day = date.getDate();
		const dayStr = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';

		// format: 12th August 2021 at 12:00 PM
		return /* html */`
      <span class="date">${date.getDate()}${dayStr} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}</span>
    `;
	}

	message = str => {
		const date = new Date(str);

		// get th, st, nd, rd for the date
		const day = date.getDate();
		const dayStr = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
		const diff = new Date() - date;

		// if we are in the same minute: Just now
		if (diff < 1000 * 60) {
			return 'Just now';
		}

		// if we are in the same day: Today at HH:MM AM/PM
		if (diff < 1000 * 60 * 60 * 24) {
			return /* html */`
        Today at ${date.toLocaleString('default', { hour: 'numeric', minute: 'numeric', hour12: true })}
      `;
		}

		// if we are in the diff is less than 7 days: DAY AT HH:MM AM/PM
		if (diff < 1000 * 60 * 60 * 24 * 7) {
			return /* html */`
        ${date.toLocaleString('default', { weekday: 'short' })} at ${date.toLocaleString('default', { hour: 'numeric', minute: 'numeric', hour12: true })}
      `;
		}

		// if we are in the same month AND year: 12th APR AT HH:MM AM/PM
		if (new Date().getMonth() === date.getMonth() && new Date().getFullYear() === date.getFullYear()) {
			return /* html */`
        ${date.getDate()}${dayStr} ${date.toLocaleString('default', { month: 'short' })} at ${date.toLocaleString('default', { hour: 'numeric', minute: 'numeric', hour12: true })}
      `;
		}

		// if we are in the same year: 12th Jan at 11:59 PM
		if (new Date().getFullYear() === date.getFullYear()) {
			return /* html */`
        ${date.getDate()}${dayStr} ${date.toLocaleString('default', { month: 'short' })} at ${date.toLocaleString('default', { hour: 'numeric', minute: 'numeric', hour12: true })}
      `;
		}

		// if we are in a different year: 12th Jan 2021 at 11:59 PM
		return /* html */`
      ${date.getDate()}${dayStr} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()} at ${date.toLocaleString('default', { hour: 'numeric', minute: 'numeric', hour12: true })}
    `;
	}

	chatDate = str => {
		const date = new Date(str);

		// get th, st, nd, rd for the date
		const day = date.getDate();
		const dayStr = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
		const diff = new Date() - date;

		// if we are in the same minute: Just now
		if (diff < 1000 * 60) {
			return 'Just now';
		}

		// if we are in the same day: Today at HH:MM AM/PM
		if (diff < 1000 * 60 * 60 * 24) {
			// check if dates are the same
			if (new Date().getDate() === date.getDate()) {
				// if we are in the same hour: 36m ago
				if (diff < 1000 * 60 * 60) {
					return `${Math.floor(diff / 1000 / 60)}m Ago`;
				}

				// if we are in the same day: 6h ago
				if (diff < 1000 * 60 * 60 * 24) {
					return `${Math.floor(diff / 1000 / 60 / 60)}h Ago`;
				}

				return /* html */`
          ${date.toLocaleString('default', { hour: 'numeric', minute: 'numeric', hour12: true }).toUpperCase()}
        `;
			} else {
				return /* html */`
          ${date.toLocaleString('default', { hour: 'numeric', minute: 'numeric', hour12: true }).toUpperCase()}
        `;
			}
		}

		// if we are in the diff is less than 7 days: DAY AT HH:MM AM/PM
		if (diff < 1000 * 60 * 60 * 24 * 7) {
			return /* html */`
        ${date.toLocaleString('default', { weekday: 'short' })}
      `;
		}

		// if we are in the same month AND year: 12th APR AT HH:MM AM/PM
		if (new Date().getMonth() === date.getMonth() && new Date().getFullYear() === date.getFullYear()) {
			return /* html */`
        ${date.getDate()}${dayStr} ${date.toLocaleString('default', { month: 'short' })}
      `;
		}

		// if we are in the same year: 12th Jan at 11:59 PM
		if (new Date().getFullYear() === date.getFullYear()) {
			return /* html */`
        ${date.getDate()}${dayStr} ${date.toLocaleString('default', { month: 'short' })}
      `;
		}

		// if we are in a different year: 12th Jan 2021 at 11:59 PM
		return /* html */`
      ${date.getDate()}${dayStr} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}
    `;
	}

	chatLapse = date => {
		try {
			date = new Date(date);
			const now = new Date();
			const diff = now - date;
			const seconds = diff / 1000;
			const minutes = seconds / 60;
			const hours = minutes / 60;
			const days = hours / 24;
			const weeks = days / 7;
			const months = weeks / 4;
			const years = months / 12;

			if (seconds < 60) {
				return `${Math.floor(seconds)}s`;
			} else if (minutes < 60) {
				return `${Math.floor(minutes)}m`;
			} else if (hours < 24) {
				return `${Math.floor(hours)}h`;
			} else if (days < 7) {
				return `${Math.floor(days)}d`;
			} else if (weeks < 4) {
				return `${Math.floor(weeks)}w`;
			} else if (months < 12) {
				return `${Math.floor(months)}mo`;
			} else {
				return `${Math.floor(years)}y`;
			}
		} catch (error) {
			return 'Today';
		}
	}

	getGreeting = () => {
		const date = new Date(Date.now());

		// Return greeting based on time
		if (date.getHours() < 12) {
			return "Good Morning";
		} else if (date.getHours() < 18) {
			return "Good Afternoon";
		} else {
			return "Good Evening";
		}
	}
}