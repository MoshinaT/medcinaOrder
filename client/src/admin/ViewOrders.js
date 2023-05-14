import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { listOrders, getStatusValues, updateOrderStatus } from './apiAdmin';
import moment from 'moment';
import {Card, CardTitle, CardText, ListGroup,CardHeader, CardBody,ListGroupItem, Row,Col, Table, Badge, Button} from 'reactstrap';
import {  Popconfirm,Upload, Icon } from "antd";

const ViewOrders = props => {
  const { _id, address, mobile, amount, createdAt, products, status, updatedAt, user } = props.location.state;
console.log(props);
  const [statusValues, setStatusValues] = useState([]);
  const { user:accountUser, token } = isAuthenticated();


  const loadStatusValues = () => {
    getStatusValues(accountUser._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setStatusValues(data);
      }
    });
  };

  useEffect(() => {

  }, []);


  const handleStatusChange = (e, orderId) => {
    updateOrderStatus(accountUser._id, token, orderId, e.target.value).then((data) => {
      if (data.error) {
        console.log('Status update failed');
      } else {
        console.log(data);
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
      description={`Hey ${accountUser.name}, you can manage all the ordes here`}
    >
      <div style={{ paddingLeft: "30px", paddingRight: "30px" }}>
      <Card>
      <CardHeader tag="h5">
      <Row>
      <Col>Order Id: {_id}</Col>
      <Col>Ordered by: {user.name}</Col>
      </Row>
      </CardHeader>
      <CardBody>
    <CardTitle tag="h5">
    <Row>
  <Col>Status: {status}</Col>
  <Col>Amount: {amount}</Col>
      </Row>
<Row>
<Col>Ordered on: {createdAt}</Col>
<Col>Order Last Updated:  {updatedAt}</Col>
</Row>
<Row>
<Col>Products:</Col>
</Row>
    </CardTitle>
    <Table
>
  <thead>
    <tr>
      <th>
        #
      </th>
      <th>
        Product Name
      </th>
      <th>
        Quantity
      </th>
    </tr>
  </thead>
  <tbody>
  {products.map((val,index)=> <tr>
    <th scope="row">
        {index+1}
      </th>
      <td>
      {val.name}
      </td>
      <td>
      {val.count}
      </td>
    </tr>)}
  </tbody>
</Table>
<Row style={{paddingTop:"10px",flexDirection: 'row',
    justifyContent: 'flex-end'}}>
    <Link
        to={{
          pathname: "/admin/orders",
          state: props.location.state
        }}
        style={{paddingRight:"15px"}}
      ><p>
        <Button color="primary" >Back</Button>
        </p>
      </Link>
      
      {/* <Link
        to={{
          pathname: "/admin/orders",
          state: props.location.state
        }}
      ><p>
        <Button disabled="true">Download</Button>
        </p>
      </Link> */}
      </Row>
  </CardBody>
 
      </Card>
        
    </div>
    </Layout>
  );


     
  

};

export default ViewOrders;
