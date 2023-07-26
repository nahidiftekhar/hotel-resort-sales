import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import ReactiveButton from 'reactive-button';

import QuillComponent from '@/components/_commom/quill-component';
import ImageUpload from '@/components/_commom/image-upload';
import { CustomTextInput } from '@/components/_commom/form-elements';
import { editRoomApi, editVenueApi, listRoomTypesApi } from '@/api/products-api';

function EditVenue({ productDetail, isNew, setRefresh, setShow }) {
  const [value, setValue] = useState(productDetail?.description);
  const [deltaValue, setDeltaValue] = useState('');
  const [error, setError] = useState(false);
  const [image, setImage] = useState(productDetail?.image_url || '');

  const handleSubmit = async (productData) => {
    if (productData) {
      const apiResult = await editVenueApi(productData, value, image, isNew);
      if (apiResult.success) {
        setRefresh(true);
        setShow(false);
      } else {
        setError(true);
        return false;
      }
    }
    if (!value) {
      setError(true);
      return false;
    }
  };

  return (
    <div className="">
      <Formik
        initialValues={{
          venueId: isNew ? '' : productDetail?.id,
          imageUrl: isNew ? '' : productDetail?.image_url,
          venueName: isNew ? 0 : productDetail?.venue_name,
          venueLocation: isNew ? '' : productDetail?.venue_location,
          price: isNew ? 0 : productDetail?.price
        }}
        onSubmit={(values) => handleSubmit(values)}>
        {(formik) => {
          const { values } = formik;
          return (
            <Form className="custom-form arrow-hidden">
              <Row>
                <Col
                  md={6}
                  className="d-flex flex-column justify-content-center">
                  <div className="my-2">
                    <CustomTextInput
                      label="Name of Venue"
                      name="venueName"
                      type="text"
                      placeholder="Venue Name"
                    />
                  </div>

                  <div className="my-2">
                    <CustomTextInput
                      label="Price (BDT)"
                      name="price"
                      type="number"
                      placeholder="Item Price"
                    />
                  </div>

                  <div className="my-2">
                    <CustomTextInput
                      label="Location"
                      name="VenueLocation"
                      type="text"
                      placeholder="Location"
                    />
                  </div>
                </Col>

                <Col md={6}>
                  <ImageUpload
                    setImage={setImage}
                    imageFile={productDetail?.image_url || ''}
                    saveLocation={'products/rooms'}
                  />
                </Col>

                <Col md={12} className={error ? 'q-error' : ''}>
                  <div className="my-2 min-vh-50">
                    <QuillComponent
                      value={value}
                      setValue={setValue}
                      deltaValue={deltaValue}
                      setDeltaValue={setDeltaValue}
                    />
                  </div>
                </Col>
              </Row>
              <div className="d-flex justify-content-end my-2">
                <ReactiveButton
                  buttonState="idle"
                  idleText="Submit"
                  color="blue"
                  type="submit"
                  onClick={handleSubmit}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default EditVenue;
