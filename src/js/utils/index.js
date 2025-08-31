import DateManager from "./date.js";
import NumberManager from "./number.js";
import StringManager from "./string.js";
import formatNumber from "./format.js";
import getLogo from "./logo.js";

export default function utils() {
	return {
		date: new DateManager(),
		dateClass: DateManager,
		number: new NumberManager(formatNumber),
		string: new StringManager(),
		logo: getLogo(),
	};
}