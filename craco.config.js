const webpack = require('webpack')

//this is the version of higlass used within the higlass submodule.
const version = require('./src/components/visualizationTools/HiGlass/higlass/package.json').version

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback={
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url/'),
        process: require.resolve('process/browser')
      }
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      }));

      //This is here just for higlass compatability, I do not know why it is called XYLOPHON.
      webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          global: 'globalThis',
          XYLOPHON: JSON.stringify(version)
        })
      )

      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer']
        }),
      )

      webpackConfig.module.rules.push(
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false
          }
        }
      )

      //remove the requirement of assests being inside /src since styleguidist breaks with this
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );

      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);

      return webpackConfig;

    }
  },
};