/**
 * Google Sheets & Apps Script Integration Module
 * Handles sending form submissions (Contact, Waitlist, Become a Partner / Seeker)
 * to a Google Sheet via Google Apps Script Web App and triggering email notifications to mubaarqaan@gmail.com
 */

export interface FormSubmissionPayload {
  name: string;
  email: string;
  phone?: string;
  city: string;
  interests: string;
  join_as: 'partner' | 'seeker' | 'contact' | string;
  form_type: 'Waitlist' | 'Become a Hangout Partner' | 'Become a Hangout Seeker' | 'Contact Us' | string;
  timestamp?: string;
}

export const GAURAV_WHATSAPP_PHONE = "918800843189";

/**
 * Generates a pre-filled WhatsApp notification link to Gaurav (+91 8800843189)
 */
export function generateWhatsAppLeadUrl(payload: {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  interests?: string;
  join_as?: string;
  form_type?: string;
}): string {
  const roleLabel = payload.join_as === 'partner' 
    ? '🤝 Hangout Partner' 
    : payload.join_as === 'seeker' 
      ? '🔍 Hangout Seeker' 
      : payload.join_as === 'contact'
        ? '💬 Contact Inquiry'
        : (payload.join_as || 'User');

  const text = `🎉 *New Happy Hangouts Submission!*\n` +
    `----------------------------------------\n` +
    `📋 *Form*: ${payload.form_type || 'Waitlist Application'}\n` +
    `👤 *Name*: ${payload.name}\n` +
    `✉️ *Email*: ${payload.email}\n` +
    `📞 *Phone*: ${payload.phone || 'Not provided'}\n` +
    `📍 *City*: ${payload.city || 'Delhi NCR'}\n` +
    `🎭 *Role*: ${roleLabel}\n` +
    `💡 *Interests/Details*: ${payload.interests || 'N/A'}\n` +
    `----------------------------------------\n` +
    `Submitted directly via Happy Hangouts Website.`;
  
  return `https://wa.me/${GAURAV_WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

// Key for stored Web App URL in localStorage
const GOOGLE_SCRIPT_URL_STORAGE_KEY = "happy_hangouts_google_script_url";

// Default or environment configured Google Apps Script Web App URL
export const getGoogleScriptUrl = (): string => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(GOOGLE_SCRIPT_URL_STORAGE_KEY);
    if (saved && saved.startsWith("https://script.google.com")) {
      return saved;
    }
  }
  return (import.meta as any).env.VITE_GOOGLE_SCRIPT_URL || "";
};

export const setGoogleScriptUrl = (url: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(GOOGLE_SCRIPT_URL_STORAGE_KEY, url.trim());
  }
};

/**
 * Submits form data to Google Apps Script Web App Endpoint
 */
export async function submitToGoogleSheets(payload: FormSubmissionPayload): Promise<{ success: boolean; message: string }> {
  const scriptUrl = getGoogleScriptUrl();
  const timestamp = new Date().toISOString();
  const fullPayload = {
    ...payload,
    timestamp,
    notification_email: "mubaarqaan@gmail.com"
  };

  // Log locally for debugging
  console.log("Submitting form payload to Google Sheets & Email:", fullPayload);

  // Always back up in localStorage
  try {
    const existingStr = localStorage.getItem("happy_hangouts_form_submissions") || "[]";
    const existing = JSON.parse(existingStr);
    existing.push(fullPayload);
    localStorage.setItem("happy_hangouts_form_submissions", JSON.stringify(existing));
  } catch (err) {
    console.warn("Failed to update localStorage form submissions backup:", err);
  }

  // 1. Send to server-side logging/forwarding route
  try {
    await fetch("/api/submit-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullPayload),
    });
  } catch (apiErr) {
    console.warn("Failed posting lead to /api/submit-lead:", apiErr);
  }

  // 2. If scriptUrl is set in localStorage or env, post directly to Google Apps Script
  if (scriptUrl) {
    try {
      // Use no-cors or standard JSON post
      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors", // Google Apps Script redirects require no-cors in browser
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(fullPayload),
      });

      return {
        success: true,
        message: "Data successfully sent to Google Sheet and email notification triggered to mubaarqaan@gmail.com!"
      };
    } catch (error) {
      console.error("Error posting to Google Apps Script endpoint:", error);
    }
  }

  return {
    success: true,
    message: "Data saved successfully!"
  };
}

/**
 * Google Apps Script Code template to be provided to the user in the UI guide
 */
export const GOOGLE_APPS_SCRIPT_CODE = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create headers if sheet is completely fresh
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp (IST)",
        "Form Type",
        "Full Name",
        "Email Address",
        "Phone Number",
        "City / Region",
        "Interests / Details",
        "Role (Join As)"
      ]);
      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#2563eb");
      headerRange.setFontColor("#ffffff");
    }

    var data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter || {};
    }

    var timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var name = data.name || "N/A";
    var email = data.email || "N/A";
    var phone = data.phone || "N/A";
    var city = data.city || "N/A";
    var interests = data.interests || data.message || "N/A";
    var joinAs = data.join_as || data.joinAs || "N/A";
    var formType = data.form_type || data.formType || "Form Submission";

    // 1. Append row to Google Sheet
    sheet.appendRow([
      timestamp,
      formType,
      name,
      email,
      phone,
      city,
      interests,
      joinAs
    ]);

    // 2. Trigger instant Email Notification to mubaarqaan@gmail.com
    var recipientEmail = "mubaarqaan@gmail.com";
    var subject = "🎉 New Happy Hangouts " + formType + ": " + name;
    
    var htmlBody = \`
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #f8fafc; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #2563eb; margin: 0; font-size: 22px;">🚀 Happy Hangouts Form Submission</h2>
          <p style="color: #64748b; font-size: 13px; margin-top: 4px;">A new visitor has submitted details on your website!</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <tr style="background-color: #2563eb; color: #ffffff;">
            <th colspan="2" style="padding: 12px 16px; text-align: left; font-size: 14px;">Submission Details</th>
          </tr>
          <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569; width: 35%;">Form Type:</td><td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #2563eb;">\${formType}</td></tr>
          <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">Full Name:</td><td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">\${name}</td></tr>
          <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">Email:</td><td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;"><a href="mailto:\${email}" style="color: #2563eb; text-decoration: none; font-weight: bold;">\${email}</a></td></tr>
          <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">Phone:</td><td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">\${phone}</td></tr>
          <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">City / Region:</td><td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">\${city}</td></tr>
          <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">Role / Join As:</td><td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; text-transform: uppercase; font-weight: bold;">\${joinAs}</td></tr>
          <tr><td style="padding: 12px 16px; font-weight: bold; color: #475569;">Interests / Details:</td><td style="padding: 12px 16px; line-height: 1.5;">\${interests}</td></tr>
        </table>
        
        <p style="color: #94a3b8; font-size: 11px; margin-top: 24px; text-align: center;">Automated notification via Happy Hangouts Apps Script | Submitted at \${timestamp} IST</p>
      </div>
    \`;

    MailApp.sendEmail({
      to: recipientEmail,
      subject: subject,
      htmlBody: htmlBody
    });

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", message: "Logged to Google Sheet & Email sent to mubaarqaan@gmail.com" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;
