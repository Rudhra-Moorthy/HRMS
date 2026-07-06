const express = require('express');

const router = express.Router();

const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const controller = require('./announcementController');

/**
 * @swagger
 * tags:
 *   - name: Announcements
 *     description: Announcement Management APIs
 */

/**
 * @swagger
 * /announcements:
 *   post:
 *     summary: Create new announcement
 *     description: Creates a new announcement and stores it in the database.
 *     tags:
 *       - Announcements
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - targetAudience
 *               - message
 *               - createdBy
 *             properties:
 *               title:
 *                 type: string
 *                 example: Company Holiday
 *
 *               category:
 *                 type: string
 *                 example: General
 *
 *               targetAudience:
 *                 type: string
 *                 example: All Employees
 *
 *               message:
 *                 type: string
 *                 example: Office will remain closed on Friday due to maintenance.
 *
 *               createdBy:
 *                 type: integer
 *                 example: 1
 *
 *     responses:
 *       201:
 *         description: Announcement created successfully
 *       400:
 *         description: Required fields are missing
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.post(
    '/',
    authenticate,
    authorize('announcement.create'),
    controller.createAnnouncement
);

/**
 * @swagger
 * /announcements:
 *   get:
 *     summary: Get all announcements
 *     description: Retrieves all active announcements ordered by latest created date.
 *     tags:
 *       - Announcements
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Announcements retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.get(
    '/',
    authenticate,
    authorize('announcement.view'),
    controller.getAllAnnouncements
);

/**
 * @swagger
 * /announcements/{id}:
 *   get:
 *     summary: Get announcement by ID
 *     description: Retrieves a single announcement using its ID.
 *     tags:
 *       - Announcements
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Announcement ID
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Announcement retrieved successfully
 *       400:
 *         description: Invalid announcement ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Announcement not found
 *       500:
 *         description: Internal server error
 */
router.get(
    '/:id',
    authenticate,
    authorize('announcement.view'),
    controller.getAnnouncementById
);

/**
 * @swagger
 * /announcements/{id}:
 *   patch:
 *     summary: Update announcement
 *     description: Updates one or more fields of an existing announcement.
 *     tags:
 *       - Announcements
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Announcement ID
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Company Holiday
 *
 *               category:
 *                 type: string
 *                 example: HR
 *
 *               targetAudience:
 *                 type: string
 *                 example: Developers
 *
 *               message:
 *                 type: string
 *                 example: Office timing has been changed for this week.
 *
 *     responses:
 *       200:
 *         description: Announcement updated successfully
 *       400:
 *         description: Invalid announcement ID or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Announcement not found
 *       500:
 *         description: Internal server error
 */
router.patch(
    '/:id',
    authenticate,
    authorize('announcement.update'),
    controller.updateAnnouncement
);

/**
 * @swagger
 * /announcements/{id}:
 *   delete:
 *     summary: Soft delete announcement
 *     description: Marks an announcement as deleted by setting the deleted_at timestamp.
 *     tags:
 *       - Announcements
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Announcement ID
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Announcement deleted successfully
 *       400:
 *         description: Invalid announcement ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Announcement not found
 *       500:
 *         description: Internal server error
 */
router.delete(
    '/:id',
    authenticate,
    authorize('announcement.delete'),
    controller.deleteAnnouncement
);

module.exports = router;