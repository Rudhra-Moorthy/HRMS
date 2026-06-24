const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../../utils/jwt');
const { comparePassword } = require('../../utils/hash');
const userService = require('../../user/service/userService');


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
        err.statusCode(401);
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

    const decoded = verifyRefreshToken(token);

    const exists = await userService.findRefreshToken(token);

    if(!exists) {
        const err = new Error("Invalid Refresh Token");
        err.statusCode = 401;
        throw err;
    }

    const user = await userService.getUserById(decoded.userId);

    const accessToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await userService.deleteRefreshToken(token);

    await userService.saveRefreshToken(user.id, newRefreshToken);

    return {
        accessToken,
        refreshToken : newRefreshToken
    };

}

// Logout
const logout = async (token) => {
    await userService.deleteRefreshToken(token);
}

module.exports = {
    login,
    logout,
    refreshToken
};

