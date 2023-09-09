import axios from 'axios';
import { Modal } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import ReactiveButton from 'reactive-button';
import RequisitionModal from '@/components/purchase/add-requisition-modal';
import { datetimeStringToDate } from '@/components/_functions/string-format';
import ProcessRequisition from '@/components/purchase/process-requisition';
import { Icon } from '@/components/_commom/Icon';

const ItemRequisition = ({ session }) => {
  const [allRequisitions, setAllRequisitions] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openProcessModal, setOpenProcessModal] = useState(false);
  const [requisitionStatus, setRequisitionStatus] = useState('pending');
  const [refresh, setRefresh] = useState(false);
  const [buttonState, setButtonState] = useState('idle');
  const [currentItem, setCurrentItem] = useState({});

  useEffect(() => {
    const fetchProductCategories = async () => {
      setButtonState('loading');
      const productCategories = await axios.post(
        '/api/purchase/requisitions/list',
        {
          status: requisitionStatus,
        }
      );
      setAllRequisitions(productCategories.data);
      setRefresh(false);
      setButtonState('idle');
    };
    fetchProductCategories();
  }, [requisitionStatus, refresh]);

  const headerResponsive = [
    {
      name: 'Sl',
      selector: (row, index) => index + 1,
      width: '50px',
    },
    {
      name: 'Requisition Date',
      selector: (row) => datetimeStringToDate(row.createdAt),
      grow: 1,
      wrap: true,
    },
    {
      name: 'Item Name',
      selector: (row) => row.product?.name,
      grow: 2,
      wrap: true,
    },
    {
      name: 'Quantity',
      selector: (row) => row.quantity + ' ' + row.product?.unit,
      grow: 1,
    },
    {
      name: 'Notes',
      selector: (row) =>
        row.notes ? (
          <div>
            {row.notes.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
        ) : (
          '-'
        ),
      wrap: true,
      grow: 2,
    },
    {
      name: 'Requested by',
      selector: (row) => (
        <div>
          <p className="my-1">{row.requisition_requester?.username}</p>
          <p className="smaller-label my-1">
            {row.requisition_requester?.usertype?.user_type}
          </p>
        </div>
      ),
      grow: 2,
      wrap: true,
    },
    {
      name: 'Fullfilled by',
      selector: (row) =>
        row.requisition_approver ? (
          <div>
            <p className="my-1">{row.requisition_approver?.username}</p>
            <p className="smaller-label my-1">
              {row.requisition_approver?.usertype?.user_type}
            </p>
          </div>
        ) : (
          '-'
        ),
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="my-1 d-flex">
          <div className="reactive-button-wauto mx-1">
            <ReactiveButton
              buttonState="idle"
              idleText={<Icon nameIcon="FaEdit" propsIcon={{ size: 14 }} />}
              outline
              color="indigo"
              className="rounded-1 py-1 px-2"
              onClick={() => {
                setOpenProcessModal(true);
                setCurrentItem(row);
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  const paginationComponentOptions = {
    selectAllRowsItem: true,
  };

  const subHeaderComponent = () => {
    return (
      <div className="d-flex justify-content-between">
        <div className="mx-1">
          <ReactiveButton
            buttonState={buttonState}
            color="secondary"
            idleText="Pending"
            onClick={() => {
              setRequisitionStatus('pending');
            }}
            disabled={requisitionStatus === 'pending' ? true : false}
          />
        </div>

        <div className="mx-1">
          <ReactiveButton
            buttonState={buttonState}
            color="secondary"
            idleText="Rejected"
            onClick={() => {
              setRequisitionStatus('rejected');
            }}
            disabled={requisitionStatus === 'rejected' ? true : false}
          />
        </div>

        <div className="mx-1">
          <ReactiveButton
            buttonState={buttonState}
            color="secondary"
            idleText="Fullfilled"
            onClick={() => {
              setRequisitionStatus('fullfilled');
            }}
            disabled={requisitionStatus === 'fullfilled' ? true : false}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1>Item Requisition</h1>
      <div className="d-flex justify-content-end">
        <ReactiveButton
          buttonState="idle"
          color="indigo"
          idleText="Add New"
          rounded
          onClick={() => {
            setOpenAddModal(true);
          }}
        />
      </div>
      <DataTable
        title={`List of all ${requisitionStatus} item requisitions`}
        columns={headerResponsive}
        data={allRequisitions}
        subHeader
        subHeaderComponent={subHeaderComponent()}
        pagination
        paginationComponentOptions={paginationComponentOptions}
        defaultSortFieldId={1}
        responsive
        striped
        dense
      />

      <Modal
        show={openAddModal}
        onHide={() => setOpenAddModal(false)}
        size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Item Requisition</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RequisitionModal
            setOpenModal={setOpenAddModal}
            setRefresh={setRefresh}
            userId={session.user.id}
          />
        </Modal.Body>
      </Modal>

      <ProcessRequisition
        openProcessModal={openProcessModal}
        setOpenProcessModal={setOpenProcessModal}
        currentItem={currentItem}
        user={session.user}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default ItemRequisition;
