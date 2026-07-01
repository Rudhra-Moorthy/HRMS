const express = require('express');

const router = express.Router();

const documentController = require('./controller/candidateDocumentController');

const authenticate = require('../../../middlewares/authenticate');
const authorize = require('../../../middlewares/authorize');

router.post(
    '/',
    authenticate,
    authorize('candidateDocument.create'),
    documentController.createDocument
);

router.get(
    '/',
    authenticate,
    authorize('candidateDocument.view'),
    documentController.getAllDocuments
);

router.get(
    '/:id',
    authenticate,
    authorize('candidateDocument.view'),
    documentController.getDocumentById
);

router.put(
    '/:id',
    authenticate,
    authorize('candidateDocument.update'),
    documentController.updateDocument
);

router.delete(
    '/:id',
    authenticate,
    authorize('candidateDocument.delete'),
    documentController.deleteDocument
);

router.get('/:id','/candidate/:candidateId',
    authenticate,
    authorize('candidateDocument.view'),
    documentController.getDocumentsByCandidateId
);

module.exports = router;