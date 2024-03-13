const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
	const token =
		req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(403).json({ error: 'Forbidden' });
		}
		req.userId = decoded.userId;
		next();
	});
}

module.exports = { authenticate };
