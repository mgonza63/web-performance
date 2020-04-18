const config = {
    entry: "./index.js",
    output: {
      path: __dirname + "/dist",
      filename: "bundle.js"
    },
    mode: "development" // https://webpack.js.org/configuration/mode/
  };
  
  module.exports = config;