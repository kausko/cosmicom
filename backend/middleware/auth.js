const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    // Get the token
    const token = req.header('token');
    console.log(token);
    if(!token) {
        return res.status(401).json({msg:'Authorization denied'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWTSECRET);

        req.body.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({msg: 'Token invalid'});
    }
    
}
