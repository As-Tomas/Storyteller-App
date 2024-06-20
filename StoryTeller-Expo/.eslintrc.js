// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'warn',
    'import/no-unresolved': 'warn',
    'Delete `␍`eslintprettier/prettier': 'ignore',
  },
};
