const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import configs
const { testConnection } = require('./config/database');
const { connectRedis } = require('./config/redis');

// Import routes
const apiRoutes = require('./routes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Şehitkamil Belediyesi Süper Uygulama API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      root: '/',
      health: '/health',
      api: '/api',
    },
    documentation: 'API dokümantasyonu için /api endpoint\'ini ziyaret edin',
  });
});

// Health check endpoint (outside /api)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Initialize database and Redis connections
const initializeConnections = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.warn('⚠️  Database connection failed, but server will continue...');
    }

    // Connect to Redis (optional)
    const redisConnected = await connectRedis();
    if (!redisConnected) {
      console.warn('⚠️  Redis connection failed, but server will continue...');
    }
  } catch (error) {
    console.error('❌ Error initializing connections:', error.message);
  }
};

// Start server
const startServer = async () => {
  try {
    // Initialize connections
    await initializeConnections();

    // Start listening
    app.listen(PORT, () => {
      console.log('🚀 Server running on port', PORT);
      console.log('📦 Environment:', process.env.NODE_ENV || 'development');
      console.log('🔗 Health check: http://localhost:' + PORT + '/health');
      console.log('📚 API docs: http://localhost:' + PORT + '/api');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;
