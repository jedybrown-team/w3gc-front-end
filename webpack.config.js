import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import webpack from "webpack";
import dotenv from "dotenv";

dotenv.config();

export default {
  mode: "production",
  entry: "./src/main.jsx",
  output: {
    path: path.resolve(process.cwd(), "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  devServer: {
    static: {
      directory: path.join(process.cwd(), "dist"),
    },
    port: 5173,
    open: true,
    historyApiFallback: true,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.module\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webmanifest)$/i,
        type: "asset/resource",
        generator: {
          filename: "img/[hash][ext][query]",
        },
      },
      {
        test: /\.(mp4)$/i,
        type: "asset/resource",
        generator: {
          filename: "videos/[hash][ext][query]",
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/favicons", to: "favicons" },
        { from: "public/img", to: "img" },
      ],
    }),
    new webpack.DefinePlugin({
      "process.env.FORMSPREE_URL": JSON.stringify(process.env.FORMSPREE_URL),
      "process.env.REACT_APP_BACKEND_URL": JSON.stringify(
        process.env.REACT_APP_BACKEND_URL
      ),
      "process.env.REACT_APP_FIREBASE_API_KEY": JSON.stringify(
        process.env.REACT_APP_FIREBASE_API_KEY
      ),
      "process.env.REACT_APP_FIREBASE_AUTH_DOMAIN": JSON.stringify(
        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
      ),
      "process.env.REACT_APP_FIREBASE_PROJECT_ID": JSON.stringify(
        process.env.REACT_APP_FIREBASE_PROJECT_ID
      ),
      "process.env.REACT_APP_FIREBASE_STORAGE_BUCKET": JSON.stringify(
        process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
      ),
      "process.env.REACT_APP_FIREBASE_MSG_SENDER_ID": JSON.stringify(
        process.env.REACT_APP_FIREBASE_MSG_SENDER_ID
      ),
      "process.env.REACT_APP_FIREBASE_APP_ID": JSON.stringify(
        process.env.REACT_APP_FIREBASE_APP_ID
      ),
      "process.env.REACT_APP_FIREBASE_MEASUREMENT_ID": JSON.stringify(
        process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
      ),
      "process.env.REACT_APP_FIREBASE_DATABASE_URL": JSON.stringify(
        process.env.REACT_APP_FIREBASE_DATABASE_URL
      ),
    }),
  ],
};
