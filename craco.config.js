const webpack = require('webpack')
const version = require('./src/components/visualizationTools/HiGlass/higlass/package.json').version

module.exports = {
    webpack: {
      configure: {
        resolve: {
          fallback: {
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            stream: require.resolve('stream-browserify'),
            url: require.resolve('url/'),
            process: require.resolve('process/browser')
          }
        },
        plugins: [
          new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
          }),
            new webpack.DefinePlugin({
                global: 'globalThis',
                XYLOPHON: JSON.stringify(version)
              }),
              new webpack.ProvidePlugin({
                process: 'process/browser',
                Buffer: ['buffer', 'Buffer']
              }),
            
    
            // Add your plugins here
            // Learn more about plugins from https://webpack.js.org/configuration/plugins/
        ],

        module:{
          rules:[
            {
              test: /\.m?js/,
              resolve: {
                fullySpecified: false
              }
            }
          ]
        }
      },
    },
  };