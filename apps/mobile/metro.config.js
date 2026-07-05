const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// This is a monorepo (npm workspaces) — Metro needs to know about the
// workspace root so it can resolve @happyhour/* packages and hoisted deps.
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
