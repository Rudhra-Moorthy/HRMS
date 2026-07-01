const express = require('express');

const router = express.Router();

const documentController = require('./controller/documentController');

const authenticate = require('../../../middlewares/authenticate');
const authorize = require('../../../middlewares/authorize');

router.post(
    '/',
    authenticate,
    authorize('document.create'),
    documentController.createDocument
);

router.get(
    '/',
    authenticate,
    authorize('document.view'),
    documentController.getAllDocuments
);

router.get(
    '/:id',
    authenticate,
    authorize('document.view'),
    documentController.getDocumentById
);

router.put(
    '/:id',
    authenticate,
    authorize('document.update'),
    documentController.updateDocument
);

router.delete(
    '/:id',
    authenticate,
    authorize('document.delete'),
    documentController.deleteDocument
);

module.exports = router;