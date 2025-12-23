const {
  extractResumeText,
  extractSkills,
} = require("../services/resume.service");

const uploadResume = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "PDF required" });

    const text = await extractResumeText(req.file.path);
    const skills = extractSkills(text);

    res.status(201).json({
      file: req.file.filename,
      skills,
      chars: text.length,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { uploadResume };
