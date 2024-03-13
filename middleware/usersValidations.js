const { z } = require('zod');

const ROLE = ['ADMIN', 'USER'];

const userSchema = z.object({
	username: z.string(),
	email: z.string().email(),
	password: z.string().min(6),
	role: z.enum(ROLE),
});

function validateUser(req, res, next) {
	try {
		userSchema.parse(req.body);
		next();
	} catch (error) {
		res.status(400).json({ error: error.errors });
	}
}

const loginRequest = z.object({
	username: z.string(),
	password: z.string().min(6),
});

function validateLogin(req, res, next) {
	try {
		loginRequest.parse(req.body);
		next();
	} catch (error) {
		res.status(400).json({ error: error.errors });
	}
}

module.exports = { validateUser, validateLogin };
