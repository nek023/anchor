/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const config = {
  entry: {
    background: "./src/background/index.ts",
    renderer: "./src/renderer/index.tsx",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CopyPlugin({ patterns: ["public"] }),
    new HtmlWebpackPlugin({
      chunks: ["renderer"],
      template: "./src/index.html",
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
};

module.exports = (env, argv) => {
  if (argv.mode !== "production") {
    config.devtool = "source-map";
  }
  return config;
};
