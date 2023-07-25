import React from 'react';
import { Modal } from 'react-bootstrap';
import ViewPackages from './view/view-package';
import ViewPrixfixe from './view/view-prixfixe';
import ViewAlacarte from './view/view-alacarte';
import ViewRoom from './view/view-room';
import ViewService from './view/view-service';
import ViewRoomType from './view/view-room-type';

function ViewProduct({ show, setShow, productDetail, productType }) {
  return (
    <Modal show={show} size="lg" onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title className="text-muted">
          {productType === 'room'
            ? productDetail.roomtype?.room_type_name +
              '-' +
              productDetail.room_number
            : productDetail.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {(() => {
          switch (productType) {
            case 'package':
              return <ViewPackages productDetail={productDetail} />;

            case 'prixfixe':
              return <ViewPrixfixe productDetail={productDetail} />;

            case 'alacarte':
              return <ViewAlacarte productDetail={productDetail} />;

            case 'room':
              return <ViewRoom productDetail={productDetail} />;

            case 'roomtype':
              return <ViewRoomType productDetail={productDetail} />;

            case 'service':
              return <ViewService productDetail={productDetail} />;

            default:
              return <div className="error-message">Something went wrong</div>;
          }
        })()}
      </Modal.Body>
    </Modal>
  );
}

export default ViewProduct;
