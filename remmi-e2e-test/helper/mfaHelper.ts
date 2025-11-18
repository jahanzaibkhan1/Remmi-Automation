import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import jsqr from 'jsqr';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

/**
 * Decode QR (base64 or file path) and extract MFA secret.
 * Returns object with secret and type of authenticator (google/microsoft/authy)
 */
export async function extractSecretFromQr(
  input: string
): Promise<{ secret: string; type: 'google' | 'microsoft' | 'authy' }> {
  try {
    let buffer: Buffer;

    if (input.startsWith('data:image')) {
      const base64Data = input.split(',')[1];
      buffer = Buffer.from(base64Data, 'base64');
    } else {
      buffer = fs.readFileSync(input);
    }

    const img = PNG.sync.read(buffer);
    const code = jsqr(new Uint8ClampedArray(img.data), img.width, img.height);

    if (!code?.data) throw new Error('QR code data not found');

    const qrData = code.data.toLowerCase();

    // Determine type
    let type: 'google' | 'microsoft' | 'authy' = 'google';
    if (qrData.includes('microsoft')) type = 'microsoft';
    else if (qrData.includes('authy')) type = 'authy';

    if (!qrData.includes('secret=')) throw new Error('Secret not found in QR');

    const secret = code.data.split('secret=')[1].split('&')[0];
    return { secret, type };
  } catch {
    // Fail silently (no console logs)
    return null as any;
  }
}

/**
 * Update or append key=value in .env file silently (no console output)
 */
export function updateEnvVariable(key: string, value: string) {
  const envPath = path.resolve(process.cwd(), '.env');
  let envData = '';

  if (fs.existsSync(envPath)) envData = fs.readFileSync(envPath, 'utf8');

  const regex = new RegExp(`^${key}=.*`, 'm');
  if (regex.test(envData)) envData = envData.replace(regex, `${key}=${value}`);
  else {
    if (envData.length > 0 && !envData.endsWith('\n')) envData += '\n';
    envData += `${key}=${value}\n`;
  }

  fs.writeFileSync(envPath, envData);
}

/**
 * Fetch OTP silently via verify-mfa API (no console logs)
 */
export async function generateOtp(
  type?: 'google' | 'microsoft' | 'authy'
): Promise<string> {
  type = type || 'google';
  let secretEnvVar = '';
  if (type === 'google') secretEnvVar = 'E2E_MANAGER_GOOGLE_SECRET';
  else if (type === 'microsoft') secretEnvVar = 'E2E_MANAGER_MICROSOFT_SECRET';
  else if (type === 'authy') secretEnvVar = 'E2E_MANAGER_AUTHY_SECRET';

  const secret = process.env[secretEnvVar];
  if (!secret) {
    throw new Error(
      `Secret for ${type} not set. Expected ${secretEnvVar} in .env`
    );
  }

  const apiUrl = 'https://staging.remmi.com.au/api/v1/verify-mfa';
  const payload = JSON.stringify({ secret, type });
  const url = new URL(apiUrl);

  const options: https.RequestOptions = {
    method: 'POST',
    hostname: url.hostname,
    path: url.pathname,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  return new Promise<string>((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (!parsed || typeof parsed.otp !== 'string') {
            reject(new Error(`Invalid OTP response: ${data}`));
            return;
          }
          resolve(parsed.otp);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}
