const fs = require('fs')
const path = require('path')
const config = require('./config')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin-for-multihtml')
const isProd = process.env.NODE_ENV === 'production'
const glob = require('glob')

function getEntry(globPath) {
  let files = glob.sync(globPath),
    entries = []

  files.forEach(item => {
    entries.push(path.basename(item))
  })

  return entries
}

module.exports = defautEntry => {
  if (!defautEntry) {
    defautEntry = 'app'
  }
  const entryFiles = getEntry(`${config.contextPath}/*.js`)
  const entryNames = entryFiles.map(filename => {
    if (!path.isAbsolute(filename)) {
      filename = path.resolve(config.contextPath, filename)
    }

    if (!fs.statSync(filename).isFile()) {
      throw new Error(`${filename} file does not exist`)
    }

    return {
      filename,
      name: path.basename(filename, '.js')
    }
  })

  let entrys = {},
    pages = [],
    names = []

  entryNames.forEach(en => {
    const name = defautEntry === en.name ? defautEntry : en.name
    entrys[name] = [en.filename]

    pages.push(
      new HtmlWebpackPlugin({
        template:
          name == defautEntry
            ? `${config.contextPath}/index.html`
            : `${config.contextPath}/${name}.html`,
        filename: name == defautEntry ? 'index.html' : `./${name}/index.html`,
        inject: true,
        favicon: `${config.contextPath}/assets/favicon.ico`,
        // 压缩配置
        minify: {
          // 删除Html注释
          removeComments: true,
          // 去除空格
          collapseWhitespace: true,
          // 去除属性引号
          removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency',
        chunks: [name],
        multihtmlCache: true
      })
    )

    names.push(name)
  })

  return {
    entrys, // 入口
    pages
  }
}
