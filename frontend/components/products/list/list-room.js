import React, { useEffect, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import DataTable, { FilterComponent } from 'react-data-table-component';
import { Container, Button, Form } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';
import parse from 'html-react-parser';

import { Icon } from '@/components/_commom/Icon';
import { listAllRoomsApi } from '@/api/products-api';
import { BDTFormat } from '../../_functions/number-format';
import { productDescriptionShortener } from '../../_functions/string-format';
import ViewProduct from '../view-product';
import EditProduct from '../edit-products';
import DeleteProduct from '../delete-product';
import AddProduct from '../add-products';

function ListRoom() {
  const [refresh, setRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [productList, setProductList] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showDeactivateProduct, setShowDeactivateProduct] = useState(false);
  const [singleProduct, setSingleProduct] = useState({});

  useEffect(() => {
    const fetchProductList = async () => {
      const allProductList = await listAllRoomsApi();
      setProductList(allProductList);
      setFilterData(allProductList);
      setIsLoading(false);
      setRefresh(false);
    };
    fetchProductList();
  }, [refresh]);

  const headerResponsive = [
    {
      name: 'ID',
      selector: (row) => row.id,
      width: '50px',
    },
    {
      name: 'Room',
      selector: (row) => row.roomtype?.room_type_name + '-' + row.room_number,
      sortable: true,
      wrap: true,
      grow: 1,
    },
    {
      name: 'Category',
      selector: (row) => row.roomtype?.room_type_name,
      sortable: true,
      wrap: true,
      grow: 1,
    },
    {
      name: 'Description',
      selector: (row) => parse(productDescriptionShortener(row.description, 5)),
      sortable: false,
      wrap: true,
      grow: 2,
    },
    {
      name: 'Price',
      grow: 1,
      selector: (row) => (
        <div>
          <div>{BDTFormat.format(row.roomtype?.price)}</div>
        </div>
      ),
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="d-flex py-1">
          <div className="reactive-button-wauto mx-1">
            <ReactiveButton
              buttonState="idle"
              idleText={<Icon nameIcon="FaEye" propsIcon={{ size: 20 }} />}
              outline
              color="secondary"
              className="rounded-1 py-1 px-1"
              onClick={() => {
                setShowDetail(true);
                setSingleProduct(row);
              }}
            />
          </div>

          <div className="reactive-button-wauto mx-1">
            <ReactiveButton
              buttonState="idle"
              idleText={<Icon nameIcon="FaEdit" propsIcon={{ size: 20 }} />}
              outline
              color="blue"
              className="rounded-1 py-1 px-1"
              onClick={() => {
                setShowEditProduct(true);
                setSingleProduct(row);
              }}
            />
          </div>

          <div className="reactive-button-wauto mx-1">
            <ReactiveButton
              buttonState="idle"
              idleText={<Icon nameIcon="FaTrashAlt" propsIcon={{ size: 20 }} />}
              outline
              color="red"
              className="rounded-1 py-1 px-1"
              onClick={() => {
                setShowDeactivateProduct(true);
                setSingleProduct(row);
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

  const handleFilter = (e) => {
    const filterTemp = productList.filter((product) => {
      if (e.target.value === '') {
        return product;
      } else if (
        (product.roomtype?.room_type_name + '-' + product.room_number)
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      )
        return product;
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
            placeholder="Enter product name/type to filter"
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
      {' '}
      <div className="d-flex justify-content-end my-3">
        <ReactiveButton
          buttonState="idle"
          idleText="Add New"
          color="blue"
          rounded
          outline
          onClick={() => {
            setShowAddProduct(true);
          }}
        />
      </div>
      <DataTable
        title="List of all rooms"
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
      <ViewProduct
        show={showDetail}
        setShow={setShowDetail}
        productDetail={singleProduct}
        productType="room"
      />
      <EditProduct
        show={showEditProduct}
        setShow={setShowEditProduct}
        productDetail={singleProduct}
        setRefresh={setRefresh}
        productType="room"
      />
      <AddProduct
        show={showAddProduct}
        setShow={setShowAddProduct}
        setRefresh={setRefresh}
        productType="room"
      />
      <DeleteProduct
        show={showDeactivateProduct}
        setShow={setShowDeactivateProduct}
        setRefresh={setRefresh}
        productDetail={singleProduct}
        productType="room"
      />
    </>
  );
}

export default ListRoom;
