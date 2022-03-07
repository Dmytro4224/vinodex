const webpack = require("webpack")

module.exports = function override(config, env) {
  //do stuff with the webpack config...

  config.resolve.fallback = {
    ...config.resolve.fallback,
    stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer"),
  };

  config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"];

  config.module.rules.push(
    {
      test: /\.mjs/,
      type: "javascript/auto",
    }
  );
  config.module.rules.push(
    {
      test: /\.mjs/,
      resolve: {
        fullySpecified: false,
      }
    }
  );

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ];

  return config;
}
