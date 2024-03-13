const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function logUserJourney(req, res, next) {
	const { method, url, body } = req;
	const originalSend = res.send;
	res.send = function (data) {
		const { statusCode } = res;
		const { userId } = req;
		saveUserJourney(method, url, userId, body, statusCode, data);
		originalSend.call(res, data);
	};

	next();
}

async function saveUserJourney(
	method,
	url,
	userId,
	requestBody,
	statusCode,
	responseBody
) {
	try {
		await prisma.$connect();
		if (!userId) {
			userId = 1;
		}
		await prisma.userJourney.create({
			data: {
				method,
				url,
				userId,
				request_body: JSON.stringify(requestBody),
				status_code: statusCode,
				response_body: JSON.stringify(responseBody),
			},
		});
	} catch (error) {
		console.log(error);
	}
}

module.exports = { logUserJourney };
