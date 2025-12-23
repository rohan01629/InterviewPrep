const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.4,
    maxOutputTokens: 1200, //VERY IMPORTANT
  },
});

/**
 * Extract JSON from Gemini text (handles ```json fences)
 */
function extractJSON(text) {
  if (!text) return null;

  // Remove ```json and ```
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ JSON PARSE ERROR\n", cleaned);
    return null;
  }
}

exports.generateQuestions = async ({ role, skills }) => {
  const prompt = `
Generate exactly 10 interview questions for the role: ${role}

Rules:
- 6 technical questions (skills: ${skills.join(", ")})
- 4 behavioral questions
- Return ONLY valid JSON
- No explanation
- No markdown

JSON format:
{
  "questions": [
    { "type": "technical", "text": "question here" }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("RAW GEMINI RESPONSE:\n", text);

    if (!text) return [];

    const parsed = extractJSON(text);

    if (!parsed || !Array.isArray(parsed.questions)) {
      console.error("❌ Invalid questions JSON");
      return [];
    }

    return parsed.questions;
  } catch (err) {
    console.error("❌ Gemini Error:", err.message);
    return [];
  }
};

exports.evaluateAnswer = async ({ role, question, answer }) => {
  const prompt = `
Evaluate this interview answer for the role: ${role}

Question: ${question}
Answer: ${answer}

Return ONLY JSON:
{
  "score": 0-10,
  "feedback": "short feedback"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const parsed = extractJSON(text);

    if (!parsed) {
      return { score: 0, feedback: "Invalid AI response" };
    }

    return parsed;
  } catch (err) {
    return { score: 0, feedback: "Evaluation failed" };
  }
};
