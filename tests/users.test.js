const { createUser, getUsers, login } = require('../controllers/users');
const { _userCreateService, _userGetService, _loginUser } = require('../services/users');

jest.mock('../services/users'); // Mock the service functions

describe('UserController', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  describe('login', () => {
    it('should return a token when login is successful', async () => {
      const req = { /* Mock request object */ };
      const res = { json: jest.fn() };

      _loginUser.mockResolvedValue('mocked-token');

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith('mocked-token');
    });

    it('should return 500 status code and error message on login failure', async () => {
      const req = { /* Mock request object */ };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      _loginUser.mockRejectedValue(new Error('Mocked error'));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  

});
