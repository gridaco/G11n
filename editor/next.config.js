const withTM = require("next-transpile-modules")([
  "@reflect-ui/core",
  "@bridged.xyz/base-sdk",
  //   "react-konva",
]);

module.exports = withTM({
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 100000,
        },
      },
    });

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Important: return the modified config
    return config;
  },

  /**
   * https://console.bridged.xyz/globalization
   */
  basePath: "/globalization",
});
