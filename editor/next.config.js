const withLinaria = require("next-linaria");
const withTM = require("next-transpile-modules")(["@editor-ui/console"]);

module.exports = withTM(
  withLinaria({
    /**
     * https://console.grida.co/globalization
     */
    basePath: "/globalization",
  })
);
