module.exports =  {
  "presets": [
      "module:metro-react-native-babel-preset",
      "module:react-native-dotenv"
  ],
  "plugins": [
    // ["@babel/plugin-proposal-class-properties", { "loose": true }]
    // class-properties is required to run tests, but it occurs another problem:
    // https://github.com/facebook/react-native/issues/24421
  ]
};
