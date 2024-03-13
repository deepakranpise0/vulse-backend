const { z } = require('zod');

const option = z.string();

const question = z.object({
	text: z.string(),
	options: z.array(option),
	correctOption: z.number(),
});

const MixedCreateQuizSchema = z.object({
	title: z.string(),
	questions: z.array(question),
});

function validateCreateQuiz(req, res, next) {
	try {
		const result = MixedCreateQuizSchema.safeParse(req.body);
		if (result.success) {
			next();
		} else {
			res.status(400).json({ error: result.error.errors });
		}
	} catch (error) {
		res.status(400).json({ error: error.errors });
	}
}

const UpdateQuestion = z.object({
	id: z.number(),
	text: z.string(),
	options: z.array(option),
	correctOption: z.number(),
});

const MixedUpdateQuizSchema = z.object({
	title: z.string(),
	questions: z.array(UpdateQuestion),
});

function validateUpdateQuiz(req, res, next) {
	try {
		const result = MixedUpdateQuizSchema.safeParse(req.body);
		if (result.success) {
			next();
		} else {
			res.status(400).json({ error: result.error.errors });
		}
	} catch (error) {
		res.status(400).json({ error: error.errors });
	}
}

const submitQuestion = z.object({
	id: z.number(),
	selectedOption: z.number(),
});

const MixedSubmitQuizSchema = z.object({
	title: z.string(),
	responses: z.array(submitQuestion),
});

function validateSubmitQuiz(req, res, next) {
	try {
		const result = MixedSubmitQuizSchema.safeParse(req.body);
		if (result.success) {
			next();
		} else {
			res.status(400).json({ error: result.error.errors });
		}
	} catch (error) {
		res.status(400).json({ error: error.errors });
	}
}

module.exports = {
	validateCreateQuiz,
	validateUpdateQuiz,
	validateSubmitQuiz,
};
