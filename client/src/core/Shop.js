import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from './Card';
import { getFilteredProducts } from './apiCore';
import Checkbox from './Checkbox';
import RadioBox from './RadioBox';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';

import Search from './Search';
import { prices,manufacturers } from './fixedPrices';

const Shop = () => {
  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] },
  });

  const [error, setError] = useState(false);
  const [limit, setLimit] = useState(18);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);

  const init = () => {
  
  };

  const loadFilteredResults = (newFilters) => {
    // console.log(newFilters);
    getFilteredProducts(skip, limit, newFilters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults(data.data);
        setSize(data.size);
        setSkip(0);
      }
    });
  };

  const loadMore = () => {
    let toSkip = skip + limit;
    // console.log(newFilters);
    getFilteredProducts(toSkip, limit, myFilters.filters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults([...filteredResults, ...data.data]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };

  const useStyles = makeStyles((theme) => ({
    btn: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      borderRadius: 3,
      border: 0,
      color: 'white',
      height: 48,
      padding: '0 20px',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      margin:'20px 20px'
    },
    card:{
      padding: '2px 5px',
    }
  }));

  const classes = useStyles();

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        // <button onClick={loadMore} className='btn btn-warning mb-5'>
        //   Load more
        // </button>
        <Button onClick={loadMore} variant='contained' className={classes.btn}>
          Load more
        </Button>
      )
    );
  };

  useEffect(() => {
    init();
    loadFilteredResults(skip, limit, myFilters.filters);
  }, []);

  const handleFilters = (filters, filterBy) => {
    // console.log("SHOP", filters, filterBy);
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;

    if (filterBy === 'manufacturer') {
      // let priceValues = handlePrice(filters);
      if(filters == " - ")
      newFilters.filters[filterBy] = "";
      else
      newFilters.filters[filterBy] = filters;

    }
    loadFilteredResults(myFilters.filters);
    setMyFilters(newFilters);
  };

  // const handlePrice = (value) => {
  //   const data = prices;
  //   let array = [];

  //   for (let key in data) {
  //     if (data[key]._id === parseInt(value)) {
  //       array = data[key].array;
  //     }
  //   }
  //   return array;
  // };

  return (
    <Layout
      title='Home page'
      description='Search and find medicines here'
      className='container-fluid'
    >
      <Search />
      <div className='row'></div>
      <div className='row'>
   <div className='col-md-2'>

          <h4>Filter by Manufacturer</h4>
          <div style={{height:"300px",overflow:"scroll"}}>
            {/* <RadioBox
              prices={prices}
              handleFilters={(filters) => handleFilters(filters, 'price')}
            /> */}
            <RadioBox
              prices={manufacturers}
              handleFilters={(filters) => handleFilters(filters, 'manufacturer')}
            />
          </div>
        </div> 
        <div className='col-md-10'>
          <h2 className='mb-2'>Products</h2>
          <div className='row'>
            {(filteredResults.length < 1) && <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'  style={{padding:"2px 5px"}}><h5>No products to display</h5></div>} 
            {filteredResults.map((product, i) => (
              <div key={i} className='col-xl-3 col-lg-6 col-md-6 col-sm-6' style={{padding:"2px 5px"}}>
                <Card product={product} />
              </div>
            ))}
          </div>
          <hr />
          {loadMoreButton()}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
