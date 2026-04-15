const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const User = require('../models/User');

function generateReferralCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

async function ensureReferralCode(user) {
  if (user.referralCode) return user.referralCode;
  let code = generateReferralCode();
  while (await User.findOne({ referralCode: code })) {
    code = generateReferralCode();
  }
  user.referralCode = code;
  await user.save();
  return code;
}

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || 'dev-13py8orx1jq30sww.us.auth0.com';
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE; // e.g. https://smi-api or your API identifier

const jwksUri = `https://${AUTH0_DOMAIN}/.well-known/jwks.json`;
const client = jwksClient({ jwksUri, cache: true, rateLimit: true });

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

/**
 * Verifies Auth0 JWT, finds or creates user by auth0Id (sub), sets req.userId.
 * Requires AUTH0_AUDIENCE to be set when using Auth0 (so access tokens are JWTs).
 */
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Auth0 JWT verification (when audience is configured)
    if (AUTH0_AUDIENCE) {
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, getKey, { audience: AUTH0_AUDIENCE, issuer: `https://${AUTH0_DOMAIN}/` }, (err, decoded) => {
          if (err) return reject(err);
          resolve(decoded);
        });
      });

      const auth0Id = decoded.sub;
      // Access tokens often omit `email` unless added via Auth0 Action; support namespaced custom claims too
      const audNs = AUTH0_AUDIENCE ? String(AUTH0_AUDIENCE).replace(/\/$/, '') : '';
      const tokenEmailRaw =
        decoded.email ||
        decoded['https://smi-api/email'] ||
        (audNs ? decoded[`${audNs}/email`] : null);
      const tokenEmail =
        tokenEmailRaw && typeof tokenEmailRaw === 'string' && tokenEmailRaw.includes('@')
          ? tokenEmailRaw.toLowerCase().trim()
          : null;

      let user = await User.findOne({ auth0Id });

      if (!user) {
        const name = decoded.name || decoded.nickname || auth0Id;
        const email = tokenEmail || `${auth0Id.replace(/[|]/g, '_')}@auth0.local`;
        const username = (tokenEmail && tokenEmail.split('@')[0]) || auth0Id.replace(/[|]/g, '_');
        const uniqueUsername = await ensureUniqueUsername(username);
        user = await User.create({
          auth0Id,
          name,
          email: email.toLowerCase(),
          username: uniqueUsername.toLowerCase(),
          passwordHash: null,
          balance: 0,
          wallet: 0,
          transactions: []
        });
        await ensureReferralCode(user);
      } else if (tokenEmail && !tokenEmail.endsWith('@auth0.local')) {
        // Upgrade placeholder emails once the API token carries a real address
        const placeholder = user.email && String(user.email).endsWith('@auth0.local');
        if (placeholder && user.email !== tokenEmail) {
          const taken = await User.findOne({ email: tokenEmail, _id: { $ne: user._id } });
          if (!taken) {
            user.email = tokenEmail;
            await user.save();
          }
        }
      }
      req.userId = user._id.toString();
      return next();
    }

    // Fallback: legacy JWT (our own secret) for backward compatibility
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    req.userId = decoded.sub;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

async function ensureUniqueUsername(base) {
  let username = base;
  let suffix = 0;
  while (await User.findOne({ username: username.toLowerCase() })) {
    suffix += 1;
    username = `${base}${suffix}`;
  }
  return username;
}

module.exports = authMiddleware;
module.exports.ensureReferralCode = ensureReferralCode;
