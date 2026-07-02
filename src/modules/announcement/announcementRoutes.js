const express = require('express');
const router = express.Router();

const announcementController = require('./controller/announcementController');

const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

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
 *     summary: Create announcement
 *     description: Creates a new announcement for the selected target audience.
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
 *         description: Server side error
 */
router.post(
    '/',
    authenticate,
    authorize('announcement.create'),
    announcementController.createAnnouncement
);

/**
 * @swagger
 * /announcements:
 *   get:
 *     summary: Get all announcements
 *     description: Retrieves all announcements ordered by latest created date.
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
 *         description: Server side error
 */
router.get(
    '/',
    authenticate,
    authorize('announcement.view'),
    announcementController.getAllAnnouncements
);

/**
 * @swagger
 * /announcements/{id}:
 *   get:
 *     summary: Get announcement by ID
 *     description: Retrieves an announcement using its ID.
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Announcement not found
 *       500:
 *         description: Server side error
 */
router.get(
    '/:id',
    authenticate,
    authorize('announcement.view'),
    announcementController.getAnnouncementById
);

/**
 * @swagger
 * /announcements/{id}:
 *   patch:
 *     summary: Update announcement
 *     description: Updates an existing announcement.
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
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Announcement not found
 *       500:
 *         description: Server side error
 */
router.patch(
    '/:id',
    authenticate,
    authorize('announcement.update'),
    announcementController.updateAnnouncement
);

/**
 * @swagger
 * /announcements/{id}:
 *   delete:
 *     summary: Delete announcement
 *     description: Deletes an announcement using its ID.
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Announcement not found
 *       500:
 *         description: Server side error
 */
router.delete(
    '/:id',
    authenticate,
    authorize('announcement.delete'),
    announcementController.deleteAnnouncement
);

module.exports = router;