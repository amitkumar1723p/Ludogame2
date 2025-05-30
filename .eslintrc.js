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
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
 rules: {
  'react-native/no-raw-text': ['error', {
    skip: ['Text'],
    ignoreStrings: true  // ✅ White space strings like {' '} will NOT throw error
  }],
  
  // ❌ Disable all style rules (as before)
  'react-native/no-inline-styles': 'off',
  'react-native/split-platform-components': 'off',
  'react-native/no-color-literals': 'off',
  'react-native/no-unused-styles': 'off',
  'react-native/no-single-element-style-arrays': 'off',
  'react-native/sort-styles': 'off',
  'react/jsx-filename-extension': 'off',
  'react/jsx-curly-spacing': 'off',
  'react/jsx-wrap-multilines': 'off',
  'react/jsx-one-expression-per-line': 'off',
  'react/jsx-props-no-multi-spaces': 'off',
  'comma-dangle': 'off',
  'quotes': 'off',
  'semi': 'off',
  'object-curly-spacing': 'off',
  'key-spacing': 'off',
  'no-multiple-empty-lines': 'off',
  'space-before-blocks': 'off',
  'keyword-spacing': 'off',
  'arrow-spacing': 'off',
  'no-trailing-spaces': 'off',
  'prettier/prettier': 'off',
},

};
