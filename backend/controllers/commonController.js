const db = require('../db')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const categories = (req, res) =>
    db.query(`
        WITH RECURSIVE c AS (
            SELECT *, 0 as lvl
            FROM   categories
            WHERE  parent_id IS NULL
        UNION ALL
            SELECT categories.*, c.lvl + 1
            FROM   categories 
            JOIN   c ON categories.parent_id = c.id
        ),
        maxlvl AS (
        SELECT max(lvl) maxlvl FROM c
        ),
        j AS (
            SELECT c.*, json '[]' children
            FROM   c, maxlvl
            WHERE  lvl = maxlvl
        UNION ALL
            SELECT   (c).*, array_to_json(array_agg(j) || array(SELECT r
                                                                FROM   (SELECT l.*, json '[]' children
                                                                        FROM   c l, maxlvl
                                                                        WHERE  l.parent_id = (c).id
                                                                        AND    l.lvl < maxlvl
                                                                        AND    NOT EXISTS (SELECT 1
                                                                                        FROM   c lp
                                                                                        WHERE  lp.parent_id = l.id)) r)) children
            FROM     (SELECT c, j
                    FROM   c
                    JOIN   j ON j.parent_id = c.id) v
            GROUP BY v.c
        )
        SELECT row_to_json(j) json_tree
        FROM   j
        WHERE  lvl = 0;
    `)
    .then(({rows}) => {
        res.status(200).json(rows[0].json_tree.children)
    })
    .catch(err => res.status(500).json(err.message))

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
module.exports = {
    categories,
    getProductsByCategory,
    getProductDetails
}