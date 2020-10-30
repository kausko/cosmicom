const db = require('../db')
const ObjectId = require('bson-objectid')
const jwt = require('jsonwebtoken')
const { parse } = require('dotenv/types')
require('dotenv').config()

const getAllProducts = async (req, res) => {
    try{
        const { id, usertype } = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWTSECRET)

        const page = parseInt(req.params.page)

        if (usertype !== 'merchant')
            res.status(401).send('ACCESS DENIED')
        else {
            const {rows} = await db.query(
                `SELECT * FROM products 
                WHERE merchant_id = '${id}'
                ORDER BY created_at 
                LIMIT 10 OFFSET ${10*(page-1)}`
            )
            if (rows.length>0){
                res.status(200).json(rows);
            }
            else if(rows.length == 0)
                res.status(200).json({msg:'No products yet'});
        }
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
const getProductsByCategory = async (req, res) => {
    try{
        const { id, usertype } = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWTSECRET)
        const page = parseInt(req.params.page)
        const category = parseInt(req.params.category_id)
        if (usertype !== 'merchant')
            res.status(401).send('ACCESS DENIED')
        else {
            const {rows} = await db.query(
                `SELECT * FROM products 
                WHERE merchant_id = '${id}'
                ORDER BY created_at ASC,
                category_id = '${category}' ASC
                LIMIT 10 OFFSET ${10*(page-1)}`
            )
            if (rows.length>0){
                res.status(200).json(rows);
            }
            else if(rows.length == 0)
                res.status(200).json({msg:'No products yet'});
        }
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
const getProductDetails = async (req, res) => {
    try{
        const { usertype } = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWTSECRET)
        const id = parseInt(req.params.id)
        if (usertype !== 'merchant')
            res.status(401).send('ACCESS DENIED')
        else {
            const {rows} = await db.query(
                `SELECT * FROM products 
                WHERE id = '${id}'`
            )
            if (rows.length>0){
                res.status(200).json(rows);
            }
            else if(rows.length == 0)
                res.status(200).json({msg:'No such product'});
        }
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
const editProduct = async (req, res) => {
    try{
        const { id, usertype } = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWTSECRET)
        const product_id = parseInt(req.params.id)
        const { name, price, status} = req.body
        if (usertype !== 'merchant')
            res.status(401).send('ACCESS DENIED')
        else {
            const result = await db.query(
                `UPDATE products 
                 SET name = '${name}',
                 price = '${price}',
                 status = '${status}'
                WHERE id = '${product_id}'
                AND merchant_id = '${id}`
            )
            if (result.rowCount === 0)
                res.status(422).send(`Product with id: ${product_id} not found`);
            else
                res.status(200).json(result);
        }
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
const deleteProduct = async (req, res) => {
    try{
        const { id, usertype } = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWTSECRET)
        const product_id = parseInt(req.params.id)
        if (usertype !== 'merchant')
            res.status(401).send('ACCESS DENIED')
        else {
            const result = await db.query(
                `DELETE * from products
                WHERE id = '${product_id}'
                AND merchant_id = '${id}`
            )
            if (result.rowCount === 0)
                res.status(422).send(`Product with id: ${product_id} not found`);
            else
                res.status(200).json(result);
        }
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
module.exports = {
    getAllProducts,
    getProductsByCategory,
    getProductDetails,
    editProduct,
    deleteProduct
}