import React from 'react';
import { Modal } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';

import {
  deactivateAlacarteApi,
  deactivatePackageApi,
  deactivatePrixfixeApi,
  deactivateRoomApi,
  deactivateRoomTypeApi,
  deactivateServiceApi,
} from '@/api/products-api';

function DeleteProduct({
  show,
  setShow,
  setRefresh,
  productDetail,
  productType,
}) {
  const handleDelete = async () => {
    let apiResult = false;
    switch (productType) {
      case 'package':
        apiResult = await deactivatePackageApi(productDetail.id);
        break;
      case 'prixfixe':
        apiResult = await deactivatePrixfixeApi(productDetail.id);
        break;
      case 'alacarte':
        apiResult = await deactivateAlacarteApi(productDetail.id);
        break;
      case 'room':
        apiResult = await deactivateRoomApi(productDetail.id);
        break;
      case 'roomtype':
        apiResult = await deactivateRoomTypeApi(productDetail.id);
        break;
      case 'service':
        apiResult = await deactivateServiceApi(productDetail.id);
        break;
      default:
        console.log('Deactivate Product');
        break;
    }
    if (apiResult?.success) {
      setRefresh(true);
      setShow(false);
    } else {
    }
  };
  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      backdrop="static"
      keyboard="false">
      <Modal.Body className="my-4">
        <p className="fs-5 text-danger">
          Are you sure about removing the following product?
        </p>
        <p className="fw-bold">
          {productType === 'room'
            ? productDetail.roomtype?.room_type_name +
              '-' +
              productDetail.room_number
            : productType === 'roomtype' ? productDetail.room_type_name : productDetail.name}
        </p>
        <div className="d-flex justify-content-center mt-4 mb-2">
          <div className="mx-2">
            <ReactiveButton
              buttonState="idle"
              idleText="Remove"
              color="red"
              onClick={() => handleDelete()}
            />
          </div>
          <div className="mx-2">
            <ReactiveButton
              buttonState="idle"
              idleText="Close"
              color="yellow"
              onClick={() => setShow(false)}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteProduct;
