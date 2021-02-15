// 'use strict';
// const path = require('path');

// function resolve(dir) {
//     return path.join(__dirname, dir)
// }
module.exports = {
    configureWebpack: {
        resolve: {

            alias: {
                'assets': '@/assets',
                'common': '@/common',
                'components': '@/components',
                'network': '@/network',
                'views': '@/views'

            }
        }
    },
    chainWebpack: config => {
        // 修复HMR
        config.resolve.symlinks(true);

    }
}