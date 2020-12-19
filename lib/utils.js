const chalk = require('chalk')
const { sortBy, reduce } = require('lodash')
const terminalLink = require('terminal-link')

// 分割符
exports.divider = '\n' + chalk.green('-'.repeat(56)) + '\n'

// 美化一个对象输出
exports.outputObject = function (obj) {
  const keys = Object.keys(obj)
  return reduce(
    sortBy(keys, 'length'),
    (prev, next) => (prev[next] = obj[next]) && prev,
    {}
  )
}

exports.generatorTerminalLink = str => {
  return str.replace(/(https:|http).*?\s/g, terminalLink)
}

exports.transToPercent = num => Math.floor(num * 100)
