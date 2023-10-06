/* eslint-disable @next/next/no-html-link-for-pages */
import React, { useState, useEffect } from 'react';
import {
  dateStringFormattedToDate,
  formatDateMONDD,
  formatDateYYYYMMDD,
} from '../_functions/date-functions';
import axios from 'axios';
import { Icon } from '../_commom/Icon';
import { Container, Modal } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';
import { PropagateLoader, RiseLoader } from 'react-spinners';
import ListAllGuests from '../guests/list-all-guests';

function RoomWiseView({ session }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [roomData, setRoomData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGuestModal, setShowGuestModal] = useState(false);

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
            <div className="room-header bg-light gap-100 ps-2 position-sticky start-0">
              Room
            </div>
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
                              Object.keys(singleReservation).length === 1 ||
                              singleReservation.status === ''
                                ? 'room-available'
                                : singleReservation.status === 'provisioned'
                                ? 'room-provisioned'
                                : 'room-booked'
                            }`}>
                            {Object.keys(singleReservation).length === 1 ||
                            singleReservation.status === '' ? (
                              <button
                                className="btn-available"
                                href="/booking/add-booking"
                                // target="_blank"
                                // rel="noreferrer"
                                onClick={() => {
                                  setShowGuestModal(true);
                                }}>
                                <Icon
                                  nameIcon="FaCalendarPlus"
                                  propsIcon={{ color: '#1e3c72' }}
                                />
                              </button>
                            ) : singleReservation.status === 'booked' ? (
                              <a
                                className="btn-booked"
                                href={`/booking/show-booking?id=${singleReservation.booking_id}`}
                                target="_blank"
                                rel="noreferrer">
                                <Icon
                                  nameIcon="FaRegCalendarCheck"
                                  propsIcon={{ color: '#ffffff' }}
                                />
                              </a>
                            ) : (
                              <button className="btn-provisioned">
                                <Icon
                                  nameIcon="FaCalendarPlus"
                                  propsIcon={{ color: '#1e3c72' }}
                                />
                              </button>
                            )}
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

      <Modal
        show={showGuestModal}
        size="xl"
        onHide={() => setShowGuestModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Guest</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListAllGuests />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default RoomWiseView;
