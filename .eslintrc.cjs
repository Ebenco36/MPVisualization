/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  ignorePatterns: [
    'public/assets/js/**/*.js',
    'src/assets/js/**/*.js'
  ],
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  overrides: [
    {
      files: [
        '*.config.js'
      ],
      env: {
        node: true
      }
    },
    {
      files: [
        'src/views/**/*.vue',
        'src/components/**/*.vue',
        'src/main.js'
      ],
      rules: {
        'vue/multi-word-component-names': 'off'
      }
    },
    {
      files: [
        'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'
      ],
      'extends': [
        'plugin:cypress/recommended'
      ]
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
