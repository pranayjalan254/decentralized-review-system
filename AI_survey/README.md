# AI Survey Generator

This application generates surveys using Google Forms and AI-powered question generation.

## Setup Instructions

1. **Install Dependencies**
```bash
npm install
```

2. **Set up Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google Forms API and Google Drive API for your project

3. **Get OAuth 2.0 Credentials**
   - In Google Cloud Console, go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" and select "OAuth client ID"
   - Choose "Desktop app" as the application type
   - Download the credentials and save them as `credentials.json` in the project root directory

4. **Run the Application**
```bash
npm start
```

The first time you run the application, it will open a browser window asking you to authenticate with your Google account. After authentication, the token will be saved locally for future use.

## Features

- Generate survey questions using AI
- Support for multiple question types:
  - Multiple choice
  - Checkbox
  - Dropdown
  - Short answer
  - Paragraph
  - Linear scale
  - Date
  - Time
- Automatic form creation in Google Forms
- Custom options for choice-based questions

## Troubleshooting

If you encounter authentication errors:
1. Make sure `credentials.json` is in the project root directory
2. Delete `token.json` if it exists and try again
3. Ensure you have enabled the necessary Google APIs
4. Check that you're using the correct OAuth 2.0 credentials type (Desktop app) 