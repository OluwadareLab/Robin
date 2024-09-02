const webpack = require("webpack")
const path = require('path')
const { createWebpackDevConfig, createWebpackProdConfig } = require("@craco/craco");

const cracoConfig = require("./craco.config.js");
const webpackConfig = process.env.NODE_ENV === 'production' ? createWebpackProdConfig(cracoConfig) : createWebpackDevConfig(cracoConfig);

// //for examples to be easier
// webpackConfig.module.rules.push({
//     test: /.md$/, // see comment below!
//     type: 'javascript/auto', // Tell webpack to interpret the result from examples-loader as JavaScript
//   })

// webpackConfig.plugins.push(// Rewrites the absolute paths to those two files into relative paths
//     new webpack.NormalModuleReplacementPlugin(
//       /react-styleguidist\/lib\/loaders\/utils\/client\/requireInRuntime$/,
//       'react-styleguidist/lib/loaders/utils/client/requireInRuntime'
//     )
// )
// webpackConfig.plugins.push(
// new webpack.NormalModuleReplacementPlugin(
//     /react-styleguidist\/lib\/loaders\/utils\/client\/evalInContext$/,
//     'react-styleguidist/lib/loaders/utils/client/evalInContext'
//   )
// )

module.exports = {
    propsParser: require('react-docgen-typescript').withDefaultConfig([]).parse,
    webpackConfig: webpackConfig,
    components: 'src/components/**/*.{js,jsx,ts,tsx}',
    ignore: ['src/components/visualizationTools/**/*', './src/components/visualizationTools/HiGlass/**/*','src/components/tempTypes/**/*', "/**/_test_*"],
    skipComponentsWithoutExample:true,
}