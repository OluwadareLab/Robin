const webpack = require('webpack')
const version = require('./src/components/visualizationTools/HiGlass/higlass/package.json').version

module.exports = {
    webpack: {
      configure: {
        plugins: [
            new webpack.DefinePlugin({
                global: 'globalThis',
                XYLOPHON: JSON.stringify(version)
              }),
            
    
            // Add your plugins here
            // Learn more about plugins from https://webpack.js.org/configuration/plugins/
        ],
      },
    },
  };