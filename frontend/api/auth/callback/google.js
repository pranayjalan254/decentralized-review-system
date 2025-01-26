const { google } = require("googleapis");

export default async function handler(req, res) {
  const { code } = req.query;

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);
    res.redirect(`/dashboard?id_token=${tokens.id_token}`);
  } catch (error) {
    res.redirect("/?error=auth_failed");
  }
}
