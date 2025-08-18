export default class StringManager {
  constructor(str) {
    this.string = str || "";
  }

  // set string
  setString = str => {
    this.string = str;
  }

  // get string
  getString = () => {
    return this.string;
  }

  // capitalize string
  capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}