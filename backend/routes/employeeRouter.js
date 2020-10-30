const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const common = require('../controllers/commonController')
const employee = require('../controllers/employeeController')

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
router.post('/categories', auth, employee.addCategory)
router.delete('/categories/:id', auth, employee.deleteCategory)
router.get('/merchants/:status/:page', auth, employee.getMerchants)

module.exports = router;