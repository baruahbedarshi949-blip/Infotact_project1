

function requireEnv(name) {
  const value = process.env[name];

  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

function validateMongoUri(uri) {
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error('MONGO_URI must start with mongodb:// or mongodb+srv://');
  }

  if (uri.includes('cluster0..') || uri.includes('..mongodb.net')) {
    throw new Error('MONGO_URI appears malformed: found consecutive dots in MongoDB host');
  }

  if (uri.includes(' ')) {
    throw new Error('MONGO_URI must not contain spaces');
  }
}

function validateRedisUrl(url) {
  if (!url.startsWith('redis://') && !url.startsWith('rediss://')) {
    throw new Error('REDIS_URL must start with redis:// or rediss://');
  }
}

const env = {
  PORT: process.env.PORT || '5000',

  // ✅ REQUIRED
  MONGO_URI: requireEnv('MONGO_URI'),
  JWT_SECRET: requireEnv('JWT_SECRET'),

  // ✅ OPTIONAL (IMPORTANT FIX)
  REDIS_URL: process.env.REDIS_URL ? process.env.REDIS_URL.trim() : '',
};

// ✅ Validate required
validateMongoUri(env.MONGO_URI);

// ✅ Validate Redis ONLY if provided
if (env.REDIS_URL) {
  validateRedisUrl(env.REDIS_URL);
}

module.exports = env;