import { google } from "googleapis";

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/api/auth/callback"
  );

  const { tokens } = await oAuth2Client.getToken(code);

  console.log("✅ TOKENS:", tokens); // <-- Copy these

  // Optionally, save to DB or .env manually
  return new Response("Authentication successful! You can close this window.");
}
