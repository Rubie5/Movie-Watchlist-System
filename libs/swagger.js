// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie Watchlist System API',
      version: '1.0.0',
      description: 'API documentation for the Movie Watchlist system',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Topic: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '690c5f9b8c7388741280cead' },
            title: { type: 'string', example: 'The Breakfast Mistake' },
            description: { type: 'string', example: 'A funny movie' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Invalid ID' },
          },
        },
      },
    },
  },
  // scan both topics route and [id] route
  apis: ['./app/api/topics/route.js', './app/api/topics/[id]/route.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
