import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Col, Row, Alert } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import { CustomSelect, CustomTextInput } from '../_commom/form-elements';
import ReactiveButton from 'reactive-button';

const RequisitionModal = ({ setOpenModal, setRefresh, userId }) => {
  const [productCategories, setProductCategories] = useState([]);
  const [productSubCategories, setProductSubCategories] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const fetchProductCategories = async () => {
      const productSubCategories = await axios.get(
        '/api/purchase/list-all-categories'
      );
      // setProductCategories(productCategories.data);
      setProductSubCategories(productSubCategories.data);
    };

    const fetchAllItems = async () => {
      const allItemsRes = await axios.get('/api/purchase/list-all-items');
      setAllItems(
        allItemsRes.data.map((obj) => {
          return { ...obj, value: obj.id, label: obj.name };
        })
      );
      setFilteredItems(
        allItemsRes.data.map((obj) => {
          return { ...obj, value: obj.id, label: obj.name };
        })
      );
    };

    fetchProductCategories();
    fetchAllItems();
  }, []);

  const handleSubmit = async (values) => {
    if (!values.productId || !values.quantity) {
      alert('Please select an item and quantity.');
      return;
    }
    const res = await axios.post('/api/purchase/requisitions/add', {
      ...values,
      userId,
    });
    if (!res.data.success) {
      alert(res.data.message);
      return;
    } else {
      alert('Requisition added successfully.');
      setOpenModal(false);
      setRefresh(true);
    }
  };

  return (
    <div>
      <div className="custom-form">
        <Formik
          initialValues={{
            name: '',
            unit: '',
            productCategory: 0,
            productSubCategory: 0,
            productId: 0,
          }}
          // validationSchema={validationRules}
          onSubmit={(values) => handleSubmit(values)}>
          {(formik) => {
            const { values, setValues } = formik;
            return (
              <Form className="custom-form arrow-hidden">
                <Row>
                  <Col md={6}>
                    <div className="my-2">
                      <CustomSelect
                        label="Select Subcategory"
                        name="productSubCategory"
                        value={values.productSubCategory}
                        // disabled={productSubCategories.length === 0}
                        onChange={(e) => {
                          formik.handleChange(e);
                          setFilteredItems(
                            e.target.value > 0
                              ? allItems.filter(
                                  (item) =>
                                    item.subcategory_id ===
                                    parseInt(e.target.value)
                                )
                              : allItems
                          );
                        }}>
                        <option value={0}>Select Subcategory</option>
                        {productSubCategories?.map(({ id, subcategory }) => (
                          <option key={id} value={id}>
                            {subcategory}
                          </option>
                        ))}
                      </CustomSelect>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="my-2">
                      <label>Select Item</label>
                      <Select
                        name="productId"
                        options={filteredItems}
                        onChange={(obj) => {
                          setValues({
                            ...values,
                            productId: obj.value,
                          });
                        }}
                      />
                    </div>
                  </Col>

                  <Col
                    md={6}
                    className="d-flex justify-content-between align-items-center">
                    <div className="my-2 flex-grow-1">
                      <CustomTextInput
                        label="Required Quantity"
                        name="quantity"
                        type="number"
                        min={0}
                        placeholder="Quantity"
                      />
                    </div>
                    <div className="align-self-end my-2 d-flex justify-content-between align-items-end">
                      <p className="text-secondary mx-1 mb-1">
                        {values.productId
                          ? allItems.find(
                              (item) => item.id === parseInt(values.productId)
                            )?.unit || 'unit'
                          : 'unit'}
                      </p>
                    </div>
                  </Col>

                  <Col md={12}>
                    <div className="my-2">
                      <CustomTextInput
                        label="Notes"
                        name="notes"
                        type="text"
                        placeholder="Notes"
                      />
                    </div>
                  </Col>
                </Row>
                <div className="d-flex justify-content-center my-2">
                  <ReactiveButton
                    buttonState="idle"
                    idleText="Add Requisition"
                    color="blue"
                    type="button"
                    onClick={() => {
                      handleSubmit(values);
                    }}
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default RequisitionModal;
