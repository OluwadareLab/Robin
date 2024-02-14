const path = require('path')


module.exports = {
    propsParser: require('react-docgen-typescript').withDefaultConfig([]).parse,
    webpackConfig: require('./webpack.config.js'),
    components: 'src/components/**/*.{js,jsx,ts,tsx}',
}