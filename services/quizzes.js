const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function _getQuizzes(req) {
	try {
		const { id, sortBy, sortOrder, page, limit, search } = req.query;

		let where = {};
		if (id) {
			where.id = parseInt(id);
		}
		if (search) {
			where.OR = [
				{ title: { contains: search } }, // Replace field1 with the field you want to search in
			];
		}
		const usersData = await prisma.quiz.findMany({
			where,
			orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : undefined,
			take: limit ? parseInt(limit) : undefined,
			skip: page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined,
			include: {
				questions: true,
			},
		});
		return usersData;
	} catch (error) {
		console.error('Error fetching quizzes:', error);
	} finally {
		await prisma.$disconnect();
	}
}

async function _createQuiz(req) {
	const { title, questions } = req.body;
	try {
		const createdQuiz = await prisma.quiz.create({
			data: {
				title,
				questions: {
					create: questions,
				},
			},
			include: {
				questions: true,
			},
		});
		return { message: 'Quiz created successfully', data: createdQuiz };
	} catch (error) {
		console.error('Error creating quiz:', error);
	} finally {
		await prisma.$disconnect();
	}
}

async function _updateQuiz(req) {
	try {
		let { id } = req.params;
		id = parseInt(id);
		const { title, questions } = req.body;
		const updatedQuiz = await prisma.quiz.update({
			where: { id: id },
			data: {
				title,
				questions: {
					upsert: questions.map((question) => ({
						where: { id: question.id || undefined },
						create: question,
						update: question.id
							? {
									text: question.text,
									options: question.options,
									correctOption: question.correctOption,
							  }
							: undefined,
					})),
				},
			},
			include: {
				questions: true,
			},
		});
		return { message: 'Quiz updated successfully', data: updatedQuiz };
	} catch (error) {
		console.error('Error updating quiz:', error);
	} finally {
		await prisma.$disconnect();
	}
}

async function _deleteQuiz(req) {
	try {
		let { id } = req.params;
		id = parseInt(id);

		await prisma.question.deleteMany({ where: { quizId: id } });

		await prisma.quiz.deleteMany({ where: { id } });

		return { message: 'Quiz deleted successfully' };
	} catch (error) {
		console.error('Error deleting quiz:', error);
	} finally {
		await prisma.$disconnect();
	}
}

async function _submitQuiz(req) {
	try {
		let { id } = req.params;
		const { userId } = req;
		id = parseInt(id);
		const { responses } = req.body;
		const quiz = await prisma.quiz.findUnique({
			where: { id },
			include: {
				questions: true,
			},
		});

		if (!quiz) {
			return { error: 'Quiz not found' };
		} else {
			

			let score = 0;
			for (const response of responses) {
				const question = quiz.questions.find(
					(q) => q.id === response.id
				);
				if (question && question.correctOption === response.selectedOption) {
					score++;
				}
			}
			await prisma.userResponse.create({
				data: {
					userId,
					quizId: id,
					responses,
					score
				},
			});
			return { Score: score };
		}
	} catch (error) {
		console.error('Error submitting quiz response:', error);
	}
}

async function _resultsOfQuiz(req) {
	try {
		const { userId } = req;
		const results = await prisma.userResponse.findMany({
			where: { userId },
			include: { user: true, quiz: true },
		});

		return results;
	} catch (error) {
		console.error('Error submitting quiz response:', error);
	}
}

module.exports = {
	_getQuizzes,
	_createQuiz,
	_updateQuiz,
	_deleteQuiz,
	_submitQuiz,
	_resultsOfQuiz,
};
