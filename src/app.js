const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const collectionPointRoutes = require('./routes/collectionPointRoutes');
const containerRoutes = require('./routes/containerRoutes');
const containerAllocationRoutes = require('./routes/containerAllocationRoutes');

const setupSwagger = require('./swagger/swagger');

const app = express();

// CORS
app.use(cors());

// JSON
app.use(express.json());

// Rota simples para verificar se a API está online
app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Container API está funcionando'
    });
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/collection-points', collectionPointRoutes);
app.use('/api/containers', containerRoutes);
app.use('/api/container-allocations', containerAllocationRoutes);

// Swagger
setupSwagger(app);

module.exports = app;