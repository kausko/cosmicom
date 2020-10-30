const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const db = require('../db')
const jwt = require('jsonwebtoken');

const shipperOrders = async (req, res) => {
    try{
        const { id, usertype } = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWTSECRET)

        const page = parseInt(req.params.page)

        if (usertype !== 'shipper')
            res.status(401).send('ACCESS DENIED')
        else {
            const {rows} = await db.query(
                `SELECT * FROM orders 
                WHERE shipper_id = '${id}'
                ORDER BY created_at 
                LIMIT 10 OFFSET ${10*(page-1)}`
            )
            if (rows.length>0){
                res.status(200).json(rows);
            }
            else if(rows.length == 0)
                res.status(200).json({msg:'No order yet'});
        }
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
const shipperOrderUpdate = async(req, res) => {
    try{
        const { id,usertype } = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWTSECRET)

        if (usertype !== 'shipper')
            res.status(401).send('ACCESS DENIED')
        else {
            const { orderid } = req.params
            console.log(typeof (orderid))
            const result = await db.query('UPDATE orders SET status= $1 WHERE id= $2 AND shipper_id= $3', [
                req.body.status,
                orderid,
                id
            ])
            if (result.rowCount === 0)
                res.status(422).send(`Order with id: ${id} not found`);
            else
                res.status(200).json(result);
        }
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
module.exports = {
    shipperOrders,
    shipperOrderUpdate
}
