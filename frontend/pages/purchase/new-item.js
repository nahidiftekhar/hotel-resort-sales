import { useState, useEffect } from 'react';
import {
  CustomSelect,
  CustomTextInput,
} from '@/components/_commom/form-elements';
import { Formik } from 'formik';
import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';
import axios from 'axios';

const NewItem = () => {
  const [productCategories, setProductCategories] = useState([]);
  const [productSubCategories, setProductSubCategories] = useState([]);
  const [productToAdd, setProductToAdd] = useState({});

  useEffect(() => {
    const fetchProductCategories = async () => {
      const productCategories = await axios.get(
        '/api/purchase/list-all-categories'
      );
      setProductCategories(productCategories.data);
    };
    fetchProductCategories();
  }, []);

  const handleSubmit = async (values) => {
    const res = await axios.post('/api/purchase/add-new-item', values);
    if (!res.data.success) {
      alert(res.data.message);
      return;
    } else {
      alert(
        'Item Added Successfully. You may now add requisition for this item.'
      );
    }
  };

  return (
    <div className="custom-form">
      <Formik
        initialValues={{
          name: '',
          unit: '',
          productCategory: 0,
          productSubCategory: 0,
        }}
        // validationSchema={validationRules}
        onSubmit={(values) => handleSubmit(values)}>
        {(formik) => {
          const { values } = formik;
          return (
            <Form className="custom-form arrow-hidden">
              <Row>
                <Col md={6}>
                  <div className="my-2">
                    <CustomSelect
                      label="Select Category"
                      name="productCategory"
                      value={values.productCategory}
                      onChange={(e) => {
                        formik.handleChange(e);
                        setProductToAdd({
                          ...productToAdd,
                          category_id: e.target.value,
                        });
                        setProductSubCategories(
                          e.target.value > 0
                            ? productCategories.find(
                                (category) =>
                                  category.id === parseInt(e.target.value)
                              ).productsubcategories
                            : []
                        );
                      }}>
                      <option value={0}>Select Category</option>
                      {productCategories?.map(({ id, category }) => (
                        <option key={id} value={id}>
                          {category}
                        </option>
                      ))}
                    </CustomSelect>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="my-2">
                    <CustomSelect
                      label="Select Subcategory"
                      name="productSubCategory"
                      value={values.productSubCategory}
                      disabled={productSubCategories.length === 0}
                      onChange={(e) => {
                        formik.handleChange(e);
                        setProductToAdd({
                          ...productToAdd,
                          subcategory_id: e.target.value,
                        });
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
                    <CustomTextInput
                      label="Name of Item"
                      name="name"
                      type="text"
                      placeholder="Item Name"
                    />
                  </div>
                </Col>

                <Col md={6}>
                  <div className="my-2">
                    <CustomTextInput
                      label="Measurement Unit"
                      name="unit"
                      type="text"
                      placeholder="KG/Litre/Piece"
                    />
                  </div>
                </Col>
              </Row>
              <div className="d-flex justify-content-center my-2">
                <ReactiveButton
                  buttonState="idle"
                  idleText="Submit"
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
  );
};

export default NewItem;
