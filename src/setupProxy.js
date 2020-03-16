const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "https://rfinex.vip",
      secure: true,
      changeOrigin: true,
      pathRewrite: {
        // '^/api': ''
      }
    }),
    createProxyMiddleware("/socket.io", {
      target: "https://push.rfinex.vip",
      secure: true,
      changeOrigin: true,
      pathRewrite: {
        // '^/api': ''
      }
    })
  );
};
