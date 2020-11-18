const express = require('express');
const router = express.Router();
const common = require('../controllers/commonController');
const merchant = require('../controllers/merchantController');
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
router.get('/categories', auth, common.categories);
router.get('/products/:page', auth, common.getAllProducts);
router.get('/:category_id/:page', auth, common.getProductsByCategory);
router.get('/:id', auth, common.getProductDetails);
router.put('/:id', auth, merchant.editProduct);
router.delete('/:id', auth, merchant.deleteProduct);
router.post('/add-product', auth, merchant.addProduct);

module.exports = router;
