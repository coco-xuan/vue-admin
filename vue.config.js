// 'use strict';
// const path = require('path');

// function resolve(dir) {
//     return path.join(__dirname, dir)
// }
const BASE_URL = process.env.NODE_ENV === 'production' ? '/vue-admin/' : ''
module.exports = {
    publicPath: BASE_URL,
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
        // 发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')

            //配置 externals 加载外部 CDN 资源
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                echarts: 'echarts',
                'vue-quill-editor': 'VueQuillEditor'
            })
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })

        })
        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')

            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }
}