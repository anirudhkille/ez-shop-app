// Learn more https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // isCSSEnabled: true,
});

// Metro's file-map crawl is the dominant cost of `expo start` on this project.
// The native folders, git history and docs are never part of the JS graph but
// Metro still stats every file in them on a cold cache, so keep them out.
//
// These MUST be anchored to the project root. An unanchored pattern such as
// /[\\/]dist[\\/].*/ also matches paths inside node_modules and silently hides
// real source files (e.g. node_modules/whatwg-fetch/dist/fetch.umd.js), which
// breaks module resolution with "this package itself specifies a `main` module
// field that could not be resolved".
const escapeForRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const projectRoot = escapeForRegExp(__dirname);
const onlyAtProjectRoot = (dir) => new RegExp(`^${projectRoot}[\\\\/]${dir}[\\\\/]`);

// Existing Expo defaults first (an array in current SDKs).
const defaults = Array.isArray(config.resolver.blockList)
  ? config.resolver.blockList
  : config.resolver.blockList
    ? [config.resolver.blockList]
    : [];

config.resolver.blockList = [
  ...defaults,
  onlyAtProjectRoot("android"),
  onlyAtProjectRoot("ios"),
  onlyAtProjectRoot("\\.git"),
  onlyAtProjectRoot("docs"),
];

module.exports = config;