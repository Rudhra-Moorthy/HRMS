const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { comparePassword } = require('../utils/hash');
const userService = require('../user/userService');


// Login
const login = async (credentails) => {

    const user = await userService.getUserByEmail(credentails.email);

    if(!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
    }

    const isValid = await comparePassword(credentails.password, user.password);

    if(!isValid) {
        const err = new Error('Invalid Credentials');
        err.statusCode = 401;
        throw err;
    }

    if(credentails.role !== user.role) {
        const err = new Error('Please choose your role');
        err.statusCode = 401;
        throw err;
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    await userService.saveRefreshToken(user.id, refreshToken);

    return {
        accessToken,
        refreshToken
    };
}

// Refresh Token
const refreshToken = async (token) => {

    let decoded;

    try {
        decoded = verifyRefreshToken(token);
    } catch {
        const err = new Error("Invalid or expired refresh token");
        err.statusCode = 401;
        throw err;
    }

    const exists = await userService.findRefreshToken(token);

    if(!exists) {
        const err = new Error("Invalid Refresh Token");
        err.statusCode = 401;
        throw err;
    }

    const user = await userService.getUserById(decoded.userId);

    if(!user) {
        const err = new Error('User not found.');
        err.statusCode = 404;
        throw err;
    }

    const accessToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await userService.revokeRefreshToken(token);

    await userService.saveRefreshToken(user.id, newRefreshToken);

    return {
        accessToken,
        refreshToken : newRefreshToken
    };

}

// Logout
const logout = async (token) => {
    await userService.revokeRefreshToken(token);
}

module.exports = {
    login,
    logout,
    refreshToken
};

