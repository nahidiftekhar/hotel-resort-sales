import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Modal } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';
import { datetimeStringToDate } from '@/components/_functions/string-format';
import { Icon } from '@/components/_commom/Icon';
import PrModal from '@/components/purchase/add-pr-modal';
import ProcessPr from '@/components/purchase/process-pr';
import { Export, downloadCSV } from '@/components/_functions/table-export';

const ItemPurchase = ({ session }) => {
  const [allRequisitions, setAllRequisitions] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openProcessModal, setOpenProcessModal] = useState(false);
  const [requisitionStatus, setRequisitionStatus] = useState('pendingApproval');
  const [refresh, setRefresh] = useState(false);
  const [buttonState, setButtonState] = useState('idle');
  const [currentItem, setCurrentItem] = useState({});

  useEffect(() => {
    const fetchProductCategories = async () => {
      setButtonState('loading');
      const productCategories = await axios.post('/api/purchase/pr/list', {
        status: requisitionStatus,
      });
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
      name: 'PR Date',
      selector: (row) => (
        <p className="smaller-label">{datetimeStringToDate(row.createdAt)}</p>
      ),
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
      name: 'Budget',
      selector: (row) => row.price,
      grow: 1,
    },
    {
      name: 'Cost',
      selector: (row) => row.actual_cost || '-',
      grow: 1,
    },
    {
      name: 'Notes',
      selector: (row) =>
        row.notes ? (
          <div>
            {row.notes.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line === 'null' ? '-' : line}
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
          <p className="my-1">{row.purchase_requester?.username}</p>
          <p className="smaller-label my-1">
            {row.purchase_requester?.usertype?.user_type}
          </p>
        </div>
      ),
      grow: 2,
      wrap: true,
    },
    {
      name: 'Approved by',
      selector: (row) =>
        row.purchase_approver ? (
          <div>
            <p className="my-1">{row.purchase_approver?.username}</p>
            <p className="smaller-label my-1">
              {row.purchase_approver?.usertype?.user_type}
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

  const exportFileArray = allRequisitions.map((item) => {
    return {
      ate: `"${datetimeStringToDate(item.createdAt)}"` || '-',
      tem: `"${item.product?.name}"` || '-',
      uantity: `"${item.quantity + ' ' + item.product?.unit}"` || '-',
      rice: `"${item.price}"` || '-',
      otes: `"${item.notes}"` || '-',
      equester: `"${item.purchase_requester?.username}"` || '-',
      equesterept: `"${item.purchase_requester?.usertype?.user_type}"` || '-',
      pprover: `"${item.purchase_approver?.username}"` || '-',
      pproverept: `"${item.purchase_approver?.usertype?.user_type}"` || '-',
    };
  });

  // const actionsMemo = useMemo(
  //   () => (
  //     <Export
  //       onExport={() => downloadCSV(exportFileArray, 'Purchase Requisitions')}
  //     />
  //   ),
  //   [exportFileArray]
  // );

  const paginationComponentOptions = {
    selectAllRowsItem: true,
  };

  const subHeaderComponent = () => {
    return (
      <div className="d-flex justify-content-between">
        <div className="mx-1 reactive-button-wauto">
          <ReactiveButton
            buttonState={buttonState}
            color="secondary"
            idleText="Pending"
            onClick={() => {
              setRequisitionStatus('pendingApproval');
            }}
            disabled={requisitionStatus === 'pendingApproval' ? true : false}
          />
        </div>

        <div className="mx-1 reactive-button-wauto">
          <ReactiveButton
            buttonState={buttonState}
            color="secondary"
            idleText="Approved"
            onClick={() => {
              setRequisitionStatus('approved');
            }}
            disabled={requisitionStatus === 'approved' ? true : false}
            className="mx-0"
          />
        </div>

        <div className="mx-1 reactive-button-wauto">
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

        <div className="mx-1 reactive-button-wauto">
          <ReactiveButton
            buttonState={buttonState}
            color="secondary"
            idleText="Released"
            onClick={() => {
              setRequisitionStatus('released');
            }}
            disabled={requisitionStatus === 'purchased' ? true : false}
          />
        </div>

        <div className="mx-1 reactive-button-wauto">
          <ReactiveButton
            buttonState={buttonState}
            color="secondary"
            idleText="Purchased"
            onClick={() => {
              setRequisitionStatus('purchased');
            }}
            disabled={requisitionStatus === 'purchased' ? true : false}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1>Purchase Requests</h1>
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
        title={`List of all ${requisitionStatus} purchase requests`}
        columns={headerResponsive}
        data={allRequisitions}
        subHeader
        subHeaderComponent={subHeaderComponent()}
        // actions={actionsMemo}
        pagination
        paginationComponentOptions={paginationComponentOptions}
        defaultSortFieldId={1}
        responsive
        striped
        dense
      />

      <div className="w-100 d-flex justify-content-end">
        <Export
          onExport={() => downloadCSV(exportFileArray, 'Purchase Requisitions')}
        />
      </div>

      <Modal
        show={openAddModal}
        onHide={() => setOpenAddModal(false)}
        size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Item Requisition</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PrModal
            setOpenModal={setOpenAddModal}
            setRefresh={setRefresh}
            userId={session.user.id}
          />
        </Modal.Body>
      </Modal>

      <ProcessPr
        openProcessModal={openProcessModal}
        setOpenProcessModal={setOpenProcessModal}
        currentItem={currentItem}
        user={session.user}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default ItemPurchase;
