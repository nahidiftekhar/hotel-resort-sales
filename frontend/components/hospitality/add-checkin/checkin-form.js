import { listAllBookingApi } from '@/api/booking-api';
import { FormDatePicker } from '@/components/_commom/form-elements';
import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

const filteredDay = (date, referenceDate) => {
  return date >= referenceDate.setHours(0, 0, 0, 0);
};

function CheckinForm({ checkInData, setCheckinData }) {
  const [bookingList, setBookingList] = useState([]);

  const toDay = new Date();

  useEffect(() => {
    const fetchBookingList = async () => {
      const apiRes = await listAllBookingApi();
      const bookingListTemp = [
        ...apiRes,
        { id: 0, advanced_amount: 0, value: 0, guest: { name: 'Walk-in' } },
      ];
      setBookingList(
        bookingListTemp.map((obj, index) => {
          return { ...obj, value: obj.id, label: obj.guest.name };
        })
      );
    };
    fetchBookingList();
    setCheckinData({ ...checkInData, checkinDate: toDay, checkoutDate: toDay });
  }, []);

  const handleSelect = (value) => {
    setCheckinData({ ...checkInData, booking: value });
  };

  return (
    <div className="custom-form">
      <Formik
        initialValues={{
          checkInDate: toDay,
          checkOutDate: toDay,
        }}>
        {(formik) => {
          const { values } = formik;
          return (
            <Form>
              <Row>
                <Col md={6} className="py-4">
                  <label>Check-in Date</label>
                  <DatePicker
                    selected={toDay}
                    onChange={(val) => {
                      setCheckinData({ ...checkInData, checkinDate: val });
                    }}
                    filterDate={(date) => filteredDay(date, toDay)}
                    timezone="Asia/Dhaka"
                  />
                </Col>

                <Col md={6} className="py-4">
                  <label>Planned Check-out Date</label>
                  <DatePicker
                    selected={toDay}
                    onChange={(val) => {
                      setCheckinData({ ...checkInData, checkoutDate: val });
                    }}
                    onBlur={(val) => {
                      setCheckinData({ ...checkInData, checkoutDate: val });
                    }}
                    filterDate={(date) => filteredDay(date, toDay)}
                    timezone="Asia/Dhaka"
                  />
                </Col>

                <Col md={6}>
                  <div className="py-2">
                    <label>Room Number</label>
                    <input
                      type="text"
                      className="py-2"
                      onChange={(e) =>
                        setCheckinData({
                          ...checkInData,
                          roomId: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>

                <Col md={6}>
                  <div className="py-2">
                    <label>Select booking record</label>
                    <Select
                      options={bookingList}
                      onChange={(value) => handleSelect(value)}
                    />
                  </div>
                </Col>

                <Col md={12}>
                  <div className="py-2">
                    <label>Notes</label>
                    <textarea
                      rows={2}
                      className="py-2"
                      onChange={(e) =>
                        setCheckinData({
                          ...checkInData,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default CheckinForm;
