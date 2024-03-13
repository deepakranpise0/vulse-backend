const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./swaggerConfig');
const { checkDatabaseConnection } = require('./middleware/databaseConnection');
const { logUserJourney } = require('./middleware/userJourneyLogs');

const swaggerSpec = swaggerJSDoc(swaggerConfig);

const app = express();
checkDatabaseConnection();

app.use(bodyParser.json());
app.use(cors());

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(logUserJourney);

const userRoutes = require('./routes/users');
const quizRoutes =require('./routes/quizzes')

app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
