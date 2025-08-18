
export default class NumberManager {
	constructor(formatLongNumber) {
		console.log("NumberManager");
		this.format = formatLongNumber;
	}

	formatNumber(number, locale, options) {
		return new Intl.NumberFormat(locale, options).format(number);
	}

	formatCurrency(number, locale, currency) {
		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency: currency
		}).format(number);
	}

	shorten = str => {
		try {
			const num = parseInt(str);

			// format the number
			return this.format(num);
		} catch (error) {
			return '0';
		}
	}

	withCommas = num => {
		const parts = num.toString().split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parts.join(".");
	}

	withCommasWithoutDecimals = num => {
		let x = parseFloat(num).toFixed(0);
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	balanceWithCommas = (str) => {
		try {
			let x = parseFloat(str).toFixed(2);

			// if x is NaN, return 0.00
			if (isNaN(x)) return '0.00';

			// return the number with two decimal places with commas
			let parts = x.toString().split(".");
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return parts.join(".");
		} catch (error) {
			return '0.00';
		}
	}

	format = (num, decimal = 2) => {
		try {
			// return the number with the specified decimal places
			return parseFloat(num).toFixed(decimal);
		} catch (error) {
			return `0.${'0'.repeat(decimal)}`;
		}
	}

	parse = (str) => {
		try {
			let x = parseFloat(str);
			// if x is NaN, return 0
			if (isNaN(x)) return 0;
			// else return x
			return x;
		} catch (error) {
			return 0;
		}
	}

	parseInteger = (str) => {
		try {
			let x = parseInt(str);
			// if x is NaN, return 0
			if (isNaN(x)) return 0;
			// else return x
			return x;
		} catch (error) {
			return 0;
		}
	}

	intWithCommas = (num) => {
		try {
			// return the number with commas
			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		} catch (error) {
			return '0';
		}
	}
}