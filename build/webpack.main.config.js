const path=require('path');
const webpack = require('webpack');
const { dependencies } = require('../package.json');

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        main: ['./src/main/main.js'],
    },
    output: {
        path: path.join(process.cwd(), 'dist/electron/'),
        libraryTarget: 'commonjs2',
        filename: './[name].js'
    },
    node: {
        fs: 'empty',
        __dirname: false
    },
    optimization: {
        runtimeChunk: false,
        minimize: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    externals: [
        ...Object.keys(dependencies || {})
    ],
    resolve: {
        extensions: ['.js']
    },
    plugins:[
        new webpack.NoEmitOnErrorsPlugin(),
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': '"production"'
        // })
    ],
    target: 'electron-main'
};