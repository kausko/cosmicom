const db = require('../db')

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


module.exports = {
    categories
}