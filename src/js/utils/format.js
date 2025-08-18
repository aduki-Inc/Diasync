// Universal number formatter (same as overview.js)
export default function formatLongNumber(value) {
  const num = parseFloat(value);

  if (isNaN(num)) return '0';

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  // decimals with more than 2 decimal places are rounded to 2
  if (absNum < 1) {
    return sign + num.toFixed(2);
  }

  // numbers under 1k with more than 2 decimal places are rounded to 2
  if (absNum < 1000 && num.toString().split('.')[1]?.length > 2) {
    return sign + num.toFixed(2);
  }
  // numbers between 1k and 10k with decimal places ; are rounded to 1 and add comma
  if (absNum < 10000 && num.toString().split('.')[1]?.length > 1) {
    return sign + num.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // 0-999: remains as is
  if (absNum < 1000) {
    return sign + absNum.toString();
  }

  // 1,000-9,999: written with comma (1,756.56)
  if (absNum < 10000) {
    return sign + absNum.toLocaleString();
  }

  // 10,000-99,999: written as 43.4k
  if (absNum < 100000) {
    const formatted = (absNum / 1000).toFixed(1);
    return sign + formatted + 'k';
  }

  // 100k-999k: written as 646k
  if (absNum < 1000000) {
    const formatted = Math.round(absNum / 1000);
    return sign + formatted + 'k';
  }

  // 1M-9.9M: written as 1.03M or 4.46M
  if (absNum < 10000000) {
    const formatted = (absNum / 1000000).toFixed(2);
    return sign + formatted + 'M';
  }

  // 10M-99M: written as 65.6M
  if (absNum < 100000000) {
    const formatted = (absNum / 1000000).toFixed(1);
    return sign + formatted + 'M';
  }

  // 100M-999M: written as 467M
  if (absNum < 1000000000) {
    const formatted = Math.round(absNum / 1000000);
    return sign + formatted + 'M';
  }

  // Billions follow the same pattern as millions
  // 1B-9.9B: written as 1.03B or 4.46B
  if (absNum < 10000000000) {
    const formatted = (absNum / 1000000000).toFixed(2);
    return sign + formatted + 'B';
  }

  // 10B-99B: written as 65.6B
  if (absNum < 100000000000) {
    const formatted = (absNum / 1000000000).toFixed(1);
    return sign + formatted + 'B';
  }

  // 100B-999B: written as 467B
  if (absNum < 1000000000000) {
    const formatted = Math.round(absNum / 1000000000);
    return sign + formatted + 'B';
  }

  // Trillions follow the same pattern
  // 1T-9.9T: written as 1.03T or 4.46T
  if (absNum < 10000000000000) {
    const formatted = (absNum / 1000000000000).toFixed(2);
    return sign + formatted + 'T';
  }

  // 10T-99T: written as 65.6T
  if (absNum < 100000000000000) {
    const formatted = (absNum / 1000000000000).toFixed(1);
    return sign + formatted + 'T';
  }

  // 100T-999T: written as 467T
  if (absNum < 1000000000000000) {
    const formatted = Math.round(absNum / 1000000000000);
    return sign + formatted + 'T';
  }

  // Anything greater than 999T will be 999T+
  return sign + '999T+';
};