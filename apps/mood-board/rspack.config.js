const { composePlugins, withNx, withWeb } = require('@nx/rspack')

const { BASE_URL, PORT } = process.env

if (!BASE_URL || !PORT) {
  throw new Error('BASE_URL, and PORT must be defined in the environment');
}

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
