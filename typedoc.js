module.exports = {
    out: './public/docs/',
    "entryPoints": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "src/**/*.js",
        "src/**/*.jsx"
    ],
    exclude:'src/components/visualizationTools/**/*',
    skipErrorChecking:true
};