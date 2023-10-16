const orgConfig = require('../../configs/org.config');
const dbStandard = require('../db-services/db-standard');
const { referencesequences } = require('../../database/models');

async function generateRandomString(n) {
  let randomString = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < n; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomString;
}

async function generateReference(type) {
  const orgPrefix = orgConfig.orgConfig.FACILITY_NAME;

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based
  const day = date.getDate();
  const formattedDate = `${year}${month.toString().padStart(2, '0')}${day
    .toString()
    .padStart(2, '0')}`;

  const existingRecord = await dbStandard.findOneFilterDb(referencesequences, {
    record_date: date,
    type: type,
  });
  console.log('existingRecord: ' + JSON.stringify(existingRecord));

  const nextId = (Number(existingRecord?.seq) || 0) + 1;
  const updateId = !existingRecord
    ? await dbStandard.addSingleRecordDB(referencesequences, {
        type: type,
        record_date: date,
        seq: nextId,
      })
    : await dbStandard.modifySingleRecordDb(
        referencesequences,
        {
          type: type,
          record_date: date,
        },
        {
          seq: nextId,
        }
      );

  const referenceNumber =
    orgPrefix + '_' + formattedDate + nextId.toString().padStart(4, '0');
  return referenceNumber;
}

function getDateWithOffset(offset) {
  const date = new Date();
  date.setDate(date.getDate() + Number(offset));
  return date;
}

function getEndDateWithDuration(startDate, duration) {
  const startDateObj = new Date(startDate);
  startDateObj.setDate(startDateObj.getDate() + Number(duration));
  return startDateObj;
}

function getStartAndEndDateWithDuration(refDate, duration) {
  const dateObj = new Date(refDate);
  dateObj.setDate(dateObj.getDate() + duration);
  const startDate = duration < 0 ? dateObj : new Date(refDate);
  const endDate = duration < 0 ? new Date(refDate) : dateObj;
  return { startDate, endDate };
}

function parseDateString(dateString) {
  if (!dateString) return new Date();
  const year = dateString.substring(0, 4);
  const month = Number(dateString.substring(4, 6)) - 1;
  const day = dateString.substring(6, 8);

  // return new Date(year, month, day);
  const date = new Date(year, month, day);
  // date.setDate(date.getDate() + 1);
  return date;
}

function formatDateYYYYMMDDwithDash(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function camelCaseToCapitalizedString(text) {
  if (!text) return '';
  // Add a space before any uppercase letter preceded by a lowercase letter
  const spacedText = text.replace(/([a-z])([A-Z])/g, '$1 $2');
  // Capitalize the first letter of each word
  const capitalizedText = spacedText.replace(/\b\w/g, (match) =>
    match.toUpperCase()
  );
  return capitalizedText;
}

module.exports = {
  generateRandomString,
  generateReference,
  getDateWithOffset,
  parseDateString,
  getEndDateWithDuration,
  getStartAndEndDateWithDuration,
  formatDateYYYYMMDDwithDash,
  camelCaseToCapitalizedString,
};
