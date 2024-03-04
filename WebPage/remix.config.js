/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.test.{ts,tsx}"],
  serverModuleFormat: "cjs"
  // other Remix configurations...
  // postcss: {
  //   plugins: [require("postcss-scss")()]
  // }
};
