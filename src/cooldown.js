const cooldowns = new Map();

module.exports = function(userId) {
  const now = Date.now();
  const cooldownAmount = 15000;

  if (cooldowns.has(userId)) {
    const expiration = cooldowns.get(userId);
    if (now < expiration) return false;
  }

  cooldowns.set(userId, now + cooldownAmount);
  return true;
};
