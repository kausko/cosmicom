const db = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const categories = (req, res) =>
  db
    .query("select * from get_categories()")
    .then(({ rows }) => {
      // res.status(200).json(rows[0].json_tree.children);
      res
        .status(200)
        .json(rows.map((row) => JSON.parse(row.get_categories).children).flat());
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err.message);
    });

const getProductsByCategory = async (req, res) => {
  try {
    const { id, usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );
    const page = parseInt(req.params.page);
    const category = req.params.category_id;

    if (usertype !== 'merchant' && usertype !== 'user') 
      res.status(401).send('ACCESS DENIED');
    
    else {
      const { rows } = await db.query(
        `
            WITH Data_CTE AS ( 
                SELECT * FROM products
                WHERE category_id = '${category}' 
                ${usertype === 'merchant' ? `AND merchant_id = '${id}'` : ''}
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

const getProductDetails = async (req, res) => {
  try {
    const { id, usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );
    const product_id = parseInt(req.params.id);
    if (usertype !== 'merchant' && usertype !== 'user')
      res.status(401).send('ACCESS DENIED');
    else {
      const { rows } = await db.query(
        `SELECT * FROM products WHERE id = '${product_id}' ${usertype === 'merchant' ? `AND merchant_id = '${id}'`: ''}`
      );
      if (rows.length > 0) {
        res.status(200).json(rows);
      } else if (rows.length == 0)
        res.status(200).json('No such product');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { id, usertype } = jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWTSECRET
    );

    const page = parseInt(req.params.page);

    if (usertype !== 'merchant' && usertype !== 'user') 
      res.status(401).send('ACCESS DENIED');
    else {
      const { rows } = await db.query(
        `
            WITH Data_CTE AS ( 
                SELECT * FROM products 
                ${usertype === 'merchant' ? `WHERE merchant_id = '${id}'` : ''}
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

module.exports = {
  categories,
  getAllProducts,
  getProductsByCategory,
  getProductDetails,
};
