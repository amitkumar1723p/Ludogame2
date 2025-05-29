module.exports = {
  root: true,
  extends: [
    'airbnb',
    'plugin:react-native/all',
    'plugin:prettier/recommended' // ⬅️ Add this line
  ],
  plugins: ['react', 'react-native', 'prettier'], // ⬅️ Add 'prettier'
  env: {
    browser: true,
    es2021: true,
    'react-native/react-native': true,
  },
  rules: {
    'react-native/no-inline-styles': 'warn',
    'react-native/no-raw-text': 'error',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'prettier/prettier': 'error',
  },
};
