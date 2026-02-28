const { COOLDOWN_MINUTES } = require("./limits");

const cooldowns = new Map();

function getRemainingMs(guildId) {
  const last = cooldowns.get(guildId);
  if (!last) return 0;
  const diff = Date.now() - last;
  const total = COOLDOWN_MINUTES * 60 * 1000;
  return Math.max(0, total - diff);
}

function setCooldown(guildId) {
  cooldowns.set(guildId, Date.now());
}

function formatRemaining(ms) {
  const sec = Math.ceil(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

module.exports = { getRemainingMs, setCooldown, formatRemaining };
