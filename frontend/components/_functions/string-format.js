export function camelCaseToCapitalizedString(text) {
  // Add a space before any uppercase letter preceded by a lowercase letter
  const spacedText = text.replace(/([a-z])([A-Z])/g, '$1 $2');
  // Capitalize the first letter of each word
  const capitalizedText = spacedText.replace(/\b\w/g, (match) =>
    match.toUpperCase()
  );
  return capitalizedText;
}

export function datetimeStringToDate(datetimeString) {
  const date = new Date(datetimeString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based
  const day = date.getDate();
  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`;
  return formattedDate;
}
