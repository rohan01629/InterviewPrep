const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref:"Session", required:true },
  user:    { type: mongoose.Schema.Types.ObjectId, ref:"User", required:true },
  qIndex:  { type:Number, required:true }, // index in session.questions
  questionText: String,
  answerText:   String,
  aiFeedback:   String,   // Gemini explanation/tips
  score:        Number    // 0-10
},{timestamps:true});

module.exports = mongoose.model("Answer", answerSchema);
