const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

class AuthController {

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Verifica se email e senha foram enviados
            if (!email || !password) {
                return res.status(400).json({
                    message: 'Email e senha são obrigatórios'
                });
            }

            // Procura o usuário pelo email
            const user = await User.findByEmail(email);

            if (!user) {
                return res.status(401).json({
                    message: 'Email ou senha inválidos'
                });
            }

            // Compara a senha enviada com o hash salvo no banco
            const passwordIsValid = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).json({
                    message: 'Email ou senha inválidos'
                });
            }

            // Gera o JWT
            const token = jwt.sign(
                {
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    subject: String(user.id),
                    expiresIn: process.env.JWT_EXPIRES_IN || '8h'
                }
            );

            return res.status(200).json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = AuthController;