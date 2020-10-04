const jwt = require('jsonwebtoken');
const config = require('config');

// MIDDLEWEAR ALLOWS ACCESS TO THE TOKEN IN THE ROUTE.
module.exports = function(req, res, next) {
    //Get token from header. x-auth-token is basically the key to the token inside the header.
    const token = req.header('x-auth-token');

    //Check if not token
    if(!token) {
        return res.status(401).json({msg: 'No token, authorization denied'});
    }

    try {
        // Verifies the token (token = 'x-auth-token) and pulls out the payload in the variable decoded.
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        // Assign decoded (payload) to the request object so that we have access to it inside the route.
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({msg: 'Token not valid'});
    }
}