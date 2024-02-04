export const BDTFormat = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'BDT',
});

export const returnPercentage = (rackRate, discountedRate) => {
  const percentageValue = ((rackRate - discountedRate) * 100) / rackRate;
  return percentageValue.toFixed(2) + '%';
};

//Round up to defined number of digits
export function roundUptoFixedDigits(numberToRound, decimalPlaces) {
  if (!isNaN(numberToRound) && !isNaN(decimalPlaces))
    return (Math.ceil(numberToRound * 100) / 100).toFixed(decimalPlaces);
  else return false;
}

export function numberToIndianFormat(number) {
  if (isNaN(number) || number === null) {
    return null;
  }

  const indianFormattedString = new Intl.NumberFormat('en-IN').format(number);
  return indianFormattedString;
}