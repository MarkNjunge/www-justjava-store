const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

// For css and js to be minified, the env can't be development
// But if NODE_ENV is production, webpack won't be installed because it's a dev dependency
// So NODE_ENV and WEBPACK_ENV are seperated so that dev deps can be installed and the code be minified
const mode = process.env.WEBPACK_ENV || "development";

const hwpConfigs = ["index.html", "privacy.html"].map(entryName => {
  return new HtmlWebpackPlugin({
    filename: entryName,
    template: `src/${entryName}`,
    inject: true,
    favicon: "src/assets/favicon.ico"
  });
});

module.exports = {
  mode,
  entry: {
    app: ["./src/styles/main.scss", "./src/styles/index.scss", "./src/styles/privacy.scss"]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    host: "0.0.0.0",
    port: 3000
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: miniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === "development"
            }
          },
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|ico|webp)/,
        loader: "file-loader",
        options: {
          name: "assets/[name].[md5:hash:7].[ext]"
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new miniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new CopyPlugin([
      { from: "./src/assets/SEO.webp", to: "assets/SEO.webp" },
      { from: "./src/assets/forgot-password.jpg", to: "assets/forgot-password.jpg" },
      { from: "./src/assets/logo-brown-30.png", to: "assets/logo-brown-30.png" }
    ])
  ].concat(hwpConfigs)
};
