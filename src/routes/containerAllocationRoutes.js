const express = require('express');

const ContainerAllocationController = require('../controllers/ContainerAllocationController');

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();


// Listar todas as alocações
router.get(
    '/',
    authMiddleware,
    ContainerAllocationController.findAll
);


// Buscar alocação por ID
router.get(
    '/:id',
    authMiddleware,
    ContainerAllocationController.findById
);


// Criar alocação
router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    ContainerAllocationController.create
);


// Atualizar alocação
router.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    ContainerAllocationController.update
);


// Remover alocação
router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    ContainerAllocationController.delete
);


module.exports = router;