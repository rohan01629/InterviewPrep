const router = require("express").Router();
const { protect } = require("../middleware/Auth");
const {
  createSession,
  listSessions,
  getSession,
  submitAnswer,
  completeSession,
  getReport,
} = require("../controllers/interview.controller");

router.use(protect);
router.post("/sessions", createSession);
router.get("/sessions", listSessions);
router.get("/sessions/:id", getSession);
router.post("/sessions/:id/answers", submitAnswer);
router.post("/sessions/:id/complete", completeSession);
router.get("/sessions/:id/report", getReport);

module.exports = router;
