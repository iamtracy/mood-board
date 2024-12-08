const { composePlugins, withNx, withWeb } = require('@nx/rspack')

const {
  BASE_URL = 'localhost',
  PORT = 3000,
} = process.env

const apiUrl = `http://${BASE_URL}:${PORT}`

module.exports = composePlugins(withNx(), withWeb(), (config) => {
  return {
    ...config,
    devServer: {
      proxy: [
        {
          context: ['/api'],
          target: apiUrl,
        },
      ],
    },
  }
})
