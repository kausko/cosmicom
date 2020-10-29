const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const db = require('../db')
const jwt = require('jsonwebtoken');

const shipperOrders = async (req, res) => {
    try{
        const rows = db.query('SELECT * FROM orders WHERE shipperId = $1', [req.body.id])
        if (rows.length>0){
            res.status(200).json(rows);
        }
        else if(rows.length == 0)
            res.status(200).json({msg:'No order yet'});
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
const shipperOrderUpdate = async(req, res) => {
    try{
        db
        .query('UPDATE orders SET status= $1 WHERE id= $2 AND shipper_id= $3', [req.body.status,req.body.id,req.body.shipperId],(response) => {
            res.status(200).json({msg:'Order Updated Successfully'});
        })
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
module.exports = {
    shipperOrders,
    shipperOrderUpdate
}



// const express = require('express');
// const router = express.Router();
// const order = require('../controllers/orderController');
// const auth = require('../middleware/auth');
// router.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "PUT, OPTIONS, GET, POST, DELETE");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, X-Key, Authorization"
//   );
//   next();
// })

// router.get('/getAllOrders',auth, order.shipperOrders)
// router.post('/updateOrderStatus',auth, order.shipperOrderUpdate);
// module.exports = router;