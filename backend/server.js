const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = require("./src/app");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB is connected"))
  .catch((e) => {
    console.error("MongoDB Error", e.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running is on PORT 5000🚀 http://localhost:${PORT}`)
);
//console.log("GEMINI KEY:", process.env.GEMINI_API_KEY?.slice(0, 10));
