const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const common = require('../controllers/commonController')
const employee = require('../controllers/employeeController')

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, OPTIONS, GET, POST, DELETE, PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, X-Key, Authorization"
  );
  next();
})

router.get('/categories', auth, common.categories)
router.post('/categories', auth, employee.addCategory)
router.delete('/categories/:id', auth, employee.deleteCategory)

router.get('/merchants/:status/:page', auth, employee.getMerchants)
router.patch('/merchants/:merchant_id', auth, employee.approveMerchant)
router.delete('/merchants/:merchant_id', auth, employee.rejectMerchant)

router.get('/shippers/:status/:page', auth, employee.getShippers)
router.patch('/shippers/:shipper_id', auth, employee.approveShipper)
router.delete('/shippers/:shipper_id', auth, employee.rejectShipper)

module.exports = router;