
import emailValidator from "node-email-verifier";
import { logServerError } from "@/lib/security/safeLogging";

export async function verifyEmailAddress(email: string) {
  try {
    const result = await emailValidator(email, {
      checkMx: true,          // check domain MX records
      checkDisposable: true,  // detect disposable mail providers
      timeout: "5s",          // optional DNS lookup timeout
      detailed: true          // get detailed validation info
    });

    return result;
  } catch (err) {
    logServerError("Email verification lookup", err);
    // if fail on DNS etc., return a simple false status
    return { valid: false };
  }
}
