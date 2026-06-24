const { swaggerUi, specs } = require('./config/swagger');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const apiRoutes = require('./modules/index');

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Global routes
app.use('/api', apiRoutes);

module.exports = app;

