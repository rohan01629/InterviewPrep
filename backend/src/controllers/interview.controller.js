const Session = require("../models/Session");
const Answer = require("../models/Answer");
const {
  generateQuestions,
  evaluateAnswer,
} = require("../services/gemini.service");

exports.createSession = async (req, res) => {
  try {
    let { role, seniority, skills } = req.body;

    // Ensure skills is always an array
    if (!Array.isArray(skills)) skills = [];

    // Generate questions from Gemini
    const qs = await generateQuestions({ role, skills });
    console.log("GENERATED QUESTIONS:", qs);

    const session = await Session.create({
      user: req.user._id,
      role,
      seniority,
      skills,
      questions: qs || [], // fallback to empty array
      status: "active",
    });

    res.status(201).json(session);
  } catch (err) {
    console.error("❌ createSession Error:", err.message);
    res
      .status(500)
      .json({ message: "Failed to create session", error: err.message });
  }
};

exports.listSessions = async (req, res) => {
  try {
    const list = await Session.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSession = async (req, res) => {
  try {
    const s = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!s) return res.status(404).json({ message: "Not found" });
    res.json(s);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { qIndex, answerText } = req.body;

    const session = await Session.findOne({ _id: id, user: req.user._id });
    if (!session) return res.status(404).json({ message: "Session not found" });

    const question = session.questions[qIndex];
    if (!question) return res.status(400).json({ message: "Invalid qIndex" });

    const evalRes = await evaluateAnswer({
      role: session.role,
      question: question.text,
      answer: answerText,
    });

    const ans = await Answer.create({
      session: session._id,
      user: req.user._id,
      qIndex,
      questionText: question.text,
      answerText,
      aiFeedback: evalRes.feedback,
      score: evalRes.score,
    });

    res.status(201).json(ans);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.completeSession = async (req, res) => {
  try {
    const s = await Session.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: "completed" },
      { new: true }
    );
    if (!s) return res.status(404).json({ message: "Not found" });
    res.json(s);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReport = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const owns = await Session.exists({ _id: sessionId, user: req.user._id });
    if (!owns) return res.status(404).json({ message: "Session not found" });

    const answers = await Answer.find({
      session: sessionId,
      user: req.user._id,
    });
    const avg = answers.length
      ? answers.reduce((a, b) => a + (b.score || 0), 0) / answers.length
      : 0;
    res.json({ averageScore: Number(avg.toFixed(2)), answers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
