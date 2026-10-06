const express = require('express');

const UserController = require('../controllers/UserController');

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();


// Listar usuários
router.get(
    '/',
    authMiddleware,
    adminMiddleware,
    UserController.findAll
);


// Buscar usuário por ID
router.get(
    '/:id',
    authMiddleware,
    UserController.findById
);


// Cadastrar usuário
router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    UserController.create
);


// Editar usuário
router.put(
    '/:id',
    authMiddleware,
    UserController.update
);


// Alterar role
router.patch(
    '/:id/role',
    authMiddleware,
    adminMiddleware,
    UserController.updateRole
);


// Remover usuário
router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    UserController.delete
);


module.exports = router;