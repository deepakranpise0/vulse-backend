const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const {
	getQuizzes,
	createQuiz,
	updateQuiz,
	deleteQuiz,
	submitQuiz,
	resultsOfQuiz,
} = require('../controllers/quizzes');
const {
	validateCreateQuiz,
	validateUpdateQuiz,
	validateSubmitQuiz,
} = require('../middleware/quizzesValidations');

/**
 * @swagger
 * /results:
 *   get:
 *     tags:
 *       - Quiz Results
 *     summary: Get quiz results
 *     description: Retrieves the results of a quiz for the authenticated user.
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2I3YWNlYTJkNzE4NjE0ZDgxY2M5N2UiLCJyb2xlIjoidXNlciIsImVtYWlsIjoidGVzdEBzYWdlYmFzZS5vcmciLCJuYW1lIjoiVGVzdCBVc2VyIiwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNTgzMjQyMDE3LCJleHAiOjE1ODMyNjM2MTd9.WfuudSh23iXNUClpqxvIIRi92GH_xlxwYSvc1PiAoqY'
 *     responses:
 *       '200':
 *         description: Quiz results retrieved successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               quizId:
 *                 type: integer
 *               responses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     selectedOption:
 *                       type: integer
 *               user:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   role:
 *                     type: string
 *               quiz:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
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
router.get('/results', authenticate, resultsOfQuiz);

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Get All Quiz
 *     summary: Get quizzes
 *     description: Retrieves a list of quizzes.
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2I3YWNlYTJkNzE4NjE0ZDgxY2M5N2UiLCJyb2xlIjoidXNlciIsImVtYWlsIjoidGVzdEBzYWdlYmFzZS5vcmciLCJuYW1lIjoiVGVzdCBVc2VyIiwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNTgzMjQyMDE3LCJleHAiOjE1ODMyNjM2MTd9.WfuudSh23iXNUClpqxvIIRi92GH_xlxwYSvc1PiAoqY'
 *     responses:
 *       '200':
 *         description: Quizzes retrieved successfully
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               title:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     text:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                     correctOption:
 *                       type: integer
 *                     quizId:
 *                       type: integer
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
router.get('', getQuizzes);

/**
 * @swagger
 * /quizzes:
 *   post:
 *     tags:
 *       - Create Quiz
 *     summary: Create a new quiz
 *     description: Creates a new quiz with the provided title and questions.
 *     parameters:
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2I3YWNlYTJkNzE4NjE0ZDgxY2M5N2UiLCJyb2xlIjoidXNlciIsImVtYWlsIjoidGVzdEBzYWdlYmFzZS5vcmciLCJuYW1lIjoiVGVzdCBVc2VyIiwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNTgzMjQyMDE3LCJleHAiOjE1ODMyNjM2MTd9.WfuudSh23iXNUClpqxvIIRi92GH_xlxwYSvc1PiAoqY'
 *       - in: body
 *         name: quiz
 *         required: true
 *         description: New quiz details
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - questions
 *           properties:
 *             title:
 *               type: string
 *               example: "Maths Quiz3"
 *             questions:
 *               type: array
 *               items:
 *                 type: object
 *                 required:
 *                   - text
 *                   - options
 *                   - correctOption
 *                 properties:
 *                   text:
 *                     type: string
 *                     example: "2+2"
 *                   options:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: ["4","6","7","8"]
 *                   correctOption:
 *                     type: integer
 *                     example: 1
 *     responses:
 *       '201':
 *         description: Quiz created successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Quiz created successfully"
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       text:
 *                         type: string
 *                       options:
 *                         type: array
 *                         items:
 *                           type: string
 *                       correctOption:
 *                         type: integer
 *                       quizId:
 *                         type: integer
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
router.post('', authenticate, validateCreateQuiz, createQuiz);

/**
 * @swagger
 * /quizzes/{id}:
 *   put:
 *     tags:
 *       - Update Quiz
 *     summary: Update a quiz
 *     description: Updates an existing quiz with the provided ID and details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the quiz to update
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2I3YWNlYTJkNzE4NjE0ZDgxY2M5N2UiLCJyb2xlIjoidXNlciIsImVtYWlsIjoidGVzdEBzYWdlYmFzZS5vcmciLCJuYW1lIjoiVGVzdCBVc2VyIiwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNTgzMjQyMDE3LCJleHAiOjE1ODMyNjM2MTd9.WfuudSh23iXNUClpqxvIIRi92GH_xlxwYSvc1PiAoqY'
 *       - in: body
 *         name: quiz
 *         required: true
 *         description: Updated quiz details
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - questions
 *           properties:
 *             title:
 *               type: string
 *               example: "Maths Quiz"
 *             questions:
 *               type: array
 *               items:
 *                 type: object
 *                 required:
 *                   - id
 *                   - text
 *                   - options
 *                   - correctOption
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   text:
 *                     type: string
 *                     example: "(2+2)/2"
 *                   options:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: ["4","2","7","8"]
 *                   correctOption:
 *                     type: integer
 *                     example: 2
 *     responses:
 *       '200':
 *         description: Quiz updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Quiz updated successfully"
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       text:
 *                         type: string
 *                       options:
 *                         type: array
 *                         items:
 *                           type: string
 *                       correctOption:
 *                         type: integer
 *                       quizId:
 *                         type: integer
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
 *       '404':
 *         description: Not Found. Quiz with the specified ID not found.
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Quiz not found."
 *       '500':
 *         description: Internal Server Error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "Internal Server Error. Please try again later."
 */
router.put('/:id', authenticate, validateUpdateQuiz, updateQuiz);

/**
 * @swagger
 * /quiz/{id}:
 *   delete:
 *     tags:
 *       - Delete Quiz
 *     summary: Delete a quiz
 *     description: Deletes a quiz by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the quiz to delete
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       '200':
 *         description: Quiz deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quiz deleted successfully
 *       '401':
 *         description: Unauthorized. Invalid or missing authentication token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized. Invalid or missing authentication token.
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error. Please try again later.
 */
router.delete('/:id', authenticate, deleteQuiz);

/**
 * @swagger
 * /quizzes/{id}:
 *   post:
 *     tags:
 *       - Submit Quiz
 *     summary: Submit a quiz
 *     description: Submits a quiz with the provided ID along with the user's responses.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the quiz to submit.
 *       - in: body
 *         name: body
 *         required: true
 *         description: Quiz submission data
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: "Maths Quiz3"
 *             responses:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     example: 1
 *                   selectedOption:
 *                     type: number
 *                     example: 2
 *     responses:
 *       '200':
 *         description: Quiz submitted successfully
 *         schema:
 *           type: object
 *           properties:
 *             Score:
 *               type: number
 *               example: 0
 */
router.post('/:id', authenticate, validateSubmitQuiz, submitQuiz);

module.exports = router;
