const { _getQuizzes, _createQuiz, _updateQuiz, _deleteQuiz, _submitQuiz, _resultsOfQuiz} = require('../services/quizzes');

async function getQuizzes(req, res) {
  try {
    const quizzes = await _getQuizzes(req);
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function createQuiz(req, res) {
  try {
    const createdQuiz = await _createQuiz(req);
    res.status(201).json(createdQuiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function updateQuiz(req, res) {
  try { 
    const updateQuiz=await _updateQuiz(req);
    res.status(200).json(updateQuiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function deleteQuiz(req, res) {
  try {
    const deletedQuiz = await _deleteQuiz(req);
    res.status(200).json(deletedQuiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function submitQuiz(req, res) { 
   try {
    const submittedQuiz = await _submitQuiz(req);
    res.status(201).json(submittedQuiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function resultsOfQuiz(req, res) { 
   try {
    const resultsOfQuiz = await _resultsOfQuiz(req);
    res.status(201).json(resultsOfQuiz);
  } catch (error) {
    console.error('Error getting quiz results:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  resultsOfQuiz
};
