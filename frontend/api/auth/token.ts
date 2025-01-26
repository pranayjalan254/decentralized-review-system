import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

export default async (req: any, res: any) => {
  const { code } = req.body;

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    res.json({ id_token: tokens.id_token });
  } catch (error) {
    res.status(400).json({ error: "Invalid code" });
  }
};
