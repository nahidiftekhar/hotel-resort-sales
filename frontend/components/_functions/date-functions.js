export function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

export function formatDateYYYYMMDD(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('');
}

export function formatDateYYYYMMDDwithDash(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

export function formatDateMONDD(date) {
  const options = { month: 'short', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  return formattedDate;
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

export function dateStringToDate(dateString) {
  const year = dateString.substr(0, 4);
  const month = dateString.substr(4, 2) - 1;
  const day = dateString.substr(6, 2);

  return new Date(year, month, day);
}

export function dateStringFormattedToDate(dateString, splitter) {
  const dateComponent = dateString.split(splitter);
  return new Date(
    dateComponent[0],
    Number(dateComponent[1]) - 1,
    dateComponent[2]
  );
}

export function datetimeStringToDateTime(datetimeString) {
  const datetime = new Date(datetimeString);
  const datePart = datetimeStringToDate(datetimeString);
  const timePart = datetime.toLocaleTimeString();

  return datePart + ' ' + timePart;
}

export const dateArrayForChart = (refDate, duration) => {
  const dateArray = [];
  for (let index = duration + 1; index <= 0; index++) {
    const currentDate = new Date();
    currentDate.setDate(refDate.getDate() + index);

    const yyyymmddFormat = formatDateYYYYMMDDwithDash(currentDate);
    const formattedDate = formatDateMONDD(currentDate);
    dateArray.push({ yyyymmddFormat, formattedDate });
  }
  return dateArray;
};

export function dateStringToMONDD(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });

  return `${day} ${month}`;
}