const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Şehitkamil Belediyesi Süper Uygulama API',
      version: '1.0.0',
      description: 'Şehitkamil Belediyesi Süper Uygulama için RESTful API dokümantasyonu',
      contact: {
        name: 'API Support',
        email: 'support@sehitkamil.bel.tr',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:4000/api',
        description: 'Development server',
      },
      {
        url: 'https://api.sehitkamil.bel.tr/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token almak için /api/auth/login endpoint\'ini kullanın',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Error Type',
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Success message',
            },
            data: {
              type: 'object',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Şehitkamil Belediyesi API Dokümantasyonu',
  customfavIcon: '/favicon.ico',
};

module.exports = {
  swaggerSpec,
  swaggerUi,
  swaggerOptions,
};

