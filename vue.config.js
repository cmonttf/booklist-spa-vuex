const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // El navegador se abre con "npm run serve" (--open), no al levantar el
    // servidor para las pruebas e2e.
    port: 8080
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'BookList SPA'
      return args
    })
  }
})
