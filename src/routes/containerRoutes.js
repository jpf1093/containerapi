const express = require('express');

const ContainerController = require('../controllers/ContainerController');

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();


// Listar containers
router.get(
    '/',
    authMiddleware,
    ContainerController.findAll
);


// Buscar container por ID
router.get(
    '/:id',
    authMiddleware,
    ContainerController.findById
);


// Cadastrar container
router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    ContainerController.create
);


// Editar container
router.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    ContainerController.update
);


// Remover container
router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    ContainerController.delete
);


// Atualizar nível de preenchimento
router.patch(
    '/:id/fill-level',
    authMiddleware,
    adminMiddleware,
    ContainerController.updateFillLevel
);


module.exports = router;