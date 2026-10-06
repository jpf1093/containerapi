const express = require('express');

const CollectionPointController = require('../controllers/CollectionPointController');

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

router.get(
    '/',
    authMiddleware,
    CollectionPointController.findAll
);

router.get(
    '/:id',
    authMiddleware,
    CollectionPointController.findById
);

router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    CollectionPointController.create
);

router.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    CollectionPointController.update
);

router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    CollectionPointController.delete
);

module.exports = router;