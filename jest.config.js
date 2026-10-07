module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  // Element Plus (versión CommonJS) depende de @vueuse, que solo se publica
  // como ES modules: hay que dejar que babel-jest lo transforme.
  transformIgnorePatterns: ['/node_modules/(?!(@vueuse|lodash-es)/)']
}
