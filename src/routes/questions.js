const express = require("express");
const router = express.Router();

const questions = require("../data/questions");

// GET /questions 
// List all questions
router.get("/", (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.json(questions);
  }

  const filteredPosts = questions.filter(post =>
    post.keywords.includes(keyword.toLowerCase())
  );

  res.json(filteredPosts);
});

// GET /questions/:qId
// Show a specific question
router.get("/:qId", (req, res) => {
  const qId = Number(req.params.qId);

  const question = questions.find((q) => q.Qid === qId);

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  res.json(question);
});

// questions /questions
// Create a new question
router.post("/", (req, res) => {
  const { title, date, content, keywords } = req.body;

  if (!title || !date || !content) {
    return res.status(400).json({
      message: "title, date, and content are required"
    });
  }
  const maxId = Math.max(...questions.map(q => q.qid), 0);

  const newQuestion = {
    qid: questions.length ? maxId + 1 : 1,
    title, date, content,
    keywords: Array.isArray(keywords) ? keywords : []
  };
  questions.push(newQuestion);
  res.status(201).json(newQuestion);
});

// PUT /question/:qId
// Edit a question
router.put("/:qId", (req, res) => {
  const qId = Number(req.params.qId);
  const { title, date, content, keywords } = req.body;

  const question = questions.find((q) => q.id === qId);

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  if (!title || !date || !content) {
    return res.json({
      message: "title, date, and content are required"
    });
  }

  question.title = title;
  question.date = date;
  question.content = content;
  question.keywords = Array.isArray(keywords) ? keywords : [];

  res.json(question);
});

// DELETE /questions/:qId
// Delete a question
router.delete("/:qId", (req, res) => {
  const qId = Number(req.params.qId);

  const qIndex = questions.findIndex((q) => q.id === qId);

  if (qIndex === -1) {
    return res.status(404).json({ message: "Question not found" });
  }

  const deletedQuestion = questions.splice(qIndex, 1);

  res.json({
    message: "Question deleted successfully",
    questions: deletedQuestion[0]
  });
});


module.exports = router;
