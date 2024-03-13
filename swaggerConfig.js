const swaggerDefinition = {
  info: {
    title: 'Vulse API',
    version: '1.0.0',
    description: 'Vulse Swagger API documentation',
  },
  basePath: '/',
};

module.exports = {
  swaggerDefinition,
     apis: ['./routes/*.js'], // Path to the API route files
};
