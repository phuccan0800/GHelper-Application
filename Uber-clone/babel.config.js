const { plugin } = require("twrnc");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugin: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env"
        }
      ]
    ]
  };
};
