import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { listOrders, getStatusValues, updateOrderStatus } from './apiAdmin';
import moment from 'moment';
import {Card, Row,Col, Table, Badge, Button} from 'reactstrap';
import {  Popconfirm,Upload, Icon } from "antd";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);
  const { user, token } = isAuthenticated();

  const loadOrders = () => {
    listOrders(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrders(data);
      }
    });
  };

  const loadStatusValues = () => {
    getStatusValues(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setStatusValues(data);
      }
    });
  };

  useEffect(() => {
    loadOrders();
    loadStatusValues();
  }, []);

  const showOrdersLength = () => {
    if (orders.length > 0) {
      return (
        <h3>Total orders: {orders.length}</h3>
      );
    } else {
      return <h3 className='text-danger'>No orders</h3>;
    }
  };


  const handleStatusChange = (e, orderId) => {
    updateOrderStatus(user._id, token, orderId, e.target.value).then((data) => {
      if (data.error) {
        console.log('Status update failed');
      } else {
        loadOrders();
      }
    });
    // console.log('update order status');
  };

  const statusBadge = (status) => {
    switch(status) {
      case "Received":   return <Badge color="primary" style={{fontSize: 16}}>{status}</Badge>;
      case "Processing":   return <Badge color="warning" style={{fontSize: 16}}>{status}</Badge>;
      case "Delivered": return <Badge color="success" style={{fontSize: 16}}>{status}</Badge>;
      case "Cancelled":  return <Badge color="danger" style={{fontSize: 16}}>{status}</Badge>;

      default:      return <h5>No status available</h5>
    }
  }

  const showStatus = (o) => (
    <div className='form-group'>
      {statusBadge(o.status)}
      <div style={{paddingTop:"10px"}}>
    {o.status==="Delivered" || o.status==="Cancelled" ?null:<select
        className='form-control'
        onChange={(e) => handleStatusChange(e, o._id)}
        
      >
        <option>Update Status</option>
        {statusValues.map((status, index) => (
          <option key={index} value={status}>
            {status}
          </option>
        ))}
      </select>}
      </div>
    </div>
  );

  return (
    <Layout
      title='Orders'
      description={`Hey ${user.name}, you can manage all the ordes here`}
    >
      <div style={{ paddingLeft: "30px", paddingRight: "30px" }}>
       {showOrdersLength()}
       <Table striped>
      <thead>
        <tr>
          <th>
            #
          </th>
          <th>
            Ordered by
          </th>
          <th>
            Order ID
          </th>
          <th>
            Ordered on
          </th>
          <th>
            Adress
          </th>
          <th>
            Status
          </th>
          <th>

          </th>
          <th>

          </th>
        </tr>
      </thead>
      <tbody>
      {orders.map((o, oIndex) => {
            return (
<tr>              
  <th scope="row">
            {oIndex+1}
          </th>
          <td>
            {o.user.name}
          </td>
          <td>
           {o._id}
          </td>
          <td>
          {moment(o.createdAt).format("YYYY-MM-DD HH:mm")}
          </td>
          <td>
            {o.address}
          </td>
          <td>
          {showStatus(o)}
          </td>
          <td>
          <Link   to={{ pathname: `/admin/vieworders/${o._id}`, state: o }} >
          <Button color="primary">View Details</Button>
                </Link>
            {" "}

            
            <Button color="secondary">
              <Icon type="download" /> Download
            </Button>
          </td>
              <td>
              <Link>
              <Icon
                  type="delete"
                  theme="filled"
                  style={{ color: "red", fontSize: "20px" }}
                  onClick={() => console.log(o._id) }
                />
                </Link>
              
                
              </td>
                </tr>
            );
          })}
      </tbody>
    </Table>
    </div>
    </Layout>
  );


     
  

};

export default Orders;
