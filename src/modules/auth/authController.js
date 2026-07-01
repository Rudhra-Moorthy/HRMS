const userService = require('../user/userService');
const authService = require('./authService');
const { comparePassword } = require('../utils/hash');
const { generateToken, generateRefreshToken } = require('../utils/jwt');

const login = async (req, res) => {

    try {

        const result = await authService.login(req.body);
        return res.status(200).json(result);

    } catch(err) {
        return res.status(err.statusCode || 500).json({
            message: err.message
        });
    }

}

const refreshToken = async (req, res) => {

    try {

        const result = await authService.refreshToken(req.body.refreshToken);
        return res.status(200).json(result);

    } catch (err) {
        return res.status(err.statusCode || 500).json({
            message: err.message
        });
    }
}

const logout = async(req, res) => {

    try {

        await authService.logout(req.body.refreshToken);

        return res.status(200).json({
            message: "Logged out successfully"
        });

    } catch (err) {
        return res.status(err.statusCode || 500).json({
            message:  err.message
        });
    }

}

module.exports = {
    login,
    refreshToken, 
    logout
}

