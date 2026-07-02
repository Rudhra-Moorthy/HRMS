const express = require('express');
const router = express.Router();

const authController = require('./authController');

// router.post('/register', authController.register);

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Authentication and Authorization APIs
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user and returns an access token and refresh token.
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@gmail.com
 *
 *               password:
 *                 type: string
 *                 format: password
 *                 example: FedHub@john.doe@gmail.com
 *              
 *               role:
 *                 type: string
 *                 example: Admin
 *
 *     responses:
 *       200:
 *         description: Login successful
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Invalid email or password
 *
 *       500:
 *         description: Server side error
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Generates a new access token using a valid refresh token.
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *
 *       400:
 *         description: Refresh token is required
 *
 *       401:
 *         description: Invalid or expired refresh token
 *
 *       500:
 *         description: Server side error
 */
router.post('/refresh', authController.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs out the user by invalidating the refresh token.
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     responses:
 *       200:
 *         description: Logged out successfully
 *
 *       400:
 *         description: Refresh token is required
 *
 *       401:
 *         description: Invalid refresh token
 *
 *       500:
 *         description: Server side error
 */
router.post('/logout', authController.logout);

module.exports = router;
