const db = require('../db');
const ObjectId = require('bson-objectid');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getProfile = async (req, res) => {
  try {
    const { id, usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );
    if (usertype !== 'user') res.status(401).send('ACCESS DENIED');
    else {
      const { rows } = await db.query(
        `SELECT * FROM users where id=$1`, [id]
      )
      res.status(200).send(rows)
    }
  }
  catch (err) {
    res.status(400).send(err.message)
  }
}

const updateProfile = async(req, res) => {

}
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
    console.log(req.params)
    const { order_id } = req.params;

    if (usertype !== 'user') res.status(401).send('ACCESS DENIED');
    else {
      const { rows } = await db.query(
        `SELECT * FROM orders 
                WHERE user_id = '${id}'
                AND id = '${order_id}'`
      );

      if (rows.length > 0) {
        const status = rows[0].status
        
        const productRows = await db.query(
          `SELECT * FROM order_items
                WHERE order_id = '${order_id}'`
        )
        
        var products = []
        var i
        var billAmount = 0
        for(i=0; i<productRows.rows.length; i++) {
          const productDetails = await db.query(
            `SELECT * FROM products
                WHERE id = '${productRows.rows[i].product_id}'`
          )
          billAmount = billAmount + (productDetails.rows[0].price * productRows.rows[i].quantity)
          products.push({
            product_id: productRows.rows[i].product_id,
            name: productDetails.rows[0].name,
            rate: productDetails.rows[0].price,
            quantity: productRows.rows[i].quantity,
            totalAmount: productDetails.rows[0].price * productRows.rows[i].quantity
          })
        }

        const orderDetails = {
          order_id: order_id,
          status: status,
          products: products,
          billAmount: billAmount
        }
        res.status(200).json(orderDetails);
      } else if (rows.length == 0)
        res.status(200).json({ msg: `No order with id = '${order_id}' yet` });
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
    const { searchTerm, category_id, price, page, status, sortOrder } = req.query;
    if (usertype !== 'user') res.status(401).send('ACCESS DENIED');
    else {
        const { rows } = await db.query( 
          `
          WITH Data_CTE AS (
          SELECT * FROM products 
          WHERE ((name LIKE '%${searchTerm}%' 
          OR description LIKE '%${searchTerm}%')
          ${category_id ? 'AND category_id = \'' + category_id + '\') ' : ')'} ),
          Count_CTE AS (
            SELECT COUNT(*) AS totalCount FROM Data_CTE
        )
        SELECT * FROM Data_CTE
        CROSS JOIN Count_CTE
        ORDER BY ${price ? 'price' : (status ? 'status' : 'created_at')} ${sortOrder ? sortOrder : 'DESC'}
        LIMIT 10 OFFSET ${10 * (page - 1)}
        `
        )
      
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else if (rows.length == 0)
        res.status(200).json({ msg: `No products found` });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const buy = async (req, res) => {
  try {
    const { id, usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );
    const { order_id } = req.params;
    const { paymentMode, netAmt, address } = req.body;
    if (usertype !== 'user') res.status(401).send('ACCESS DENIED');
    else {
      const checkIfOrderExists = await db.query(
        `SELECT * FROM orders where id = '${order_id}' and status = 'ordering'`
      )
      if(checkIfOrderExists.rows.length === 0)
        res.status(400).send('Invalid order')
      else {  
        const userDetails = await db.query(
          `SELECT * FROM users where id = '${id}'`
        )
        const shippers = await db.query(
          `SELECT * FROM shippers WHERE country_code = '${userDetails.rows[0].country_code}' `
        )

        const randomShipperIndex = Math.floor(Math.random() * (shippers.rows.length));
        const { rows } = await db.query(
          `UPDATE ORDERS SET "paymentMode" = '${paymentMode}', "netAmt" = '${netAmt}', status = 'ordered', created_at = NOW(), shipper_id = '${shippers.rows[randomShipperIndex].id}', addr = '${address}' WHERE id = '${order_id}' AND user_id='${id}'`
        );
        res.status(200).send('Ordered');
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const addToCart = async (req, res) => {
  try {
      const { id, usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );
    const { product_id, quantity } = req.body;
    if (usertype !== 'user') res.status(401).send('ACCESS DENIED');
    else {
      const { rows } = await db.query(
        `SELECT * from orders WHERE user_id='${id}' AND status='ordering'`
      );
      if (rows.length > 0) {                                    // If there is an active cart, add items to it
        const {
          data,
        } = await db.query(
          `INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1,$2, $3)`,
          [rows[0].id, product_id, quantity]
        );
        res.status(200).json(data);
      } else  {                                                 // No active cart, need to create a new order
        const orderID = ObjectId().toString()
        const {
          data,
        } = await db.query(
          `INSERT INTO orders (id, user_id, status) VALUES ($1,$2,$3)`,
          [orderID, id, 'ordering']         
        );

        const { itemData, } = await db.query( 
        `INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1,$2, $3)`,
        [orderID, product_id, quantity]
        );
        res.status(200).json(data);
      } 
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
module.exports = {
  getProfile,
  updateProfile,
  getAllOrders,
  getOrder,
  search,
  buy,
  addToCart,
};
