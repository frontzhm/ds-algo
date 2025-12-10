module.exports = {
  root: true,
  env: {
    browser: true,
    es2024: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier', // 禁用 ESLint 中与 Prettier 冲突的规则
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json', // 关联 TS 配置
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    // 基础规则
    'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
    'no-debugger': 'warn',
    // TypeScript 规则
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],
    // 导入规则
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {}, // 支持 TS 路径别名
    },
  },
  ignorePatterns: ['node_modules/', 'dist/', '**/*.d.ts'],
};

