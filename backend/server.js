import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  generateSurveyQuestions,
  createGoogleForm,
  getAuthUrl,
  authenticateGoogle,
} from "../frontend/src/AI_survey/main.js";

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

app.get("/get-auth-url", async (_req, res) => {
  try {
    const authUrl = getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    console.error("Error getting auth URL:", error);
    res.status(500).json({ error: "Failed to get auth URL" });
  }
});

app.post("/create-survey", async (req, res) => {
  const { questions, surveyTitle, authCode } = req.body;
  try {
    let auth;
    try {
      auth = await authenticateGoogle(authCode);
    } catch (authError) {
      return res.status(401).json({
        error: "Authentication failed",
        details: "Please sign in again",
      });
    }

    const formUrl = await createGoogleForm(questions, surveyTitle, auth);
    res.json({ formUrl });
  } catch (error) {
    console.error("Error details:", error.message);
    res.status(error.status || 500).json({
      error: "Failed to create survey",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
