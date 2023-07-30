function getDatesBetween(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);
  while (currentDate < end) {
    currentDate.setDate(currentDate.getDate() + 1);
    dates.push(currentDate.toISOString().slice(0, 10));
  }
  return dates;
}

function getDatesIncludingStart(date1, date2) {
  const dates = [];
  const currentDate = new Date(date1);
  const end = new Date(date2);
  while (currentDate < end) {
    dates.push(currentDate.toISOString().slice(0, 10));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

function getDatesIncludingStartEnd(date1, date2) {
  const dates = [];
  const currentDate = new Date(date1);
  const end = new Date(date2);
  while (currentDate <= end) {
    dates.push(currentDate.toISOString().slice(0, 10));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

function getVenueBookingModifications( existingBookings, modifiedBookings ) {
    const removedBookings = [];
    const addedBookings = [];
    const removedDatesBookings = [];
    const addedDatesBookings = [];

    console.log('existingBookings: ' + JSON.stringify(existingBookings))

    if(!existingBookings || existingBookings?.length === 0) {
      modifiedBookings.forEach((addedBooking) => {
        getDatesIncludingStartEnd(
          addedBooking.checkInDate,
          addedBooking.checkOutDate
        ).forEach((addedDate) => {
          addedDatesBookings.push({
            venueId: addedBooking.venueId,
            addedDate,
          });
        });
      });
      return {
        removedDatesBookings,
        addedDatesBookings,
      };
    }
  
    for (const modifiedBooking of modifiedBookings) {
      if (
        !existingBookings?.some(
          (existingBooking) => existingBooking?.venueId === modifiedBooking?.venueId
        )
      ) {
        addedBookings.push(modifiedBooking);
      }
    }
  
    for (const existingBooking of existingBookings) {
      if (
        !modifiedBookings?.some(
          (modifiedBooking) => modifiedBooking?.venueId === existingBooking?.venueId
        )
      ) {
        removedBookings.push(existingBooking);
      }
    }
  
    for (const existingBooking of existingBookings) {
      const matchingBooking = modifiedBookings?.find(
        (modifiedBooking) =>
          modifiedBooking?.venueId === existingBooking?.venueId &&
          (modifiedBooking.checkInDate !== existingBooking?.checkInDate ||
            modifiedBooking.checkOutDate !== existingBooking?.checkOutDate)
      );
  
      if (matchingBooking) {
        const removedDates =
          matchingBooking.checkInDate <= existingBooking?.checkOutDate
            ? getDatesIncludingStart(
                existingBooking?.checkInDate,
                matchingBooking.checkInDate
              )
            : getDatesIncludingStartEnd(
                existingBooking?.checkInDate,
                existingBooking?.checkOutDate
              );
        removedDates.push(
          ...getDatesBetween(matchingBooking.checkOutDate, existingBooking?.checkOutDate)
        );
  
        const addedDates =
          existingBooking?.checkOutDate >= matchingBooking.checkInDate
            ? getDatesBetween(existingBooking?.checkOutDate, matchingBooking.checkOutDate)
            : getDatesIncludingStartEnd(
                matchingBooking.checkInDate,
                matchingBooking.checkOutDate
              );
        addedDates.unshift(
          ...getDatesIncludingStart(
            matchingBooking.checkInDate,
            existingBooking?.checkInDate
          )
        );
  
        removedDates.forEach((removedDate) => {
          removedDatesBookings.push({
            venueId: existingBooking?.venueId,
            removedDate,
          });
        });
  
        addedDates.forEach((addedDate) => {
          addedDatesBookings.push({
            venueId: existingBooking?.venueId,
            addedDate,
          });
        });
      }
    }
  
    for (const addedBooking of addedBookings) {
      getDatesIncludingStartEnd(
        addedBooking.checkInDate,
        addedBooking.checkOutDate
      ).forEach((addedDate) => {
        addedDatesBookings.push({
          venueId: addedBooking.venueId,
          addedDate,
        });
      });
    }
  
    for (const removedBooking of removedBookings) {
      getDatesIncludingStartEnd(
        removedBooking.checkInDate,
        removedBooking.checkOutDate
      ).forEach((removedDate) => {
        removedDatesBookings.push({
          venueId: removedBooking.venueId,
          removedDate,
        });
      });
    }
  
    return {
      removedDatesBookings,
      addedDatesBookings,
    };
  }

module.exports = {
    getVenueBookingModifications,
}