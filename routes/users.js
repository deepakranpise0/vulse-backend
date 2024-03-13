const express = require('express');
const router = express.Router();

const {
	validateUser,
	validateLogin,
} = require('../middleware/usersValidations');
const { getUsers, createUser, login } = require('../controllers/users');
const { authenticate } = require('../middleware/authenticate');

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Login
 *     summary: User login
 *     description: Logs in a user with a username and password. Returns an authentication token.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Username password for login
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - password
 *           properties:
 *             username:
 *               type: string
 *               example: "newUser"
 *             password:
 *               type: string
 *               example: "password123"
 *     responses:
 *       '201':
 *         description: Login successful. Returns token.
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               example: "token string"
 *       '400':
 *         description: Bad Request. Invalid input or missing required fields.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Invalid input. Missing required fields."
 *       '401':
 *         description: Unauthorized. Invalid or missing authentication token.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Unauthorized. Invalid or missing authentication token."
 *       '500':
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Internal Server Error. Please try again later."
 */
router.post('/login', validateLogin, login);

/**
 * @swagger
 * /getUsers:
 *   get:
 *     tags:
 *       - GetAllUsers
 *     summary: Returns list of all users present in the application.
 *     description: Returns an array of users. You can filter users by providing optional parameters.
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2I3YWNlYTJkNzE4NjE0ZDgxY2M5N2UiLCJyb2xlIjoidXNlciIsImVtYWlsIjoidGVzdEBzYWdlYmFzZS5vcmciLCJuYW1lIjoiVGVzdCBVc2VyIiwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNTgzMjQyMDE3LCJleHAiOjE1ODMyNjM2MTd9.WfuudSh23iXNUClpqxvIIRi92GH_xlxwYSvc1PiAoqY'
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *           format: int64
 *         description: Optional user ID to filter users by.
 *         example: 123
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Optional search query to filter users by username or email.
 *         example: "john"
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: List of users
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "1"
 *               username:
 *                 type: string
 *                 example: "masterUser"
 *               email:
 *                 type: string
 *                 example: "masterUser@gmail.com"
 *               password:
 *                 type: string
 *                 example: "$2b$10$dskfw1w74uwS.9zBV0CvVebCiWT2rLVC.ltL0KY7T2/JYseAoyHBq"
 *               role:
 *                 type: string
 *                 example: "ADMIN"
 *       '403':
 *         description: Unauthorized Access for user
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Forbidden"
 *       '500':
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             level:
 *               type: string
 *               example: "error"
 *             message:
 *               type: string
 *               example: "Something went wrong, please try again later"
 */
router.get('', authenticate, getUsers);

/**
 * @swagger
 * /createUser:
 *   post:
 *     tags:
 *       - CreateUser
 *     summary: Create a new user
 *     description: Creates a new user with the provided username, email, password, and role.
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2I3YWNlYTJkNzE4NjE0ZDgxY2M5N2UiLCJyb2xlIjoidXNlciIsImVtYWlsIjoidGVzdEBzYWdlYmFzZS5vcmciLCJuYW1lIjoiVGVzdCBVc2VyIiwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNTgzMjQyMDE3LCJleHAiOjE1ODMyNjM2MTd9.WfuudSh23iXNUClpqxvIIRi92GH_xlxwYSvc1PiAoqY'
 *       - in: body
 *         name: body
 *         required: true
 *         description: Create a new user
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - username
 *             - password
 *             - role
 *           properties:
 *             username:
 *               type: string
 *               example: "newUser"
 *             email:
 *               type: string
 *               format: email
 *               example: "newUser@example.com"
 *             password:
 *               type: string
 *               example: "password123"
 *             role:
 *               type: string
 *               enum: ["ADMIN", "USER"]  # Corrected enum definition
 *               example: "USER"
 *     responses:
 *       '201':
 *         description: User created successfully
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "1"
 *             username:
 *               type: string
 *               example: "newUser"
 *             email:
 *               type: string
 *               example: "newUser@example.com"
 *             role:
 *               type: string
 *               example: "USER"
 *       '400':
 *         description: Bad Request. Invalid input or missing required fields.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Invalid input. Missing required fields."
 *       '401':
 *         description: Unauthorized. Invalid or missing authentication token.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Unauthorized. Invalid or missing authentication token."
 *       '500':
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Internal Server Error. Please try again later."
 */
router.post('', authenticate, validateUser, createUser);

module.exports = router;
