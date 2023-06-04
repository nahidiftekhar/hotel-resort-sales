export function camelCaseToCapitalizedString(text) {
  if (!text) return '';
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

export function datetimeStringToDateTime(datetimeString) {
  const datetime = new Date(datetimeString);
  const datePart = datetimeStringToDate(datetimeString);
  const timePart = datetime.toLocaleTimeString();

  return datePart + ' ' + timePart;
}

export function reduceStringBySubstring(string, substring, maxCount) {
  let count = 0;
  let lastIndex = -1;

  while (count < maxCount) {
    const index = string.indexOf(substring, lastIndex + 1);
    if (index !== -1) {
      lastIndex = index;
      count++;
    } else {
      break;
    }
  }
  return string.substring(0, lastIndex);
}

export function productDescriptionShortener(htmlString, maxCount) {
  let count = 0;
  let lastIndex = -1;
  const substring = '<br />';

  const string = htmlString
    .replace(/<\/?(div|p)[^>]*>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n/g, '<br />');

  while (count < maxCount) {
    const index = string.indexOf(substring, lastIndex + 1);
    if (index !== -1) {
      lastIndex = index;
      count++;
    } else {
      break;
    }
  }
  if (lastIndex === -1) return string;
  return string.substring(0, lastIndex);
}

export function isUrl(str) {
  // Regular expression pattern to match a URL
  const urlPattern = /^(http|https):\/\/[^ "]+$/;
  return urlPattern.test(str);
}
