import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  OverlayTrigger,
  Tooltip,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { PropagateLoader } from "react-spinners";
import DataTable, { FilterComponent } from "react-data-table-component";

import authorizeAccess from "@/api/auth-api";
import { listAllCardApi } from "@/api/card-api";
import { Icon } from "@/components/_App/Icon";
import { downloadExcel } from "@/components/functions/helpers";

//Set the user role that should have access to this page
const userAccessRole = 1;

function ViewCards() {
  const [accessGranted, setAccessGranted] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [cardData, setCardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const headerResponsive = [
    {
      name: "Card ID",
      selector: (row) => row.card_link,
      sortable: true,
    },
    {
      name: "Order Reference",
      selector: (row) => row.order_reference,
      sortable: false,
    },
    {
      name: "Order Email",
      selector: (row) => row.order_email,
      wrap: true,
      sortable: false,
    },
    {
      name: "Registered Email",
      selector: (row) =>
        row.registered_email === "_default" ? "-" : row.registered_email,
      wrap: true,
      sortable: false,
    },
    {
      name: "Card Status",
      id: "isBlocked",
      selector: (filteredData) => (
        <OverlayTrigger
          overlay={
            <Tooltip id="tooltip-disabled">
              {filteredData.is_blocked
                ? "Blocked by admin"
                : filteredData.is_confirmed
                ? "Active"
                : `Activation pending`}
            </Tooltip>
          }
        >
          <span className="d-inline-block">
            {filteredData.is_blocked ? (
              <Icon nameIcon="BiBlock" propsIcon={{ size: 24, color: "red" }} />
            ) : filteredData.is_confirmed ? (
              <Icon
                nameIcon="BiCheckCircle"
                propsIcon={{ size: 24, color: "green" }}
              />
            ) : (
              <Icon
                nameIcon="BiNoEntry"
                propsIcon={{ size: 24, color: "orange" }}
              />
            )}
          </span>
        </OverlayTrigger>
      ),
      sortable: false,
    },

    {
      name: "Actions",
      cell: (filteredData) => (
        <div>
          <a href={`/admin/card-details?cardLink=${filteredData.card_link}`}>
              <Button size="sm" variant="outline-secondary" className="mx-1 py-0 d-inline-flex align-items-center rounded">
                <Icon nameIcon="AiFillEye" propsIcon={{size: 20 }} />
              </Button>
          </a>
          <a href={`/admin/edit-card?cardLink=${filteredData.card_link}`}>
              <Button size="sm" variant="outline-warning" className="mx-1 py-0 d-inline-flex align-items-center rounded">
                <Icon nameIcon="AiFillEdit" propsIcon={{size: 20 }} />
              </Button>
          </a>
        </div>
      ),
    },
  ];

  const paginationComponentOptions = {
    selectAllRowsItem: true,
  };

  const accessRule = async () => {
    const authResult = await authorizeAccess(userAccessRole);
    setAccessGranted(authResult.success);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const GetAllCards = async () => {
    const cardDataTemp = await listAllCardApi();
    setCardData(cardDataTemp);
    setFilteredData(cardDataTemp);
  };

  const handleFilter = (e) => {
    const filterTemp = cardData.filter((singleCard) => {
      if (e.target.value === "") {
        return cardData;
      } else if (
        singleCard.card_link
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        singleCard.order_reference
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        singleCard.order_email
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        singleCard.registered_email
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      )
        return singleCard;
    });
    setFilteredData(filterTemp);
  };

  const subHeaderComponent = () => {
    return (
      <Form className="w-50">
        <Form.Group className="mb-3" controlId="searchString">
          <Form.Control
            size="sm"
            type="text"
            placeholder="Enter email/card ID/order reference to filter"
            onChange={(e) => handleFilter(e)}
          />
        </Form.Group>
      </Form>
    );
  };

  const handleDownloadExcel = () => {
    downloadExcel(filteredData, "SMART_TAPS_CARDS", "CARD_EXPORT")  
};


  useEffect(() => {
    accessRule();
    GetAllCards();
  }, []);

  if (accessGranted === 100 || isLoading)
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-70">
        <PropagateLoader color="#0860ae" size={10} />
      </Container>
    );

  if (!cardData)
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center min-vh-70">
        <h4 className="my-4">Nothing found</h4>
        <PropagateLoader color="#0860ae" size={10} />
      </Container>
    );

  return (
    <Container fluid className="min-vh-70">
      {accessGranted ? (
        <div>
          <Button type={'button'} variant="secondary" className="btn-sm float-end m-2" text="Excel" onClick={handleDownloadExcel}>Download</Button>
          <DataTable
            title="List of all cards"
            columns={headerResponsive}
            data={filteredData}
            pagination
            paginationComponentOptions={paginationComponentOptions} 
            defaultSortFieldId={1}
            subHeader
            subHeaderComponent={subHeaderComponent()}
            persistTableHead
          />
        </div>
      ) : (
        <div>You do not have access to this content </div>
      )}
    </Container>
  );
}

export default ViewCards;
