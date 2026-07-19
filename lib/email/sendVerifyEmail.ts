import { brevo } from "./brevo";

function renderVerificationEmailHtml(verifyUrl: string) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>Verify your FileFlux account</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <!-- Preheader (hidden preview text in inbox list) -->
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">
      Verify your email to finish setting up FileFlux. This link expires in 15 minutes.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%; background-color:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e4e4e7;">

            <!-- Header -->
            <tr>
              <td style="padding:32px 40px 0 40px; text-align:center;">
                <span style="font-size:20px; font-weight:700; color:#18181b; letter-spacing:-0.02em;">
                  FileFlux
                </span>
              </td>
            </tr>

            <!-- Icon -->
            <tr>
              <td style="padding:24px 40px 0 40px; text-align:center;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td style="width:56px; height:56px; border-radius:50%; background-color:#eef2ff; text-align:center; vertical-align:middle;">
                      <span style="font-size:24px; line-height:56px;">✉️</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:20px 40px 0 40px; text-align:center;">
                <h1 style="margin:0 0 12px 0; font-size:20px; line-height:28px; color:#18181b; font-weight:600;">
                  Verify your email
                </h1>
                <p style="margin:0; font-size:14px; line-height:22px; color:#71717a;">
                  Thanks for signing up for FileFlux. Confirm this is your email address to activate your account.
                </p>
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td style="padding:28px 40px 8px 40px;" align="center">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:10px; background-color:#4f46e5;">
                      <a
                        href="${verifyUrl}"
                        target="_blank"
                        style="display:inline-block; padding:12px 32px; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:10px;"
                      >
                        Verify email address
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Expiry note -->
            <tr>
              <td style="padding:8px 40px 0 40px; text-align:center;">
                <p style="margin:0; font-size:12px; line-height:18px; color:#a1a1aa;">
                  This link expires in 24 hours.
                </p>
              </td>
            </tr>

            <!-- Fallback link -->
            <tr>
              <td style="padding:24px 40px 0 40px;">
                <p style="margin:0 0 6px 0; font-size:12px; color:#a1a1aa;">
                  Button not working? Paste this link into your browser:
                </p>
                <p style="margin:0; font-size:12px; color:#4f46e5; word-break:break-all;">
                  <a href="${verifyUrl}" style="color:#4f46e5; text-decoration:underline;">${verifyUrl}</a>
                </p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:28px 40px 0 40px;">
                <div style="border-top:1px solid #e4e4e7;"></div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 40px 32px 40px; text-align:center;">
                <p style="margin:0; font-size:12px; line-height:18px; color:#a1a1aa;">
                  If you didn't create a FileFlux account, you can safely ignore this email.
                </p>
              </td>
            </tr>

          </table>

          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%;">
            <tr>
              <td style="padding:20px 40px; text-align:center;">
                <p style="margin:0; font-size:12px; color:#a1a1aa;">
                  © ${new Date().getFullYear()} FileFlux. All rights reserved.
                </p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

function renderVerificationEmailText(verifyUrl: string) {
  return [
    "Verify your FileFlux account",
    "",
    "Thanks for signing up. Confirm this is your email address to activate your account:",
    verifyUrl,
    "",
    "This link expires in 24 hours.",
    "",
    "If you didn't create a FileFlux account, you can safely ignore this email.",
  ].join("\n");
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email/${token}`;

  await brevo.transactionalEmails.sendTransacEmail({
    sender: {
      email: process.env.EMAIL_FROM!,
      name: process.env.EMAIL_FROM_NAME!,
    },
    to: [{ email }],
    subject: "Verify your FileFlux account",
    htmlContent: renderVerificationEmailHtml(verifyUrl),
    textContent: renderVerificationEmailText(verifyUrl),
  });
}