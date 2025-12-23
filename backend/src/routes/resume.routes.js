const router = require("express").Router();
const { protect } = require("../middleware/Auth");
const { uploadPDF } = require("../middleware/upload");
const { uploadResume } = require("../controllers/resume.controller");

router.post("/upload", protect, uploadPDF.single("resume"), uploadResume);

module.exports = router;
