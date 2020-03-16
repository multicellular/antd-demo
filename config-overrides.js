const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias
} = require("customize-cra");

const path = require("path");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      "@primary-color": "#0079ff",
    //   hack: `true; @import "./theme.less";` // Override with less file
    }
  }),
  addWebpackAlias({
    "@configs": path.resolve(__dirname, "src/configs"),
    "@assets": path.resolve(__dirname, "src/assets"),
    "@components": path.resolve(__dirname, "src/components"),
    "@apis": path.resolve(__dirname, "src/apis"),
    "@utils": path.resolve(__dirname, "src/utils"),
    "@views": path.resolve(__dirname, "src/views"),
    "@stores": path.resolve(__dirname, "src/stores"),
    "@libs": path.resolve(__dirname, "src/libs")
  })
);
