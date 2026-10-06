require('dotenv').config();

const app = require('./app');
const db = require('./config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Testa a conexão com o banco antes de iniciar a API
        const connection = await db.getConnection();

        console.log('Conectado ao MySQL!');

        connection.release();

        // Inicia o servidor
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log(`Swagger: http://localhost:${PORT}/api-docs`);
        });

    } catch (error) {
        console.error('Erro ao iniciar o servidor:');
        console.error(error.message);
    }
}

startServer();