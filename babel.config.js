// module.exports = {
//   root: true,
//   extends: [
//     'airbnb',
//     'plugin:react-native/all',
//     'plugin:prettier/recommended' // ⬅️ Add this line
//   ],
//   plugins: ['react', 'react-native', 'prettier'], // ⬅️ Add 'prettier'
//   env: {
//     browser: true,
//     es2021: true,
//     'react-native/react-native': true,
//   },
//   rules: {
//     'react-native/no-inline-styles': 'warn',
//     'react-native/no-raw-text': 'error',
//     'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
//     'prettier/prettier': 'error',
//   },
// };


module.exports = {
  presets: ['module:@react-native/babel-preset' ],
   plugins: [
    "react-native-reanimated/plugin",
  ],
};
// module.exports = {


// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
//   plugins: [
//     'react-native-reanimated/plugin'
//   ]
// };
//   presets: ['module:metro-react-native-babel-preset'],
//   plugins: ['nativewind/babel'],
// };


// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
//   plugins: ['nativewind/babel'],
// };
// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
//   plugins: ['nativewind/babel'],
// };