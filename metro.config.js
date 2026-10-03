// Learn more https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // isCSSEnabled: true,
});

// Metro's file-map crawl is the dominant cost of `expo start` on this project.
// The native folders, git history and docs are never part of the JS graph but
// Metro still stats every file in them on a cold cache, so keep them out.
config.resolver.blockList = [
  ...(Array.isArray(config.resolver.blockList)
    ? config.resolver.blockList
    : config.resolver.blockList
      ? [config.resolver.blockList]
      : []),
  /[\\/]android[\\/].*/,
  /[\\/]ios[\\/].*/,
  /[\\/]\.git[\\/].*/,
  /[\\/]docs[\\/].*/,
  /[\\/]dist[\\/].*/,
];

module.exports = config;