const userService = require('../services/userService');
const authService = require('../services/authService');
const { comparePassword } = require('../utils/hash');
const { generateToken, generateRefreshToken } = require('../utils/jwt');

/*const login = async (req, res) => {

    const { email, password, role } = req.body;

    const user = await userService.getUserByEmail(email);

    if(!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    const isValid = await comparePassword(password, user.password);

    if(!isValid) {
        return res.status(401).json({
            message: 'Invalid Credentials'
        });
    }

    if(user.role !== role) {
        return res.status(401).json({
            message: 'Inappropriate Role'
        });
    }

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    await userService.saveRefreshToken(user.id, refreshToken);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict'
    });

    return res.json({
        accessToken: token,
        refreshToken
    });

} */

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

