const bcrypt = require('bcrypt');

const User = require('../models/User');

class UserController {

    // Lista todos os usuários
    static async findAll(req, res) {
        try {
            const users = await User.findAll();

            return res.status(200).json(users);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }


    // Busca um usuário pelo ID
    static async findById(req, res) {
    try {
        const { id } = req.params;

        const requestedUserId = Number(id);

        // OPERATOR só pode consultar a própria conta
        if (
            req.user.role !== 'ADMIN' &&
            req.user.id !== requestedUserId
        ) {
            return res.status(403).json({
                message: 'Você não tem permissão para acessar este usuário'
            });
        }

        const user = await User.findById(requestedUserId);

        if (!user) {
            return res.status(404).json({
                message: 'Usuário não encontrado'
            });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Erro interno do servidor'
        });
    }
}


    // Cadastra um novo usuário
    static async create(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    message: 'Nome, email e senha são obrigatórios'
                });
            }

            // Verifica se já existe usuário com esse email
            const existingUser = await User.findByEmail(email);

            if (existingUser) {
                return res.status(409).json({
                    message: 'Email já cadastrado'
                });
            }

            // Gera o hash da senha
            const passwordHash = await bcrypt.hash(password, 10);

            const userId = await User.create(
                name,
                email,
                passwordHash
            );

            const user = await User.findById(userId);

            return res.status(201).json(user);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }


    // Atualiza nome, email e opcionalmente a senha
    static async update(req, res) {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        const requestedUserId = Number(id);

        // OPERATOR só pode editar a própria conta
        if (
            req.user.role !== 'ADMIN' &&
            req.user.id !== requestedUserId
        ) {
            return res.status(403).json({
                message: 'Você não tem permissão para editar este usuário'
            });
        }

        if (!name || !email) {
            return res.status(400).json({
                message: 'Nome e email são obrigatórios'
            });
        }

        const user = await User.findById(requestedUserId);

        if (!user) {
            return res.status(404).json({
                message: 'Usuário não encontrado'
            });
        }

        const userWithEmail = await User.findByEmail(email);

        if (
            userWithEmail &&
            userWithEmail.id !== requestedUserId
        ) {
            return res.status(409).json({
                message: 'Email já cadastrado'
            });
        }

        let passwordHash = null;

        // Troca de senha é opcional
        if (password) {
            passwordHash = await bcrypt.hash(password, 10);
        }

        await User.update(
            requestedUserId,
            name,
            email,
            passwordHash
        );

        const updatedUser = await User.findById(requestedUserId);

        return res.status(200).json(updatedUser);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Erro interno do servidor'
        });
    }
}   


    // Altera somente a role
    static async updateRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            if (!role) {
                return res.status(400).json({
                    message: 'Role é obrigatória'
                });
            }

            if (!['ADMIN', 'OPERATOR'].includes(role)) {
                return res.status(400).json({
                    message: 'Role inválida'
                });
            }

            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({
                    message: 'Usuário não encontrado'
                });
            }

            await User.updateRole(id, role);

            const updatedUser = await User.findById(id);

            return res.status(200).json(updatedUser);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }


    // Remove um usuário
    static async delete(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({
                    message: 'Usuário não encontrado'
                });
            }

            await User.delete(id);

            return res.status(204).send();

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = UserController;