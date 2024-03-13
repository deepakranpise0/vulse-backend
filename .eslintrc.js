module.exports = {
  env: {
    node: true,
    jest:true,
    es2021: true
  },
  extends: ['eslint:recommended', 'plugin:import/errors', 'plugin:import/warnings'],
  plugins: ['import','jest'],
  rules: {
    'import/no-unresolved': 'error',
    'import/named': 'error'
  },
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  }
}
