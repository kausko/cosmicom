const express = require('express');
const router = express.Router();
const common = require('../controllers/commonController');
const merchant = require('../controllers/merchantController');
const auth = require('../middleware/auth');
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, OPTIONS, GET, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, X-Key, Authorization"
  );
  next();
})
router.get('/categories', auth, common.categories)
router.get('/:page',auth, merchant.getAllProducts)
router.get('/:category_id/:page',auth, merchant.getProductsByCategory)
router.get('/:id',auth, merchant.getProductDetails)
router.put('/:id',auth, merchant.editProduct)
router.delete('/:id',auth, merchant.deleteProduct)

module.exports = router;