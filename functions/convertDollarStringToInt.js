export default function convertDollarStringToInt(dollarString) {
  const numberString = dollarString.replace(/[^0-9.-]+/g, '');
  const dollars = parseFloat(numberString);
  const integerAmount = Math.round(dollars);
  return integerAmount;
}