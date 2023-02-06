const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  console.log("setupProxy.js called");
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:3333",
      changeOrigin: true,
    })
  );
};
