const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './src/main.ts',
        output: {
            filename: isProduction ? 'bundle.[contenthash].js' : 'bundle.js',
            path: path.resolve(__dirname, 'dist'),
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.(png|jpg|gif|svg|mp3|wav)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/[hash][ext][query]',
                    },
                },
            ],
        },
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true,
                        },
                    },
                }),
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                minify: isProduction
                    ? {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeRedundantAttributes: true,
                        useShortDoctype: true,
                        removeEmptyAttributes: true,
                        removeStyleLinkTypeAttributes: true,
                        keepClosingSlash: true,
                        minifyJS: true,
                        minifyCSS: true,
                        minifyURLs: true,
                    }
                    : false,
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'src/assets',
                        to: 'assets',
                        noErrorOnMissing: true,
                    },
                ],
            }),
        ],
        devServer: {
            static: {
                directory: path.join(__dirname, 'dist'),
            },
            compress: true,
            port: 8080,
            open: true,
        },
        devtool: isProduction ? 'source-map' : 'eval-source-map',
        mode: isProduction ? 'production' : 'development',
    };
};
