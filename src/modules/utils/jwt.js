const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');

const generateToken = (payload) => {

    return jwt.sign(
        {
            userId: payload.id,
            role: payload.role,
            permissions: payload.permissions
        }, 
        jwtConfig.accessTokenSecret,
        {
            expriesIn: jwtConfig.accessTokenLife
        }
    );

};

const generateRefreshToken = (payload) => {
    
    return jwt.sign(
        {
            userId: payload.id
        },
        jwtConfig.refreshTokenSecret,
        {
            expiresIn: jwtConfig.refreshTokenLife
        }
    );
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, jwtConfig.accessTokenSecret);
}

const verifyRefreshToken = (token) => {
    return jwt.verify(token, jwtConfig.refreshTokenSecret);
}

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};