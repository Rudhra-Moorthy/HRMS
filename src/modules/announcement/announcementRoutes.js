const express = require('express');
const router = express.Router();

const announcementController = require('./controller/announcementController');

const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');

router.post(
    '/',
    authenticate,
    authorize('announcement.create'),
    announcementController.createAnnouncement
);

router.get(
    '/',
    authenticate,
    authorize('announcement.view'),
    announcementController.getAllAnnouncements
);

router.get(
    '/:id',
    authenticate,
    authorize('announcement.view'),
    announcementController.getAnnouncementById
);

router.patch(
    '/:id',
    authenticate,
    authorize('announcement.update'),
    announcementController.updateAnnouncement
);

router.delete(
    '/:id',
    authenticate,
    authorize('announcement.delete'),
    announcementController.deleteAnnouncement
);

module.exports = router;