const { _userCreateService,_userGetService,_loginUser } = require('../services/users');

async function login(req, res) {
  try {
    const token = await _loginUser(req);
    res.json(token);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUsers(req, res) {
  try {
    const users = await _userGetService(req);
    res.json(users);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createUser(req, res) {
  try {
    const user = await _userCreateService(req.body);
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getUsers, createUser,login };
