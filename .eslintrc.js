module.exports = {
  root: true,
  extends: ['plugin:react-native/all'],
  plugins: ['react-native'],
  env: {
    browser: true,
    es2021: true,
    'react-native/react-native': true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module', // ✅ import/export support
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // ✅ React Native warnings/errors
    'react-native/no-inline-styles': 'warn',
    'react-native/no-raw-text': 'error',

    // ❌ Turn off formatting/stylistic rules
    'prettier/prettier': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-curly-spacing': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-multi-spaces': 'off',
    'comma-dangle': 'off',
    quotes: 'off',
    semi: 'off',
    'object-curly-spacing': 'off',
    'key-spacing': 'off',
    'no-multiple-empty-lines': 'off',
    'space-before-blocks': 'off',
    'keyword-spacing': 'off',
    'arrow-spacing': 'off',
    'no-trailing-spaces': 'off',
  },
};
