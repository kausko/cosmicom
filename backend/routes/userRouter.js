const express = require('express');
const router = express.Router();
const common = require('../controllers/commonController');
const user = require('../controllers/userController');
const auth = require('../middleware/auth');
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, OPTIONS, GET, POST, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, X-Key, Authorization'
  );
  next();
});
router.get('/', auth, user.getProfile);
router.get('/categories', auth, common.categories);
router.get('/:category_id/:page', auth, common.getProductsByCategory);
router.get('/product/:id', auth, common.getProductDetails);
router.get('/orders', auth, user.getAllOrders);
router.get('/order/:id', auth, user.getOrder);
router.get('/order/search/', auth, user.search);
router.post('/buy/:order_id/', auth, user.search);
router.post('/add-to-cart/', auth, user.addToCart);
module.exports = router;
