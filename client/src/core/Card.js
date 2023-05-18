import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import { Badge } from 'reactstrap';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import CardM from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

import { addItem, updateItem, removeItem, getCart } from './cartHelpers';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4, 0, 2),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    zIndex: 0
  },
  card: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  setRun = (f) => f, // default value of function
  run = undefined, // default value of undefined
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);
  const [removeButtonDisplay,setRemoveButtonDisplay]= useState(showRemoveProductButton);
  const [cartCountDisplay,setCartCountDisplay]= useState(cartUpdate);

  const showViewButton = (showViewProductButton) => {
    return (
      showViewProductButton && (
        <Link href={`/product/${product._id}`} className='mr-2'>
          <Button variant='contained' color='primary'>
            View Product
          </Button>
        </Link>
      )
    );
  };

  useEffect(() => {
    getRequiredButton();
  }, []);

  const getRequiredButton = () => {
    const cartVal = getCart();
    const res = cartVal.filter(cart => cart._id === product._id);
if(res.length>0){
  // setRemoveButtonDisplay(true);
  setCartCountDisplay(true);
  setCount(res[0].count);
}
  }

  const addToCart = () => {
    // console.log('added');
    addItem(product);
    getRequiredButton();

  };

  const shouldRedirect = (redirect) => {
    if (redirect) {
      return <Redirect to='/cart' />;
    }
  };

  const showAddToCartBtn = (showAddToCartButton) => {
    return (
      showAddToCartButton && (
        <Button onClick={addToCart} variant='outlined' color='secondary'>
          Add to cart
        </Button>
      )
    );
  };

  const showStock = (quantity) => {
    return quantity > 0 ? (
      <p className='badge badge-primary badge-pill'> In Stock </p>
    ) : (
      <p className='badge badge-primary badge-pill'>Out of Stock </p>
    );
  };

  const handleChange = (productId) => (event) => {
    setRun(!run); // run useEffect in parent Cart
    setCount( event.target.value);
    if (event.target.value >= 1) {
      updateItem(productId, event.target.value);
    }
  };

  const showCartUpdateOptions = (cartCountDisplay) => {
    return (
      cartCountDisplay && (
        <div className='mt-2'>
          <div className='input-group mb-3'>
            <div className='input-group-prepend'>
              <span className='input-group-text'>Adjust Quantity</span>
            </div>
            <input
              type='text'
              defaultValue={1}
              className='form-control'
              value={count}
              onChange={handleChange(product._id)}
            />
          </div>
        </div>
      )
    );
  };

  const showRemoveButton = (removeButtonDisplay) => {
    return (
      removeButtonDisplay && (
        <Button
          onClick={() => {
            removeItem(product._id);
            setRun(!run); // run useEffect in parent Cart
          }}
          variant='contained'
          color='secondary'
          className={classes.button}
          startIcon={<DeleteIcon />}
        >
          Remove Product
        </Button>
      )
    );
  };

  const classes = useStyles();
console.log("pr",product);
  return (
    // <div className='card'>
    //   <div className='card-header name'>{product.name}</div>
    //   <div className='card-body'>
    //     {shouldRedirect(redirect)}
    //     <p className='lead mt-2'>{product.description.substring(0, 100)}</p>
    //     <p className='black-10'>${product.price}</p>
    //     <p className='black-9'>
    //       Category: {product.category && product.category.name}
    //     </p>
    //     <p className='black-8'>
    //       Added on {moment(product.createdAt).fromNow()}
    //     </p>

    //     {showStock(product.quantity)}
    //     <br></br>

    //     {showViewButton(showViewProductButton)}

    //     {showAddToCartBtn(showAddToCartButton)}

    //     {showRemoveButton(showRemoveProductButton)}

    //     {showCartUpdateOptions(cartUpdate)}
    //   </div>
    // </div>

    <Container className={classes.cardGrid} maxWidth='md'>
      <CssBaseline />
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={12}>
          <CardM className={classes.card}>
            {shouldRedirect(redirect)}
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant='h5' component='h2'>
                {product.name}
              </Typography>
              <Typography>Manufacturer: {product.manufacturer}</Typography>
              <Typography>MRP: ₹{product.mrp}</Typography>
              {/* {product.offer?<Typography>Our Price: ₹{product.offer}</Typography>:null} */}
              {/* {product.offer?<p>Offer: {product.offer}%</p>:null}{' '} */}
              <p>
                Added on {moment(product.createdAt).fromNow()}{' '}
              </p>
              {showStock(product.quantity)}
              <br></br>
              <span>
                {/* {showViewButton(showViewProductButton)} */}
                {showAddToCartBtn(showAddToCartButton)}
                {showRemoveButton(removeButtonDisplay)}
              </span>
              {showCartUpdateOptions(cartCountDisplay)}
            </CardContent>
          </CardM>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Card;
