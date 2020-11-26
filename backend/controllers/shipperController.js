const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const db = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const shipperOrders = async (req, res) => {
  try {
    const { id, usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );

    const page = parseInt(req.params.page);
    const status = req.params.status;
    if (usertype !== 'shipper') res.status(401).send('ACCESS DENIED');
    else {
      const { rows } = await db.query(
        `WITH Data_CTE AS ( 
          SELECT users.name,users.email,orders.id,status,"netAmt","paymentMode"
          FROM orders LEFT JOIN users 
          ON users.id = orders.user_id 
          WHERE
          status='${status}' AND 
          shipper_id='${id}' 
      ),
      Count_CTE AS (
          SELECT COUNT(*) AS totalCount FROM Data_CTE
      )
      SELECT * FROM Data_CTE
      CROSS JOIN Count_CTE
      LIMIT 10 
      OFFSET ${10 * (page - 1)}`
      );
      res.status(200).json(rows);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
const shipperOrderUpdate = async (req, res) => {
  try {
    const { id, usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );
    if (usertype !== 'shipper') res.status(401).send('ACCESS DENIED');
    else {
      console.log(typeof orderid);
      const result = await db.query(
        'UPDATE orders SET status = $1 WHERE id = $2 AND shipper_id = $3',
        [req.params.status, req.params.id, id]
      );
      if (result.rowCount === 0)
        res.status(422).send(`Order with id: ${id} not found`);
      else res.status(200).json(result);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
module.exports = {
  shipperOrders,
  shipperOrderUpdate,
};
