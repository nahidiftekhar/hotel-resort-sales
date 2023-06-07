import React, { useEffect, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import DataTable, { FilterComponent } from 'react-data-table-component';
import { Container, Button, Form } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';
import { useRouter } from 'next/router';

import { listAllGuestsApi } from '@/api/guest-api';
import { Icon } from '@/components/_commom/Icon';
import AddGuest from '@/components/guests/add-guest';
import EditGuest from '@/components/guests/edit-guest';
import { writeToStorage } from '@/components/_functions/storage-variable-management';
import ViewGuest from '@/components/guests/view-guest';
import axios from 'axios';

function ListAllGuests() {
  const [refresh, setRefresh] = useState(true);
  const [guestList, setGuestList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [modGuestData, setModGuestData] = useState({});
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [showModGuestModal, setShowModGuestModal] = useState(false);
  const [showViewGuestModal, setShowViewGuestModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const getListOfGuests = async () => {
      setIsLoading(true);
      const listOfGuests = await listAllGuestsApi();
      setGuestList((current) => [...listOfGuests]);
      setFilterData((current) => [...listOfGuests]);
      setIsLoading(false);
    };
    getListOfGuests();
    setRefresh(false);
  }, [refresh]);

  const addGuestModalOpener = () => setShowAddGuestModal(true);

  const handleAddBookingForGuest = (guestId) => {
    const res = writeToStorage(String(guestId), 'GUEST_KEY');
    if (res) router.push('/booking/add-booking');
    else return false;
  };

  const headerResponsive = [
    {
      name: 'ID',
      selector: (row) => row.id,
      width: '50px',
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      grow: 2,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Phone',
      selector: (row) => row.phone,
      grow: 2,
      sortable: false,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      wrap: true,
      sortable: true,
    },
    {
      name: 'Identity Card',
      selector: (row) => `${row.id_type}- ${row.id_number}`,
      grow: 2,
      wrap: true,
      sortable: true,
    },
    {
      name: 'Actions',
      grow: 2,
      cell: (row) => (
        <div>
          <Button
            size="sm"
            variant="success"
            className="mx-1 py-1 px-md-2 px-1 d-inline-flex align-items-center"
            onClick={() => handleAddBookingForGuest(row.id)}>
            <Icon nameIcon="FaRegBookmark" propsIcon={{ size: 12 }} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="mx-1 py-1 px-md-2 px-1 d-inline-flex align-items-center"
            onClick={() => {
              setShowModGuestModal(true);
              setModGuestData(row);
            }}>
            <Icon nameIcon="FaEdit" propsIcon={{ size: 12 }} />
          </Button>
          <Button
            size="sm"
            variant="dark"
            className="mx-1 py-1 px-md-2 px-1 d-inline-flex align-items-center"
            onClick={() => {
              setShowViewGuestModal(true);
              setModGuestData(row);
            }}>
            <Icon nameIcon="FaEye" propsIcon={{ size: 12 }} />
          </Button>
        </div>
      ),
    },
  ];

  const paginationComponentOptions = {
    selectAllRowsItem: true,
  };

  const handleFilter = (e) => {
    const filterTemp = guestList.filter((guest) => {
      if (e.target.value === '') {
        return guest;
      } else if (
        guest.email?.toLowerCase().includes(e.target.value.toLowerCase()) ||
        guest.phone.toLowerCase().includes(e.target.value.toLowerCase()) ||
        guest.id_number.toLowerCase().includes(e.target.value.toLowerCase()) ||
        guest.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
        return guest;
    });
    setFilterData((current) => [...filterTemp]);
  };

  const subHeaderComponent = () => {
    return (
      <Form className="w-50">
        <Form.Group className="mb-3" controlId="searchString">
          <Form.Control
            size="sm"
            type="text"
            placeholder="Enter name/email/phone/ID number to filter"
            onChange={(e) => handleFilter(e)}
          />
        </Form.Group>
      </Form>
    );
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-70">
        <PropagateLoader color="#0860ae" size={10} />
      </Container>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-end mt-4">
        <ReactiveButton
          buttonState="idle"
          idleText={
            <div className="d-flex align-items-center">
              <span className="me-2">Add New Guest </span>
              <Icon nameIcon="BiUserPlus" propsIcon={{}} />
            </div>
          }
          color="blue"
          onClick={addGuestModalOpener}
        />
      </div>
      <DataTable
        title="List of all registered guests"
        columns={headerResponsive}
        data={filterData}
        pagination
        paginationComponentOptions={paginationComponentOptions}
        defaultSortFieldId={1}
        subHeader
        subHeaderComponent={subHeaderComponent()}
        responsive
        striped
        dense
      />

      <AddGuest
        show={showAddGuestModal}
        setShow={setShowAddGuestModal}
        setRefresh={setRefresh}
      />

      <EditGuest
        show={showModGuestModal}
        setShow={setShowModGuestModal}
        setRefresh={setRefresh}
        modGuestData={modGuestData}
        setModGuestData={setModGuestData}
      />

      <ViewGuest
        show={showViewGuestModal}
        setShow={setShowViewGuestModal}
        setRefresh={setRefresh}
        modGuestData={modGuestData}
        setModGuestData={setModGuestData}
      />
    </>
  );
}

export default ListAllGuests;
