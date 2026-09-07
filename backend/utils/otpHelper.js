import crypto from 'crypto';

/**
 * Generates a cryptographically secure 6-digit numeric OTP string.
 */
export const generateOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * Produces a secure hash of the OTP tied to the user's email and server secret.
 * Plaintext OTPs are never stored in the database.
 */
export const hashOtp = (otp, email) => {
  const secret = process.env.OTP_SECRET || process.env.JWT_SECRET || 'tf_otp_salt_fallback_key';
  const normalizedEmail = (email || '').trim().toLowerCase();
  return crypto
    .createHash('sha256')
    .update(`${normalizedEmail}:${otp.trim()}:${secret}`)
    .digest('hex');
};

/**
 * Compares candidate OTP against stored hash using constant-time comparison
 * to eliminate timing side-channel attacks.
 */
export const verifyOtpHash = (candidateOtp, email, storedHash) => {
  if (!candidateOtp || !email || !storedHash) return false;
  const calculatedHash = hashOtp(candidateOtp, email);

  const bufA = Buffer.from(calculatedHash, 'hex');
  const bufB = Buffer.from(storedHash, 'hex');

  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};
