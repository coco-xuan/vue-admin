const prodPugins = []
if (process.env.NODE_ENV === 'production') {
  prodPugins.push('transform-remove-console')
}



module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    // 发布产品时的插件数组
    ...prodPugins,

    '@babel/plugin-syntax-dynamic-import'
  ]
}





