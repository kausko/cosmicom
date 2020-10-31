const db = require('../db')
const ObjectId = require('bson-objectid')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const getAllOrders = async (req, res) => {
    try{
        const { id, usertype } = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWTSECRET)
        if (usertype !== 'user')
            res.status(401).send('ACCESS DENIED')
        else {
            const {rows} = await db.query(
                `SELECT * FROM orders 
                WHERE user_id = '${id}'
                ORDER BY created_at DESC`
            )
            if (rows.length>0){
                res.status(200).json(rows);
            }
            else if(rows.length == 0)
                res.status(200).json({msg:'No products here yet'});
        }
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
const getOrder = async (req, res) => {
    try{
        const { id, usertype } = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWTSECRET)
        const {order_id} = req.params.id
        if (usertype !== 'user')
            res.status(401).send('ACCESS DENIED')
        else {
            const {rows} = await db.query(
                `SELECT * FROM orders 
                WHERE user_id = '${id}'
                AND id = '${order_id}'`
            )
            if (rows.length>0){
                res.status(200).json(rows);
            }
            else if(rows.length == 0)
                res.status(200).json({msg:`No order with id = '{$order_id}' yet`});
        }
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
module.exports = {
    getAllOrders,
    getOrder
}