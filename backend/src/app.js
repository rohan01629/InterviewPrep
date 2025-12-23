const express = require("express");
const authRoutes = require("./routes/auth.routes");
const interviewRoutes = require("./routes/interview.routes");
const resumeRoutes = require("./routes/resume.routes");

const app=express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok:true }));

 app.use("/api/auth", authRoutes);
 app.use("/api/resume", resumeRoutes);
 app.use("/api/interview", interviewRoutes);

module.exports = app;