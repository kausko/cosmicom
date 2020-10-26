const bcrypt = require('bcryptjs')
const db = require('../db')

const login = (req, res) => {
    db
    .query('SELECT * FROM users WHERE email = $1', [req.body.email])
    .then(response => {
        const rows = response.rows;
        if (rows.length)
            res.status(200).send(rows[0])
        else
            throw new Error('Email not found')
    })
    .catch(error => {
        console.log(error)
        res.status(401).send(error.message)
    })
}

module.exports = {
    login
}