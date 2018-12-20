const path = require('path');
const express = require('express');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    baseUrl: '/',
    devServer: {
        host: '0.0.0.0',
        port: process.env.PROXY_PORT || '8082',
        proxy: {
            '/api': {
                target: process.env.PROXY_URL,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api',
                },
            },
        },
        before: (app) => {
            app.use('/static', express.static('./static'));
        },
    },
    chainWebpack: (config) => {
        config.module
            .rule('html')
            .test(/\.html$/)
            .use('vue-html-loader')
            .loader('vue-html-loader')
            .end();
    },
    configureWebpack: {
        resolve: {
            extensions: ['*', '.js', '.jsx', '.ts', '.tsx', '.vue', '.json'],
            alias: {
                vue$: 'vue/dist/vue.js',
                static: path.join(__dirname, 'static'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.(vert|frag|geom|glsl)$/,
                    use: 'raw-loader',
                },
            ],
        },
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, './static'),
                    to: path.resolve(__dirname, './dist/static'),
                    ignore: ['.*'],
                },
            ]),
        ],
    },
};
