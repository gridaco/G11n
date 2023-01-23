const withLinaria = require("next-linaria");

/**
 * @type {import('next').NextConfig}
 */
const config = {
  /**
   * https://console.grida.co/globalization
   */
  basePath: "/globalization",
  transpilePackages: ["@editor-ui/console"],
};

module.exports = withLinaria(config);
