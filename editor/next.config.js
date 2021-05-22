const withTM = require("next-transpile-modules")([
  "@reflect-ui/core",
  "@bridged.xyz/base-sdk",
]);

module.exports = withTM({
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Important: return the modified config
    return config;
  },
});
