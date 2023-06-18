const dbStandard = require('./db-services/db-standard');
const dbRooms = require('./db-services/db-rooms');
const {
  roomtypes,
  rooms,
  roomreservations,
  usertypes,
  bookings,
  discounts,
  discountslabs,
  guests,
  payments,
  credentials,
} = require('../database/models');
const helper = require('./utils/helper');

const { Op, Sequelize } = require('sequelize');
const { sendSingleEmail } = require('./utils/send-email');

async function roomReservationStatusCurrentMonth(req, res, next) {
  const { dateString } = req.params;
  const currentDate = helper.parseDateString(dateString);
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const dbResult = await dbRooms.roomStatusMonthWise(startOfMonth, endOfMonth);

  // Generate column headers (dates)
  const calendarDates = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const workingDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      i
    );
    const formattedDate = helper.formatDateYYYYMMDDwithDash(workingDate);
    calendarDates.push(formattedDate);
  }

  // Function to create an empty reservation object
  const createEmptyReservation = (date) => ({ reservation_date: date });

  // Create the expected output
  const formattedOutput = dbResult.map((roomType) => ({
    room_type_name: roomType.room_type_name,
    rooms: roomType.rooms.map((singleRoom) => {
      const roomId = singleRoom.id;
      const roomNumber = singleRoom.room_number;
      const reservation = calendarDates.map((date) => {
        const reservation = singleRoom.roomreservations.find(
          (res) => res.reservation_date === date
        );
        return reservation || createEmptyReservation(date);
      });
      return {
        room_id: roomId,
        room_number: roomNumber,
        reservation: reservation,
      };
    }),
  }));
  return res.json({ calendarDates, reservationData: formattedOutput });
}

async function singleRoomData(req, res, next) {
  const { roomId } = req.params;
  const roomData = await dbStandard.joinFilterSingleRecordDb(rooms, roomtypes, {
    id: roomId,
  });
  return res.json(roomData);
}

module.exports = {
  roomReservationStatusCurrentMonth,
  singleRoomData,
};
