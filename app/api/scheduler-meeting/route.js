import { google } from "googleapis";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return new Response(JSON.stringify({ message: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { name, email, phone, date, time, meetLink } = body;

  if (!name || !email || !phone || !date || !time || !meetLink) {
    return new Response(
      JSON.stringify({ message: "Missing required fields" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  try {
    await oAuth2Client.getAccessToken(); // Refresh token if needed
  } catch (tokenError) {
    console.error("Token refresh failed:", tokenError);
    return new Response(
      JSON.stringify({
        message: "Authentication failed",
        error: tokenError.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  const startDateTime = new Date(`${date}T${time}`);
  if (isNaN(startDateTime.getTime())) {
    return new Response(
      JSON.stringify({ message: "Invalid date or time format" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 min meeting

  const event = {
    summary: `Meeting with ${name}`,
    description: `Phone: ${phone} \n MeetingLink: ${meetLink}`,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    link: {
      MeetingLink: `${meetLink}`,
    },
    attendees: [{ email }, { email: process.env.GOOGLE_EMAIL_ID }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 10 },
        { method: "popup", minutes: 10 },
      ],
    },
  };
  console.log(event);
  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      sendUpdates: "all",
    });

    return new Response(
      JSON.stringify({
        message: "Meeting Scheduled Successfully",
        event: response.data,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(
      "Google Calendar API Error:",
      error.response?.data || error.message
    );
    return new Response(
      JSON.stringify({
        message: "Error scheduling meeting",
        error: error.response?.data || error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
