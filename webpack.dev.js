const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    static: path.join(__dirname, "docs"),
    compress: true,
    port: 3000,
    historyApiFallback: true,
  },
});
