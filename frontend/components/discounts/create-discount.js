import { Formik, Form } from 'formik';
import React, { useEffect, useState } from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';
import {
  CustomTextArea,
  CustomTextInput,
} from '@/components/_commom/form-elements';
import { createDiscountApi, getMaxDiscountSlab } from '@/api/booking-api';

function CreateDiscount({ show, setShow, bookingData, setBookingData }) {
  const [maxDiscount, setMaxDiscount] = useState(0);

  useEffect(() => {
    const getMaxDiscount = async () => {
      const apiResult = await getMaxDiscountSlab();
      setMaxDiscount(apiResult);
    };
    getMaxDiscount();
  }, []);

  const priceBeforeDiscount =
    (bookingData.totalPackageCost || 0) +
    (bookingData.totalPrixfixeCost || 0) +
    (bookingData.totalRoomCost || 0) +
    (bookingData.totalAlacarteCost || 0) +
    (bookingData.totalServiceCost || 0);

  const handleSubmit = async (values) => {
    const discountData = {
      ...values,
      bookingId: bookingData.bookingId,
      priceBeforeDiscount,
    };
    const apiResult = await createDiscountApi(discountData);
    setBookingData({
      ...bookingData,
      discountPercentage: values.discountPercentage || 0,
      discountStatus: apiResult.addDiscount.dbResult.approval_status,
      discountNotes: apiResult.addDiscount.dbResult.discount_notes,
    });

    setTimeout(() => {
      setShow(false);
    }, 3000);
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      backdrop="static"
      keyboard={false}>
      <Modal.Header>
        <Modal.Title>Create Discount</Modal.Title>
      </Modal.Header>
      {bookingData.discountStatus ? (
        <Modal.Body>
          {(() => {
            switch (bookingData.discountStatus) {
              case 'selfApproved':
                return (
                  <div className="text-success">
                    Discount applied successfully!
                  </div>
                );
              case 'pendingApproval':
                return (
                  <div className="text-success">
                    Discount request sent for approval.
                  </div>
                );
              default:
                return (
                  <div className="error-message">Something went wrong</div>
                );
            }
          })()}
          <div className="mx-2 mt-3 d-flex justify-content-center">
            <ReactiveButton
              size="small"
              outline
              color="yellow"
              buttonState="idle"
              idleText={<div className="fw-bold">Close</div>}
              onClick={() => setShow(false)}
            />
          </div>
        </Modal.Body>
      ) : (
        <Modal.Body>
          <div className="custom-form">
            <Formik
              initialValues={{
                guestId: bookingData.guestId,
                userId: bookingData.userId,
                discountPercentage: bookingData.discountPercentage || 0,
                discountNotes: bookingData.discountNotes || '',
              }}
              //   validationSchema={validationRules}
              onSubmit={(values) => handleSubmit(values)}>
              {(formik) => {
                const { values } = formik;
                return (
                  <Form>
                    <div>
                      <CustomTextInput
                        type="number"
                        label="Discount Percentage (%)"
                        max={maxDiscount}
                        name="discountPercentage"
                        placeholder="%"
                      />
                    </div>

                    <div className="d-flex justify-content-between border bg-light rounded px-2 p-1 my-2">
                      <span>Price before discount (BDT)</span>
                      <span className="ms-2 fw-bold">
                        {priceBeforeDiscount}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between border bg-light rounded px-2 p-1 mb-3">
                      <span>Price after discount (BDT)</span>
                      <span className="ms-2 fw-bold">
                        {values.discountPercentage > 50
                          ? priceBeforeDiscount
                          : priceBeforeDiscount *
                            (1 - values.discountPercentage / 100)}
                      </span>
                    </div>

                    <div className="d-flex justify-content-center mt-4">
                      <div className="mx-2">
                        <ReactiveButton
                          type="submit"
                          size="small"
                          outline
                          color="blue"
                          buttonState="idle"
                          idleText={<div className="fw-bold">Submit</div>}
                        />
                      </div>

                      <div className="mx-2">
                        <ReactiveButton
                          size="small"
                          outline
                          color="blue"
                          buttonState="idle"
                          idleText={<div className="fw-bold">Cancel</div>}
                          onClick={() => setShow(false)}
                        />
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </Modal.Body>
      )}
    </Modal>
  );
}

export default CreateDiscount;
