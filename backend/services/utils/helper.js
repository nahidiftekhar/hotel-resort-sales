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
  const matchExisting = await Cards.count({
    where: { card_link: randomString },
  });
  if (matchExisting) generateRandomString(n);
  console.log(randomString);
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
  date.setDate(date.getDate() + Number(duration));
  return date;
}

function parseDateString(dateString) {
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6) - 1;
  const day = dateString.substring(6, 8);

  return new Date(year, month, day);
}

module.exports = {
  generateRandomString,
  generateReference,
  getDateWithOffset,
  parseDateString,
  getEndDateWithDuration,
};
