import { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  // CORS Headers for secure API responses
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "CORS preflight OK" }),
    };
  }

  // Reject non-POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: "Method Not Allowed. Use POST." }),
    };
  }

  try {
    const payload = event.body ? JSON.parse(event.body) : {};

    // Validate required fields
    if (!payload.name || !payload.email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: "Missing required fields: name and email are required.",
        }),
      };
    }

    const timestamp = new Date().toISOString();
    const fullPayload = {
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone ? payload.phone.trim() : "",
      city: payload.city || "Delhi NCR",
      location_area: payload.location_area || "",
      free_time: payload.free_time || "",
      interests: payload.interests || "N/A",
      join_as: payload.join_as || "seeker",
      form_type: payload.form_type || "Waitlist Application",
      timestamp,
      notification_email: "mubaarqaan@gmail.com",
    };

    console.log("==========================================");
    console.log("📬 NEW LEAD SUBMISSION RECEIVED ON NETLIFY:");
    console.log("Name:", fullPayload.name);
    console.log("Email:", fullPayload.email);
    console.log("Phone:", fullPayload.phone);
    console.log("City:", fullPayload.city);
    console.log("Location / Area:", fullPayload.location_area);
    console.log("Free Time:", fullPayload.free_time);
    console.log("Form Type:", fullPayload.form_type);
    console.log("Role / Join As:", fullPayload.join_as);
    console.log("Notification Email:", fullPayload.notification_email);
    console.log("Timestamp:", timestamp);
    console.log("==========================================");

    // Optional forwarding to Google Apps Script if GOOGLE_SCRIPT_URL is configured in Netlify env vars
    const googleScriptUrl =
      process.env.GOOGLE_SCRIPT_URL ||
      process.env.VITE_GOOGLE_SCRIPT_URL ||
      payload.scriptUrl;

    let forwardedToGoogle = false;

    if (googleScriptUrl) {
      try {
        const scriptRes = await fetch(googleScriptUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(fullPayload),
        });
        console.log("✅ Forwarded lead to Google Apps Script. Status:", scriptRes.status);
        forwardedToGoogle = true;
      } catch (forwardErr) {
        console.error("⚠️ Failed to forward lead to Google Apps Script:", forwardErr);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Form submission recorded successfully!",
        forwardedToGoogle,
        data: {
          name: fullPayload.name,
          email: fullPayload.email,
          timestamp: fullPayload.timestamp,
        },
      }),
    };
  } catch (err: any) {
    console.error("Error in Netlify submit-lead function:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: "Failed to process form submission. " + (err?.message || ""),
      }),
    };
  }
};
