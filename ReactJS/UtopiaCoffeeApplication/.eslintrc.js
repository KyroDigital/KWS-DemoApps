module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/warnings',
  ],
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 0,
    'react/display-name': 0,
    'react-hooks/exhaustive-deps': 0,
    'no-async-promise-executor': 0,
    'prettier/prettier': ['warn', { singleQuote: true }],
    'no-unused-vars': 0,
    'import/export': 0,
  },
};
