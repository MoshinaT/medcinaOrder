import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link, Redirect } from 'react-router-dom';
import { getProduct, updateProduct } from './apiAdmin';

const UpdateProduct = ({ match }) => {
  const [values, setValues] = useState({
    name: '',
    manufacturer: '',
    expiry: '',
    quantity: '',
    mrp: '',
    offer: '',
    loading: false,
    error: '',
    createdProduct: '',
    redirectToProfile: false,
    formData: '',
  });

  const { user, token } = isAuthenticated();
  const {
    name,
    manufacturer,
    expiry,
    quantity,
    mrp,
    offer,
    loading,
    error,
    createdProduct,
    redirectToProfile,
    formData,
  } = values;

  const init = (productId) => {
    getProduct(productId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        // populate the state
        setValues({
          ...values,
          name: data.name,
          manufacturer: data.manufacturer,
          expiry: data.expiry,
          quantity: data.quantity,
          mrp: data.mrp,
          offer: data.offer,
          formData: new FormData(),
        });
      }
    });
  };



  useEffect(() => {
    init(match.params.productId);
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: '', loading: true });

    updateProduct(match.params.productId, user._id, token, formData).then(
      (data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: '',
            manufacturer: '',
            expiry: '',
            quantity: '',
            mrp: '',
            offer: '',
            loading: false,
            error: false,
            redirectToProfile: true,
            createdProduct: data.name,

           
          });
        }
      }
    );
  };

  const newPostForm = () => (
    <form className='mb-3' onSubmit={clickSubmit}>
      <h4>Post Photo</h4>
      <div className='form-group'>
        <label className='btn btn-secondary'>
          <input
            onChange={handleChange('photo')}
            type='file'
            name='photo'
            accept='image/*'
          />
        </label>
      </div>

      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input
          onChange={handleChange('name')}
          type='text'
          className='form-control'
          value={name}
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Manufacturer</label>
        <textarea
          onChange={handleChange('manufacturer')}
          className='form-control'
          value={manufacturer}
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Expiry</label>
        <input
          onChange={handleChange('expiry')}
          type='number'
          className='form-control'
          value={expiry}
        />
      </div>


      <div className='form-group'>
        <label className='text-muted'>Quantity</label>
        <input
          onChange={handleChange('quantity')}
          type='number'
          className='form-control'
          value={quantity}
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>MRP</label>
        <input
          onChange={handleChange('mrp')}
          type='number'
          className='form-control'
          value={mrp}
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Offer</label>
        <input
          onChange={handleChange('offer')}
          type='number'
          className='form-control'
          value={offer}
        />
      </div>

      <button className='btn btn-outline-primary'>Update Product</button>
    </form>
  );

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
      <h2>{`${createdProduct}`} is updated!</h2>
    </div>
  );

  const showLoading = () =>
    loading && (
      <div className='alert alert-success'>
        <h2>Loading...</h2>
      </div>
    );

  const redirectUser = () => {
    if (redirectToProfile) {
      if (!error) {
        return <Redirect to='/' />;
      }
    }
  };

  return (
    <Layout
      title='Add a new product'
      description={`G'day ${user.name}, ready to add a new product?`}
    >
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {showLoading()}
          {showSuccess()}
          {showError()}
          {newPostForm()}
          {redirectUser()}
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
