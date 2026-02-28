function formatChannel(name, emoji, style, useEmojis) {
  if (!useEmojis) return name.toLowerCase().replace(/\s+/g, "-");
  if (style === "emoji_bar") return `${emoji}┃${name.toLowerCase().replace(/\s+/g, "-")}`;
  return `${emoji}・${name.toLowerCase().replace(/\s+/g, "-")}`;
}

function formatCategory(name, emoji, style, useEmojis) {
  if (style === "dash_style") {
    return useEmojis ? `──── ${emoji} ${name} ────` : `──── ${name} ────`;
  }
  return useEmojis ? `★・・${emoji}・・★` : `★・・${name}・・★`;
}

function formatRole(name, emoji, style, useEmojis) {
  if (!useEmojis) return name;
  if (style === "emoji_space") return `${emoji} ${name}`;
  if (style === "emoji_dot") return `${emoji}・${name}`;
  return `${emoji}┃${name}`;
}

module.exports = { formatChannel, formatCategory, formatRole };
