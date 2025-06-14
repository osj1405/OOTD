import jwt from 'jsonwebtoken';

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

export function verifySupabaseToken(token) {
  try {
    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);
    return decoded; // { sub, email, ... }
  } catch (err) {
    console.error('Invalid Supabase token:', err);
    return null;
  }
}
