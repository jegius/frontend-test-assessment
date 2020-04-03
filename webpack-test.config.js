const path = require('path');
const ROOT = path.resolve( __dirname, 'src' );

module.exports = {
    context: ROOT,

    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            ROOT,
            'node_modules'
        ]
    },

    module: {
        rules: [
            // PRE-LOADERS
            {
                enforce: 'pre',
                test: /\.js$/,
                use: 'source-map-loader'
            },

            // LOADERS
            {
                test: /\.ts$/,
                exclude: [ /node_modules/ ],
                use: 'awesome-typescript-loader'
            }
        ]
    },

    devtool: 'cheap-module-source-map',
    devServer: {}
};

