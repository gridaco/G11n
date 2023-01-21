const withTM = require('next-transpile-modules')(['@editor-ui/console']);

module.exports = withTM({
  /**
   * https://console.grida.co/globalization
   */
  basePath: '/globalization',
});
