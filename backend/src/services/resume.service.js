const pdf = require("pdf-parse");
const fs = require("fs");

const extractResumeText = async (filePath) => {
  const data = await pdf(fs.readFileSync(filePath));
  return data.text || "";
};

// naive skills extraction
const extractSkills = (text) => {
  const SKILLS = [
    "node",
    "express",
    "mongodb",
    "react",
    "docker",
    "aws",
    "redis",
    "kafka",
    "typescript",
  ];
  const lower = text.toLowerCase();
  return SKILLS.filter((s) => lower.includes(s)).map((s) => s.toUpperCase());
};

module.exports = {
  extractResumeText,
  extractSkills, // ✅ SAME NAME
};
