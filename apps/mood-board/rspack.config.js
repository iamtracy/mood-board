const { composePlugins, withNx, withWeb } = require('@nx/rspack')

const { API_BASE_URL, API_PORT, PROTOCOL } = process.env

if (!API_BASE_URL || !API_PORT || !PROTOCOL) {
  throw new Error('API_BASE_URL, API_PORT, and PROTOCOL must be defined in the environment');
}

const apiUrl = `${PROTOCOL}://${API_BASE_URL}:${API_PORT}`

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
