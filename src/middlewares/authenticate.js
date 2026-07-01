const jwt = require('jsonwebtoken');
const { verifyAccessToken } = require('../modules/utils/jwt');

const authenticate = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Access token is required'
        });
    }

    const token = authHeader.split(' ')[1];

    try {

        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();

    } catch (err) {

        return res.status(401).json({
            message: 'Token expired'
        });

    }
};

module.exports = authenticate;