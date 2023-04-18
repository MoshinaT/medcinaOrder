const express = require('express');
const router = express.Router();

const {
  create,
  createBatch,
  productById,
  read,
  update,
  remove,
  list,
  listRelated,
  listBySearch,
  photo,
  listSearch,
  removeAll
} = require('../controllers/product');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/product/:productId', read);
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.post('/product/createBatch/:userId', requireSignin, isAuth, isAdmin, createBatch);
router.delete(
  '/product/:productId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.delete(
  '/product/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  removeAll
);

router.put(
  '/product/:productId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  update
);

router.get('/products', list);
router.get('/products/search', listSearch);
router.get('/products/related/:productId', listRelated);
router.post('/products/by/search', listBySearch);
router.get('/product/photo/:productId', photo);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;
