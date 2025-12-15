/* eslint-env node */
/* @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: { browser: true, es2023: true, node: false },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  overrides: [
    {
      files: ['*.cjs', '*.config.*', '.eslintrc.cjs', 'vite.config.*'],
      env: { node: true, browser: false },
    },
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import', 'simple-import-sort'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'eslint-config-prettier',
  ],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    // 自動で import を並び替え
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    // 競合を避けるため import/order は無効化
    'import/order': 'off',
  },
  ignorePatterns: ['dist/', 'dev-dist/', 'node_modules/'],
};
