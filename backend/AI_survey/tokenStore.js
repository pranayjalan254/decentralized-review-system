import fs from "fs";
import path from "path";

const TOKEN_PATH = path.join(process.cwd(), "token.json");

export function saveToken(tokens) {
  try {
    let existingTokens = {};
    try {
      existingTokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
    } catch (e) {}

    const mergedTokens = {
      ...existingTokens,
      ...tokens,
      refresh_token: tokens.refresh_token || existingTokens.refresh_token,
    };

    fs.writeFileSync(TOKEN_PATH, JSON.stringify(mergedTokens, null, 2));
    return mergedTokens;
  } catch (err) {
    console.error("Error saving token:", err);
    throw err;
  }
}

export function loadToken() {
  try {
    if (fs.existsSync(TOKEN_PATH)) {
      return JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
    }
  } catch (err) {
    console.error("Error loading token:", err);
  }
  return null;
}
