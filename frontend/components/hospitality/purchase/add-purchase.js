import React from 'react';
import { Modal } from 'react-bootstrap';

import { camelCaseToCapitalizedString } from '@/components/_functions/string-format';
import AddPrefixe from './add-prixfixe';
import AddAlacarte from './add-alacarte';
import AddRoom from './add-room';
import AddService from './add-service';
import AddPackage from './add-package';

function AddPurchase({ show, setShow, componentType, visitId, setRefresh }) {
  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      backdrop="static"
      keyboard={false}
      size="xl">
      <Modal.Header className="py-2" closeButton>
        <Modal.Title>
          <h5>
            Purchase record: {camelCaseToCapitalizedString(componentType)} item
          </h5>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {(() => {
          switch (componentType) {
            case 'prixfixe':
              return (
                <AddPrefixe
                  componentType={componentType}
                  visitId={visitId}
                  setRefresh={setRefresh}
                  setShow={setShow}
                />
              );
            case 'alacarte':
              return (
                <AddAlacarte
                  componentType={componentType}
                  visitId={visitId}
                  setRefresh={setRefresh}
                  setShow={setShow}
                />
              );

            case 'room':
              return (
                <AddRoom
                  componentType={componentType}
                  visitId={visitId}
                  setRefresh={setRefresh}
                  setShow={setShow}
                />
              );

            case 'service':
              return (
                <AddService
                  componentType={componentType}
                  visitId={visitId}
                  setRefresh={setRefresh}
                  setShow={setShow}
                />
              );

            case 'package':
              return (
                <AddPackage
                  componentType={componentType}
                  visitId={visitId}
                  setRefresh={setRefresh}
                  setShow={setShow}
                />
              );

            default:
              return <div className="error-message">Something went wrong</div>;
          }
        })()}
      </Modal.Body>
    </Modal>
  );
}

export default AddPurchase;
