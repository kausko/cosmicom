const bcrypt = require('bcryptjs');
const db = require('../db');
const jwt = require('jsonwebtoken');
const ObjectId = require('bson-objectid');
require('dotenv').config()

const login = async (req, res) => {
  try {
    const rbu = req.body.usertype;
    console.log(req.body);
    const { rows } = await db.query(`SELECT * FROM ${rbu}s WHERE email = $1`, [
      req.body.email,
    ]);
    if (rows.length) {
      if ((rbu === 'merchant' || rbu === 'shipper') && !rows[0].status)
        return res.status(400).send('Account not verified yet');

      const isMatch = await bcrypt.compare(req.body.password, rows[0].password);
      if (!isMatch) {
        return res.status(400).send('Enter valid password');
      }
      const payload = {
        id: rows[0].id,
        usertype: req.body.usertype,
      };
      jwt.sign(
        payload,
        process.env.JWTSECRET,
        {
          expiresIn: 36000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
      );
    } else return res.status(400).json('Enter valid password');
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

const register = async (req, res) => {
  try {
    const id = ObjectId().toString();
    const { name, email, usertype } = req.body;
    let { password } = req.body;
    const cat = new Date().toISOString().split('T')[0];

    if (usertype === 'merchant' || usertype === 'shipper') {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      const { website, country_code } = req.body;

      const {
        rows,
      } = await db.query('SELECT * FROM employees WHERE country_code = $1', [
        country_code,
      ]);

      if (!rows.length)
        throw new Error('Cosmicom is not available in your country');

      const emp_id = rows[Math.floor(Math.random() * rows.length)].id;
      console.log(emp_id);

      const result = await db.query(
        `INSERT INTO ${usertype}s(id, name, email, website, country_code, created_at, emp_id, password, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [id, name, email, website, country_code, cat, emp_id, password, false]
      );

      res.status(200).json(result);
    } else if (usertype === 'user') {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      const { gender, phone, dob, country_code } = req.body;
      const result = await db.query(
        'INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [
          id,
          name,
          email,
          gender,
          phone.toString(),
          0,
          dob,
          cat,
          country_code,
          password,
        ]
      );
      res.status(200).send(result);
    } else if (usertype === 'employee') {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      const { phone, dob, country_code } = req.body;
      const result = await db.query(
        'INSERT INTO employees VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
        [id, name, email, phone, dob, cat, country_code, password]
      );
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
};

const getCountries = (req, res) =>
  db
    .query('SELECT * FROM countries')
    .then(({ rows }) => res.status(200).json(rows))
    .catch((err) => res.status(500).send(err.message));

module.exports = {
  login,
  register,
  getCountries,
};
