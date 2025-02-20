const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: {
        bundle: path.resolve(__dirname, 'src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name][contenthash].js',
        clean: true,
        assetModuleFilename: 'assets/[name][ext]',
        publicPath: '/',
    },
    devtool: 'source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
        watchFiles: ['src/**/*', 'public/**/*'],
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader, // Use the plugin loader
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                        ],
                    },
                },
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            components: path.resolve(__dirname, 'src/components/'),
            pages: path.resolve(__dirname, 'src/pages/'),
            assets: path.resolve(__dirname, 'src/assets/'),
            utils: path.resolve(__dirname, 'src/utils/'),
            context: path.resolve(__dirname, 'src/context/'),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Expense Tracker',
            filename: 'index.html',
            template: path.resolve(__dirname, 'public/index.html'),
        }),
        new MiniCssExtractPlugin({
            filename: '[name][contenthash].css',
        }),
        new webpack.DefinePlugin({
            'process.env.REACT_APP_API_BASE_URL': JSON.stringify(process.env.REACT_APP_API_BASE_URL),
            'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL),
        }),
    ],
};