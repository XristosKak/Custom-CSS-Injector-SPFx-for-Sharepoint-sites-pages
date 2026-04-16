// rushstack patch (SPFx 1.22 plugin resolution)
require('@rushstack/eslint-config/patch/modern-module-resolution');

// extend lib/profiles/default only; the package root re-exports Default/React and trips ESLint 8
module.exports = {
  extends: ['@microsoft/eslint-config-spfx/lib/profiles/default'],
  parserOptions: { tsconfigRootDir: __dirname },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-floating-promises': 'off',
        'no-void': 'off'
      }
    }
  ]
};
