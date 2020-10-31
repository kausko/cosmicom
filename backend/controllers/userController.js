const db = require('../db');
const ObjectId = require('bson-objectid');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getAllOrders = async (req, res) => {
  try {
    const { id, usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );
    if (usertype !== 'user') res.status(401).send('ACCESS DENIED');
    else {
      const { rows } = await db.query(
        `SELECT * FROM orders 
                WHERE user_id = '${id}'
                ORDER BY created_at DESC`
      );
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else if (rows.length == 0)
        res.status(200).json({ msg: 'No products here yet' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
const getOrder = async (req, res) => {
  try {
    const { id, usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );
    const { order_id } = req.params.id;
    if (usertype !== 'user') res.status(401).send('ACCESS DENIED');
    else {
      const { rows } = await db.query(
        `SELECT * FROM orders 
                WHERE user_id = '${id}'
                AND id = '${order_id}'`
      );
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else if (rows.length == 0)
        res.status(200).json({ msg: `No order with id = '{$order_id}' yet` });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
const search = async (req, res) => {
  try {
    const { usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );
    const { category_id, price, page, status } = req.query;
    if (usertype !== 'user') res.status(401).send('ACCESS DENIED');
    else {
      const { rows } = await db.query(
        `SELECT * FROM products 
        WHERE category_id = '${category_id}'
        AND price = '${price}'
        AND status = '${status}'
        ORDER BY id,
        LIMIT 10 OFFSET ${10 * (page - 1)}`
      );
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else if (rows.length == 0)
        res.status(200).json({ msg: `No order with id = '{$order_id}' yet` });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
const buy = async (req, res) => {
  try {
    const { user_id, usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );
    const { id } = req.params;
    const { paymentMode, netAmt } = req.body;
    if (usertype !== 'user') res.status(401).send('ACCESS DENIED');
    else {
      const { rows } = await db.query(
        `UPDATE ORDERS SET paymentMode = '${paymentMode}', netAmt = '${netAmt}', status = 'ORDERED' WHERE id = '${id}' AND user_id='${user_id}'`
      );
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else if (rows.length == 0)
        res.status(200).json({ msg: `No order with id = '{$order_id}' yet` });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
const addToCart = async (req, res) => {
  try {
    const { user_id, usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );
    const { product_id, quantity } = req.body;
    if (usertype !== 'user') res.status(401).send('ACCESS DENIED');
    else {
      const { rows } = await db.query(
        `SELECT * from orders WHERE user_id='${user_id}' AND status='${ORDERING}'`
      );
      if (rows.length > 0) {
        const { data } = await db.query(
          `INSERT INTO orders (product_id,quantity) VALUES ($1,$2)`[
            (product_id, quantity)
          ]
        );
        res.status(200).json(data);
      } else if (rows.length == 0)
        res.status(200).json({ msg: `No order with id = '{$order_id}' yet` });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
module.exports = {
  getAllOrders,
  getOrder,
  search,
  buy,
};
