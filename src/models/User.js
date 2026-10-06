const db = require('../config/database');

class User {

    // Lista todos os usuários
    static async findAll() {
        const [rows] = await db.query(
            `SELECT id, name, email, role, created_at, updated_at
             FROM users`
        );

        return rows;
    }


    // Busca um usuário pelo ID
    static async findById(id) {
        const [rows] = await db.query(
            `SELECT id, name, email, role, created_at, updated_at
             FROM users
             WHERE id = ?`,
            [id]
        );

        return rows[0];
    }


    // Busca um usuário pelo email
    // Aqui usamos SELECT * porque o login precisa acessar o password
    static async findByEmail(email) {
        const [rows] = await db.query(
            `SELECT *
             FROM users
             WHERE email = ?`,
            [email]
        );

        return rows[0];
    }


    // Cria um novo usuário
    // A role não é enviada porque o banco define OPERATOR como padrão
    static async create(name, email, password) {
        const [result] = await db.query(
            `INSERT INTO users (name, email, password)
             VALUES (?, ?, ?)`,
            [name, email, password]
        );

        return result.insertId;
    }


    // Atualiza os dados do usuário
    // A role NÃO pode ser alterada por este método
    static async update(id, name, email, password) {

        if (password) {
            const [result] = await db.query(
                `UPDATE users
                 SET name = ?,
                     email = ?,
                     password = ?
                 WHERE id = ?`,
                [name, email, password, id]
            );

            return result.affectedRows;
        }

        const [result] = await db.query(
            `UPDATE users
             SET name = ?,
                 email = ?
             WHERE id = ?`,
            [name, email, id]
        );

        return result.affectedRows;
    }


    // Atualiza somente a role
    // O Controller/rota posteriormente garantirá que apenas ADMIN use isso
    static async updateRole(id, role) {
        const [result] = await db.query(
            `UPDATE users
             SET role = ?
             WHERE id = ?`,
            [role, id]
        );

        return result.affectedRows;
    }


    // Remove um usuário
    static async delete(id) {
        const [result] = await db.query(
            `DELETE FROM users
             WHERE id = ?`,
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = User;