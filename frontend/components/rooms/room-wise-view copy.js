import React, { useState, useEffect } from 'react';
import {
  dateStringFormattedToDate,
  formatDateMONDD,
  formatDateYYYYMMDD,
} from '../_functions/date-functions';
import axios from 'axios';
import { Icon } from '../_commom/Icon';
import BookingView from '../booking/booking-view';
import { Container, Modal } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';
import AddReservation from './add-reservation';
import { PropagateLoader, RiseLoader } from 'react-spinners';

function RoomWiseView({ session }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [roomData, setRoomData] = useState([]);
  const [showExistingBooking, setShowExistingBooking] = useState(false);
  const [bookingId, setBookingId] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [existingRecord, setExistingRecord] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoomData = async () => {
      setIsLoading(true);
      const dateString = formatDateYYYYMMDD(currentMonth);
      const apiResult = await axios.get(
        `/api/dashboard/booking-status/room-booking-status-api?dateString=${dateString}`
      );
      setRoomData(apiResult.data);
      setIsLoading(false);
    };

    fetchRoomData();
  }, [currentMonth]);

  // Function to navigate to the previous month
  const goToPreviousMonth = () => {
    setIsLoading(true);
    setCurrentMonth(
      (prevMonth) => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1)
    );
  };

  // Function to navigate to the next month
  const goToNextMonth = () => {
    setIsLoading(true);
    setCurrentMonth(
      (prevMonth) => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1)
    );
  };

  return (
    <div className="room-status">
      <div className="d-flex justify-content-start mb-3">
        <div className="reactive-button-wauto me-1">
          <ReactiveButton
            buttonState={isLoading ? 'loading' : 'idle'}
            idleText={
              <div className="d-flex align-items-center justify-content-between">
                <Icon nameIcon="FaAngleLeft" propsIcon={{ size: 14 }} />
                <span className="text-end w-100px">Previous Month</span>
              </div>
            }
            loadingText={
              <div className="d-flex align-items-center justify-content-between">
                <Icon nameIcon="FaAngleLeft" propsIcon={{ size: 14 }} />
                <span className="text-end w-100px">
                  <RiseLoader color="#0860ae" size={5} speedMultiplier={2} />
                </span>
              </div>
            }
            outline
            color="indigo"
            className="rounded-1 py-1 px-2"
            onClick={goToPreviousMonth}
          />
        </div>
        <div className="reactive-button-wauto ms-1">
          <ReactiveButton
            buttonState={isLoading ? 'loading' : 'idle'}
            idleText={
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-start w-100px">Next Month</span>
                <Icon nameIcon="FaAngleRight" propsIcon={{ size: 14 }} />
              </div>
            }
            loadingText={
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-start w-100px">
                  <RiseLoader color="#0860ae" size={5} speedMultiplier={2} />
                </span>
                <Icon nameIcon="FaAngleRight" propsIcon={{ size: 14 }} />
              </div>
            }
            outline
            color="indigo"
            className="rounded-1 py-1 px-2"
            onClick={goToNextMonth}
          />
        </div>
      </div>

      {isLoading ? (
        <Container className="d-flex justify-content-center align-items-center min-vh-30">
          <PropagateLoader color="#0860ae" size={10} />
        </Container>
      ) : (
        <div className="scrolling-container">
          <div className="date-container">
            <div className="component-header">Date</div>
            <div className="gap-100 ps-2">Room</div>
            {roomData?.calendarDates?.map((calendarDate, id) => (
              <div className="date-header fw-bold" key={id}>
                {formatDateMONDD(dateStringFormattedToDate(calendarDate, '-'))}
              </div>
            ))}
          </div>

          {roomData?.reservationData?.map((roomType, id1) =>
            roomType.rooms.length ? (
              <div className="roomtype-container border" key={id1}>
                <div className="component-header">
                  {roomType.room_type_name}
                </div>

                <div className="w-100">
                  {roomType.rooms?.map((room, id2) => (
                    <div className="room-container" key={id2}>
                      <div className="room-header ps-2">{room.room_number}</div>

                      <div className="d-flex">
                        {room.reservation?.map((singleReservation, id3) => (
                          <div
                            key={id3}
                            className={`room-status ${
                              // Object.keys(singleReservation).length === 0
                              Object.keys(singleReservation).length === 1 ||
                              singleReservation.status === ''
                                ? 'room-available'
                                : singleReservation.status === 'provisioned'
                                ? 'room-provisioned'
                                : 'room-booked'
                            }`}>
                            {
                              // Object.keys(singleReservation).length === 0
                              Object.keys(singleReservation).length === 1 ||
                              singleReservation.status === '' ? (
                                <button
                                  className="btn-available"
                                  onClick={() => {
                                    setShowBooking(true);
                                    setExistingRecord({
                                      ...singleReservation,
                                      ...room,
                                    });
                                  }}>
                                  <Icon
                                    nameIcon="FaCalendarPlus"
                                    propsIcon={{ color: '#1e3c72' }}
                                  />
                                </button>
                              ) : singleReservation.status === 'provisioned' ? (
                                <button
                                  className="btn-provisioned"
                                  onClick={() => {
                                    setShowBooking(true);
                                    setExistingRecord({
                                      ...singleReservation,
                                      ...room,
                                    });
                                  }}>
                                  <Icon
                                    nameIcon="FaCalendarPlus"
                                    propsIcon={{ color: '#1e3c72' }}
                                  />
                                </button>
                              ) : (
                                <button
                                  className="btn-booked"
                                  onClick={() => {
                                    setShowExistingBooking(true);
                                    setBookingId(singleReservation.booking_id);
                                  }}>
                                  <Icon
                                    nameIcon="FaRegCalendarCheck"
                                    propsIcon={{ color: '#ffffff' }}
                                  />
                                </button>
                              )
                            }
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              ''
            )
          )}
        </div>
      )}

      {/* Existing booking view */}
      {/* <Modal
        show={showExistingBooking}
        onHide={() => setShowExistingBooking(false)}
        size="xl">
        <Modal.Body>
          <BookingView bookingId={bookingId} isNew={false} />
          <div className="center-flex">
            <div className="mx-1">
              <ReactiveButton
                buttonState="idle"
                idleText="Close"
                outline
                color="red"
                className="rounded-1"
                onClick={() => setShowExistingBooking(false)}
              />
            </div>

            <a href={`/booking/show-booking?id=${bookingId}`} className="mx-1">
              <ReactiveButton
                buttonState="idle"
                idleText="Edit"
                outline
                color="blue"
                className="rounded-1"
                onClick={() => setShowExistingBooking(false)}
              />
            </a>
          </div>
        </Modal.Body>
      </Modal> */}

      {/* New booking/existing provisions */}
      <AddReservation
        show={showBooking}
        setShow={setShowBooking}
        existingRecord={existingRecord}
        session={session}
      />
    </div>
  );
}

export default RoomWiseView;
