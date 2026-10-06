const express = require('express');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const collectionPointRoutes = require('./routes/collectionPointRoutes');
const containerRoutes = require('./routes/containerRoutes');
const containerAllocationRoutes = require('./routes/containerAllocationRoutes');

const setupSwagger = require('./swagger/swagger');

const app = express();

// Permite receber JSON
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/collection-points', collectionPointRoutes);
app.use('/api/containers', containerRoutes);
app.use('/api/container-allocations', containerAllocationRoutes);

// Swagger
setupSwagger(app);

module.exports = app;