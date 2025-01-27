import { google } from "googleapis";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import readline from "readline";
import { saveToken, loadToken } from "./tokenStore.js";

dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  "635117093146-lvsthljols4k7v7rfrke0h389qiqm2ao.apps.googleusercontent.com",
  "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",
  "http://localhost:3001/oauth2callback"
);

export function getAuthUrl() {
  const SCOPES = ["https://www.googleapis.com/auth/forms.body"];
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
}

export async function authenticateGoogle(code) {
  try {
    const savedToken = loadToken();
    if (savedToken) {
      oAuth2Client.setCredentials(savedToken);
      if (savedToken.expiry_date && savedToken.expiry_date < Date.now()) {
        const { credentials } = await oAuth2Client.refreshToken(
          savedToken.refresh_token
        );
        saveToken(credentials);
        oAuth2Client.setCredentials(credentials);
      }
    } else if (code) {
      const { tokens } = await oAuth2Client.getToken(code);
      saveToken(tokens);
      oAuth2Client.setCredentials(tokens);
    } else {
      throw new Error("No authentication code or saved token available");
    }

    return oAuth2Client;
  } catch (error) {
    console.error("Authentication error:", error);
    throw new Error("Failed to authenticate with Google");
  }
}

export async function generateSurveyQuestions(
  surveyTopic,
  audience,
  totalQuestions,
  additionalDetails
) {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyC_1--2UVdcNkZQZDk8DgIvUtre7DuT-ug"
  );
  const prompt = `
    "You are an expert survey designer with deep knowledge of psychology, user engagement, and data collection best practices. Your task is to create an effective Google Forms survey that maximizes respondent attention, minimizes survey completion time, and ensures the collection of all necessary data for the specified purpose.

Follow these guidelines while generating the survey:

Survey Objective Alignment:

Clearly define the survey's goal and ensure every question aligns with the objective.
Minimize irrelevant or redundant questions while covering essential aspects.
Ensure the survey can be completed within 5-10 minutes.
Survey Structure & Flow:


Use a logical sequence, grouping related questions into well-defined sections.
Apply skip logic/conditional branching to show only relevant questions based on previous answers.
Question Optimization:

Write clear, concise, and unbiased questions using simple language.
Avoid leading, double-barreled, or vague questions.
Use a variety of question types appropriately:
Multiple-choice for quick responses.
Likert scale for opinions.
Dropdowns for long lists.
Short text only when necessary.
Minimizing Cognitive Load:

Use progress indicators to encourage completion.
Reduce visual clutter by organizing questions logically.
Include pre-filled options or suggestions to speed up responses.
Visual & Accessibility Considerations:

Ensure mobile-friendliness with responsive layouts.
Use contrasting colors, readable fonts, and ample spacing for clarity.
Include optional image-based questions for engagement.
Engagement Techniques:

Personalize the survey using friendly and conversational language.
Offer optional fields for additional input without making them mandatory.
Consider adding fun elements like emojis or micro-interactions to maintain interest.
Response Collection & Validation:

Validate numerical inputs and required fields to ensure data accuracy.
Allow respondents to review answers before submission.
Provide an optional section for additional comments/feedback.


    Create a ${surveyTopic} survey with ${totalQuestions} questions for ${audience}.
    Distribute question types as follows:
    - ${Math.floor(totalQuestions * 0.3)} Multiple choice questions
    - ${Math.floor(totalQuestions * 0.2)} Checkbox questions
    - ${Math.floor(totalQuestions * 0.2)} Short answer questions
    - ${Math.floor(totalQuestions * 0.15)} Linear scale questions
    - ${Math.ceil(totalQuestions * 0.15)} Paragraph questions

    Format:
    ---
    Type: [multiple_choice/checkbox/short_answer/linear_scale/paragraph]
    Question: [question text]
    Options: (for multiple_choice and checkbox only)
    - Option 1
    - Option 2
    - Option 3
    - Option 4
    Scale: (for linear_scale only) [1-5/1-10]
    Labels: (for linear_scale only) [start label] to [end label]
    ---

    Additional context: ${additionalDetails}
    `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return parseQuestions(await result.response.text());
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}

export function parseQuestions(aiResponse) {
  const questions = [];
  const sections = aiResponse.split("---").filter((section) => section.trim());

  for (const section of sections) {
    const lines = section.trim().split("\n");
    const question = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("Type:")) {
        question.type = line.replace("Type:", "").trim().toLowerCase();
      } else if (line.startsWith("Question:")) {
        question.question = line.replace("Question:", "").trim();
      } else if (line.startsWith("Options:")) {
        question.options = [];
        i++;
        while (i < lines.length && lines[i].trim().startsWith("-")) {
          question.options.push(lines[i].trim().substring(1).trim());
          i++;
        }
        i--;
      } else if (line.startsWith("Scale:")) {
        const scale = line.replace("Scale:", "").trim();
        const [min, max] = scale.split("-").map(Number);
        question.scale = { min, max };
      } else if (line.startsWith("Labels:")) {
        const labels = line.replace("Labels:", "").trim().split(" to ");
        question.labels = { start: labels[0], end: labels[1] };
      }
    }

    if (question.type && question.question) {
      questions.push(question);
    }
  }

  return questions;
}

export async function createGoogleForm(questions, formTitle, auth) {
  try {
    const forms = google.forms({ version: "v1", auth });

    const form = await forms.forms.create({
      requestBody: {
        info: { title: formTitle, documentTitle: formTitle },
      },
    });

    const formId = form.data.formId;
    const requests = questions.map((q, idx) => {
      const request = {
        createItem: {
          item: {
            title: q.question,
            questionItem: {
              question: { required: false },
            },
          },
          location: { index: idx },
        },
      };

      switch (q.type) {
        case "multiple_choice":
          request.createItem.item.questionItem.question.choiceQuestion = {
            type: "RADIO",
            options: q.options.map((opt) => ({ value: opt })),
            shuffle: false,
          };
          break;
        case "checkbox":
          request.createItem.item.questionItem.question.choiceQuestion = {
            type: "CHECKBOX",
            options: q.options.map((opt) => ({ value: opt })),
            shuffle: false,
          };
          break;
        case "linear_scale":
          request.createItem.item.questionItem.question.scaleQuestion = {
            low: q.scale?.min || 1,
            high: q.scale?.max || 5,
            lowLabel: q.labels?.start || "Poor",
            highLabel: q.labels?.end || "Excellent",
          };
          break;
        case "paragraph":
          request.createItem.item.questionItem.question.textQuestion = {
            paragraph: true,
          };
          break;
        default:
          request.createItem.item.questionItem.question.textQuestion = {
            paragraph: false,
          };
      }

      return request;
    });

    await forms.forms.batchUpdate({
      formId,
      requestBody: { requests },
    });

    return `https://docs.google.com/forms/d/${formId}/viewform`;
  } catch (error) {
    if (error.response?.status === 401) {
      try {
        const newAuth = await authenticateGoogle();
        const forms = google.forms({ version: "v1", auth: newAuth });
      } catch (refreshError) {
        throw new Error("Authentication expired. Please sign in again.");
      }
    }
    throw error;
  }
}

export async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt) =>
    new Promise((resolve) => rl.question(prompt, resolve));

  try {
    const surveyTopic = await question("Enter the survey topic: ");
    const audience = await question("Enter the target audience: ");
    const totalQuestions = parseInt(
      await question("Enter the number of questions: "),
      10
    );
    const additionalDetails = await question(
      "Enter any additional requirements (optional): "
    );

    console.log("\nGenerating survey questions...");
    const questions = await generateSurveyQuestions(
      surveyTopic,
      audience,
      totalQuestions,
      additionalDetails
    );

    console.log("\nCreating Google Form...");
    const formUrl = await createGoogleForm(questions, `${surveyTopic} Survey`);

    console.log(`\nForm created successfully! Access it here: ${formUrl}`);
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    rl.close();
  }
}
