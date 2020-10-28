const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const db = require('../db')
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try{
        db
        .query('SELECT * FROM $1s WHERE email = $2', [req.body.usertype,req.body.email],(response) => {
            const rows = response.rows;
            if (rows.length){
                const isMatch = await bcrypt.compare(req.body.password, rows[0].password);
                if(!isMatch) {
                    return res.status(400).json({msg: 'Enter valid password'});
                }
                const payload = {
                    user : {
                        email: user.email
                    }
                }
                jwt.sign(payload, process.env.JWTSECRET, {
                    expiresIn:3600
                },(err, token) => {
                    if(err) throw err;
                    res.json({token});
                });
        
            }
            else
                throw new Error('Email not found')
        })
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
const register = async (req,res) => {
    const {name,email,password,usertype} = req.body;
    try{
        if(usertype ==='merchant'){
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            db
            .query('INSERT INTO merchants(name,email,password) VALUES ($1,$2,$3)',[name,email,password], (err, result) => {
                if (err) {
                  throw err
                }
                res.status(200).send(`Merchant added successfully`);
              })
        }else if(usertype ==='shipper'){
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            db
            .query('INSERT INTO shippers(name,email,password) VALUES ($1,$2,$3)',[name,email,password], (err, result) => {
                if (err) {
                  throw err
                }
                res.status(200).send(`Shipper added successfully`);
              })
        }else if(usertype ==='user'){
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            db
            .query('INSERT INTO users(name,email,password) VALUES ($1,$2,$3)',[name,email,password], (err, result) => {
                if (err) {
                  throw err
                }
                res.status(200).send(`User added successfully`);
              })
        }else if(usertype ==='employee'){
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            db
            .query('INSERT INTO employees(name,email,password) VALUES ($1,$2,$3)',[name,email,password], (err, result) => {
                if (err) {
                  throw err
                }
                res.status(200).send(`Employee added successfully`);
              })
        }
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
module.exports = {
    login,
    register
}