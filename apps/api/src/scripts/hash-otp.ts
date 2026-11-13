/** Usage: npm run hash-otp -- "your admin password"  →  paste the printed value into .env as ADMIN_OTP_HASH */
import { hashOtp } from "../auth/password.js";
const pw = process.argv[2];
if (!pw) { console.error('Usage: npm run hash-otp -- "your admin password"'); process.exit(1); }
console.log(`ADMIN_OTP_HASH=${hashOtp(pw)}`);
