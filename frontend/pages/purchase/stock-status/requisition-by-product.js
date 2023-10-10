import React from 'react';
import { Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import {
  dateStringToDate,
  datetimeStringToDate,
} from '@/components/_functions/date-functions';

const RequisitionByProduct = ({ singleItemData, showModal, setShowModal }) => {
  const headerResponsive = [
    {
      name: 'Sl',
      selector: (row, index) => index + 1,
      width: '50px',
    },
    {
      name: 'Date',
      selector: (row) => datetimeStringToDate(row.createdAt),
    },
    {
      name: 'Quantity',
      selector: (row) => row.quantity + ' ' + row.product?.unit,
    },
    {
      name: 'Requester',
      selector: (row) => row.requisition_requester?.username,
    },
  ];

  return (
    <Modal
      size="lg"
      show={showModal}
      onHide={() => {
        setShowModal(false);
      }}>
      <Modal.Header closeButton>
        <Modal.Title>
          Requisition of <b>{singleItemData[0]?.product?.name}</b> in last 60
          days
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DataTable
          columns={headerResponsive}
          data={singleItemData}
          pagination
          highlightOnHover
          striped
          responsive
          noHeader
        />
      </Modal.Body>
    </Modal>
  );
};

export default RequisitionByProduct;
