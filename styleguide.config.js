const path = require('path')


module.exports = {
    propsParser: require('react-docgen-typescript').withDefaultConfig([]).parse,
    components: 'src/components/**/*.{js,jsx,ts,tsx}',
}