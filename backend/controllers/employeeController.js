const db = require('../db')
const ObjectId = require('bson-objectid')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const addCategory = async (req, res) => {
    try {
        const { usertype } = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWTSECRET)

        if (usertype !== 'employee')
            res.status(401).send('ACCESS DENIED')
        else {
            
            const { cat_name, cat_icon, parent_id } = req.body
            const result = await db.query('INSERT INTO categories VALUES ($1, $2, $3, $4)', [
                ObjectId().toString(),
                parent_id,
                cat_icon,
                cat_name
            ])
            res.status(200).json(result)
        }
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { usertype } = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWTSECRET)

        if (usertype !== 'employee')
            res.status(401).send('ACCESS DENIED')
        else {
            const { id } = req.params
            console.log(typeof id)
            const result = await db.query('DELETE FROM categories where id = $1', [id])
            if (result.rowCount === 0)
                res.status(422).send(`Category with id: ${id} not found`)
            else
                res.status(200).json(result)
        }
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

const getMerchants = async (req, res) => {
    try {
        const { usertype } = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWTSECRET)

        if (usertype !== 'employee')
            res.status(401).send('ACCESS DENIED')
        else {
            const page = parseInt(req.params.page)
            const status = req.params.status

            const { id } = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWTSECRET);

            const {rows} = await db.query(
                `SELECT * FROM merchants 
                WHERE 
                    status=${status} AND 
                    emp_id='${id}' 
                ORDER BY created_at 
                LIMIT 10 
                OFFSET ${10*(page-1)}`
            )
            res.status(200).json(rows)
            // console.log(parseInt(req.params.page), req.params.status === 'true')
            // res.status(200).send('Testing')
        }
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports = {
    addCategory,
    deleteCategory,
    getMerchants
}

// id            |        parent_id         |  cat_icon  |  cat_name   
// --------------------------+--------------------------+------------+-------------
//  5f9af0884b3d7a31d1a6b752 |                          | master     | Master
//  5f9af0b64b3d7a31d1a6b753 | 5f9af0884b3d7a31d1a6b752 | memory     | Electronics
//  5f9af0ca4b3d7a31d1a6b754 | 5f9af0884b3d7a31d1a6b752 | handyman   | Hardware
//  5f9af0e54b3d7a31d1a6b755 | 5f9af0884b3d7a31d1a6b752 | weekend    | Furniture
//  5f9af0ef4b3d7a31d1a6b756 | 5f9af0884b3d7a31d1a6b752 | checkroom  | Apparel
//  5f9af1204b3d7a31d1a6b757 | 5f9af0b64b3d7a31d1a6b753 | devices    | Portable
//  5f9af1424b3d7a31d1a6b758 | 5f9af1204b3d7a31d1a6b757 | laptop     | Laptops
//  5f9af16a4b3d7a31d1a6b759 | 5f9af1204b3d7a31d1a6b757 | smartphone | Phones