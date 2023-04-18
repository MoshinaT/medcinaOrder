import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { createProductBatch, deleteAllProduct} from './apiAdmin';
import ExcelPage from './ExcelPage';
import {  Button, Row, Col  } from "reactstrap";

const AddProductBatch = () => {
  const [values, setValues] = useState({
    loading: false,
    error: '',
    createdProduct: '',
    redirectToProfile: false,
    formData: '',
  });

  const { user, token } = isAuthenticated();

  const {
    loading,
    error,
    createdProduct,
    redirectToProfile,
    formData,
  } = values;

  // load categories and set form data
  const init = () => {
   
        setValues({
          ...values,
          formData: new FormData(),
        });
      
  };

  useEffect(() => {
    init();
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = (val) => {
   // console.log("val",val);
   // event.preventDefault();
    setValues({ ...values, error: '', loading: true });
    formData.set("files", JSON.stringify(val));

    createProductBatch(user._id, token,formData ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          loading: false,
          createdProduct: 'All product',
        });
      }
    });
  };

  const showError = () => (
    <div
      className='alert alert-danger'
      style={{ display: error ? '' : 'none' }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
    className='alert alert-info'
    style={{ display: createdProduct ? '' : 'none' }}
  >
    <h2>Success</h2>
  </div>
  );

  const showLoading = () =>
    loading && (
      <div className='alert alert-success'>
        <h2>Loading...</h2>
      </div>
    );

    
  const handleDeleteAll = () => {
    deleteAllProduct(user._id, token ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          loading: false,
          createdProduct: 'Data sheet',
        });
      }
    });
  };
    
  return (

    <Layout
      title='Add a new product'
      description={`Hey ${user.name}, ready to add a new product?`}
    >
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {showLoading()}
          {showSuccess()}
          {showError()}
          {/* <Row>
          <Col>
          <Button
                  onClick={handleDeleteAll}
                  size="large"
                  color="danger"
                  style={{ marginBottom: 16 }}
                >
                  Delete existing products
                </Button>
                </Col>
        
        </Row> */}
    <ExcelPage clickSubmit={clickSubmit}/>
        </div>
      </div>
    </Layout>
  );
};

export default AddProductBatch;
