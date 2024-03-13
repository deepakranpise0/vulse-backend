const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function _userGetService(req) {
	try {
		const { id, sortBy, sortOrder, page, limit, search } = req.query;

		let where = {};
		if (id) {
			where.id = parseInt(id);
		}
		if (search) {
			where.OR = [
				{ userName: { contains: search } }, // Replace field1 with the field you want to search in
				{ email: { contains: search } }, // Replace field2 with another field to search in
			];
		}
		const usersData = await prisma.user.findMany({
			where,
			orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : undefined,
			take: limit ? parseInt(limit) : undefined,
			skip: page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined,
		});
		return usersData;
	} catch (error) {
		console.error('Error fetching users:', error);
	} finally {
		await prisma.$disconnect();
	}
}

async function _userCreateService(req) {
	try {
		req.password = await bcrypt.hash(req.password, 10);
		const userCreated = await prisma.user.create({ data: req });
		return { message: 'User Created Successfully.', data: userCreated };
	} catch (error) {
		console.log(error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

async function _loginUser(data) {
	console.log(data.body);
	const { username, password } = data.body;

	const user = await prisma.user.findUnique({
		where: { username },
	});

	if (!user) {
		throw new Error('User not found');
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		throw new Error('Invalid credentials');
	}

	const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
		expiresIn: '1h',
	});
	return token;
}

module.exports = { _userCreateService, _userGetService, _loginUser };
