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
router.get('/products/:page', auth, common.getAllProducts)
router.get('/orders', auth, user.getAllOrders);
router.get('/order/:order_id', auth, user.getOrder);
router.post('/buy/:order_id/', auth, user.buy);
router.post('/add-to-cart/', auth, user.addToCart);
router.get('/search', auth, user.search);
router.get('/:category_id/:page', auth, common.getProductsByCategory);
module.exports = router;
