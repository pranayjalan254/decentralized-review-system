import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  generateSurveyQuestions,
  createGoogleForm,
} from "../AI_survey/main.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate-questions", async (req, res) => {
  const {
    surveyTitle,
    targetAudience,
    numberOfQuestions,
    additionalRequirements,
  } = req.body;
  try {
    const questions = await generateSurveyQuestions(
      surveyTitle,
      targetAudience,
      numberOfQuestions,
      additionalRequirements
    );
    res.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

app.post("/create-survey", async (req, res) => {
  const { questions, surveyTitle } = req.body;
  try {
    const formUrl = await createGoogleForm(questions, surveyTitle);
    res.json({ formUrl });
  } catch (error) {
    console.error("Error creating survey:", error);
    res.status(500).json({ error: "Failed to create survey" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
