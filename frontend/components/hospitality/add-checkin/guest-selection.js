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

function GuestSelection({ setSelectedGuests, selectedGuests, setShow }) {
  const [refresh, setRefresh] = useState(true);
  const [guestList, setGuestList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
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

  const headerResponsive = [
    {
      name: 'ID',
      selector: (row) => row.id,
      grow: 1,
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
      grow: 2,
    },
    {
      name: 'Phone',
      selector: (row) => row.phone,
      sortable: false,
      grow: 2,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      wrap: true,
      sortable: true,
      grow: 2,
    },
    {
      name: 'Identity Card',
      selector: (row) => `${row.id_type}- ${row.id_number}`,
      wrap: true,
      sortable: true,
      grow: 2,
    },
    {
      name: 'Actions',
      grow: 1,
      cell: (row) => (
        <div className="reactive-button-wauto">
          <ReactiveButton
            buttonState="idle"
            rounded
            outline
            color="dark"
            idleText={<Icon nameIcon="FaUserCheck" propsIcon={{}} />}
            className="px-2 py-1"
            onClick={() => {
              setSelectedGuests([...selectedGuests, row]);
              setShow(false);
            }}
          />
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
    </>
  );
}

export default GuestSelection;
