const rateLimitMap = new Map();

const rateLimit = (maxRequests = 100, windowMs = 60000) => {
  return (socket, next) => {
    const key = socket.handshake.address;
    const now = Date.now();
    const record = rateLimitMap.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > record.resetAt) {
      record.count = 0;
      record.resetAt = now + windowMs;
    }

    record.count++;
    rateLimitMap.set(key, record);

    if (record.count > maxRequests) {
      return next(new Error('Rate limit exceeded'));
    }

    next();
  };
};

module.exports = { rateLimit };
