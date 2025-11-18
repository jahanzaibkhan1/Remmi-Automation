import fs from "fs";
import * as dotenv from "dotenv";

/**
 * Updates or adds an environment variable in the `.env` file
 * and refreshes process.env instantly (works in both UI + headless mode).
 *
 * ✅ Auto-creates .env file if missing
 * ✅ Replaces or appends variable
 * ✅ Reloads dotenv automatically
 * ✅ Updates process.env live
 */
export function updateEnvVariable(key: string, value: string) {
  try {
    const envPath = ".env";

    // 🔹 Ensure .env file exists
    if (!fs.existsSync(envPath)) {
      fs.writeFileSync(envPath, "", "utf8");
      console.log("🆕 Created new .env file");
    }

    // 🔹 Read .env contents
    let envData = fs.readFileSync(envPath, "utf8");

    // 🔹 Regex to find the key (e.g., E2E_MANAGER_OTP_SECRET)
    const regex = new RegExp(`^${key}=.*$`, "m");

    // 🔹 Replace or append the key=value pair
    if (regex.test(envData)) {
      envData = envData.replace(regex, `${key}=${value}`);
    } else {
      envData += `\n${key}=${value}`;
    }

    // 🔹 Write updated env back to file
    fs.writeFileSync(envPath, envData, "utf8");

    // 🔹 Reload env instantly
    dotenv.config({ path: envPath });
    process.env[key] = value;

    console.log(`✅ Updated ${key} in .env and process.env (value: ${value})`);
  } catch (error) {
    console.error("❌ Failed to update environment variable:", error);
  }
}
