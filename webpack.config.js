const { resolve } = require('path');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const dotenv = require('dotenv');

dotenv.config();

const { NODE_ENV } = process.env;
const plugins = [];

if (NODE_ENV !== 'production') {
    plugins.push(
        new WebpackShellPluginNext({
            onBuildEnd: {
                scripts: ['npm run run-dev'],
                blocking: false,
                parallel: true,
            },
        })
    );
}

module.exports = {
    devtool: 'source-map',
    entry: resolve(__dirname, './src/index.ts'),
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    keep_classnames: true,
                },
            }),
        ],
    },
    output: {
        filename: 'index.js',
        path: resolve(__dirname, 'build/src'),
    },
    module: {
        rules: [
            {
                use: ['ts-loader'],
                test: /\.ts$/,
                exclude: /node_modules/,
                include: [resolve(__dirname, 'src')],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: resolve(__dirname, './tsconfig.json'),
                extensions: ['.ts'],
            }),
        ],
    },
    plugins,
    externals: [nodeExternals()],
    target: 'node',
    mode: NODE_ENV === 'development' ? 'development' : 'production',
    watch: NODE_ENV === 'development',
};