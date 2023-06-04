import React, { useEffect, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import DataTable, { FilterComponent } from 'react-data-table-component';
import { Container, Button, Form } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';
import { useRouter } from 'next/router';
import { listOngoingVisitsApi } from '@/api/visit-api';
import { Icon } from '@/components/_commom/Icon';

function ListAllVisits() {
  const [refresh, setRefresh] = useState(true);
  const [visitsList, setVisitsList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [modGuestData, setModGuestData] = useState({});
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [showModGuestModal, setShowModGuestModal] = useState(false);
  const [showViewGuestModal, setShowViewGuestModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const getListOfVisits = async () => {
      setIsLoading(true);
      const listOfVisitsTemp = await listOngoingVisitsApi();
      setVisitsList([...listOfVisitsTemp]);
      setFilterData([...listOfVisitsTemp]);
      setIsLoading(false);
    };
    getListOfVisits();
    setRefresh(false);
  }, []);

  const headerResponsive = [
    {
      name: 'Room',
      selector: (row) => row.room_number,
      sortable: true,
      grow: 1,
    },
    {
      name: 'Guest',
      selector: (row) => (
        <div>
          <p className="my-1 fw-bold">{row.guest?.name}</p>
          <p className="my-1 ">{row.guest?.phone}</p>
          <p className="my-1 ">{row.guest?.email}</p>
          <p className="my-1 ">{`${row.guest?.id_type}-${row.guest?.id_number}`}</p>
          <p className="my-1 ">{row.guest?.address}</p>
        </div>
      ),
      sortable: false,
      wrap: true,
      grow: 3,
    },
    {
      name: 'Additional Guest',
      selector: (row) =>
        row.otherGuests.map(
          (guest, index) =>
            index > 0 && (
              <div key={index} className="mb-3">
                <p className="my-1 fw-bold">{guest.name}</p>
                <p className="my-1 ">{guest.phone}</p>
                <p className="my-1 ">{guest.email}</p>
                <p className="my-1 ">{`${guest.id_type}-${guest.id_number}`}</p>
              </div>
            )
        ),
      wrap: true,
      grow: 3,
    },
    {
      name: 'Check-in Date',
      selector: (row) => row.checkin_date,
      sortable: true,
      grow: 2,
    },
    {
      name: 'Check-out Date',
      selector: (row) => row.checkout_date,
      sortable: true,
      grow: 2,
    },
    {
      name: 'Actions',
      grow: 2,
      cell: (row) => (
        <a href={`/hospitality/view-visit?id=${row.id}`}>
          <div className="reactive-button-wauto mx-1">
            <ReactiveButton
              buttonState="idle"
              color="dark"
              idleText={<Icon nameIcon="FaEye" propsIcon={{ size: 24 }} />}
              className="rounded-1 py-2 px-3"
            />
          </div>
        </a>
      ),
    },
  ];

  const paginationComponentOptions = {
    selectAllRowsItem: true,
  };

  const handleFilter = (e) => {
    const filterTemp = visitsList.filter((visit) => {
      if (e.target.value === '') {
        return visit;
      } else if (
        visit.guest?.email
          ?.toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        visit.guest?.phone
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        visit.guest?.id_number
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        visit.guest?.name
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        visit.room_number.toLowerCase().includes(e.target.value.toLowerCase())
      )
        return visit;
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
            placeholder="Enter guest's name/email/phone/room number to filter"
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
      <DataTable
        title="List of existing guests"
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
    </>
  );
}

export default ListAllVisits;
