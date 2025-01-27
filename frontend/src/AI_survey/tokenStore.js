import fs from "fs";
import path from "path";

const TOKEN_PATH = path.join(process.cwd(), "token.json");

export function saveToken(tokens) {
  try {
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  } catch (err) {
    console.error("Error saving token:", err);
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
