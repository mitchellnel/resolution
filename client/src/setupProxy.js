const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  console.log("setupProxy.js called");
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://resolution-api-bcmmz.onrender.com/",
      changeOrigin: true,
    })
  );
};
