import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/oauth2callback", (req, res) => {
  const code = req.query.code;
  if (code) {
    res.send(`
      <script>
        window.opener.postMessage({ code: '${code}' }, 'https://true-score.vercel.app');
        window.close();
      </script>
    `);
  } else {
    res.status(400).send("No code received");
  }
});

const AUTH_PORT = 3001;
app.listen(AUTH_PORT, () => {
  console.log(`Auth server running on port ${AUTH_PORT}`);
});
