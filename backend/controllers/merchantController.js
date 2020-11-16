const db = require('../db');
const ObjectId = require('bson-objectid');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getAllProducts = async (req, res) => {
  try {
    const { id, usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );

    const page = parseInt(req.params.page);

    if (usertype !== 'merchant') res.status(401).send('ACCESS DENIED');
    else {
      const { rows } = await db.query(
        `
            WITH Data_CTE AS ( 
                SELECT * FROM products 
                WHERE merchant_id = '${id}'
            ),
            Count_CTE AS (
                SELECT COUNT(*) AS totalCount FROM Data_CTE
            )
            SELECT * FROM Data_CTE
            CROSS JOIN Count_CTE
            ORDER BY created_at 
            LIMIT 10 
            OFFSET ${10*(page-1)}
        `
      );
        res.status(200).json(rows);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const addProduct = async (req, res) => {
  try {
    const { id, usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );
    const { name, price, status, category_id, description } = req.body;
    if (usertype !== 'merchant') res.status(401).send('ACCESS DENIED');
    else {
      const result = await db.query(
        `INSERT INTO products (id,name,price,status,category_id,merchant_id,created_at,description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
            ObjectId().toString(), 
            name, 
            price, 
            status, 
            category_id, 
            id, 
            new Date().toISOString().split('T')[0], 
            description
        ]
      );
      res.status(200).json('Product added successfully');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const editProduct = async (req, res) => {
  try {
    const { id, usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );
    const product_id = req.params.id;
    const { name, price, status, description } = req.body;
    if (usertype !== 'merchant') res.status(401).send('ACCESS DENIED');
    else {
      const result = await db.query(
        `UPDATE products 
                 SET name = '${name}',
                 price = '${price}',
                 status = '${status}',
                 description = '${description}'
                WHERE id = '${product_id}'
                AND merchant_id = '${id}'`
      );
      res.status(200).json(result);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id, usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );
    const product_id = req.params.id;
    if (usertype !== 'merchant') res.status(401).send('ACCESS DENIED');
    else {
      const result = await db.query(
        `DELETE FROM products
                WHERE id = '${product_id}'
                AND merchant_id = '${id}'`
      );
      if (result.rowCount === 0)
        res.status(422).send(`Product with id: ${product_id} not found`);
      else res.status(200).json(result);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
module.exports = {
  getAllProducts,
  editProduct,
  deleteProduct,
  addProduct,
};
