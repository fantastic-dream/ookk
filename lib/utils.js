const chalk = require("chalk")
const terminalLink = require("terminal-link")

// 分割符
exports.divider = '\n' + chalk.green("-".repeat(56)) + '\n'

// 美化一个对象输出
exports.outputObject = function (obj) {
    const keys = Object.keys(obj);
    const sortedKeys = keys.sort((a, b) => {
        return a.length > b.length;
    })
    return sortedKeys.reduce((prev, next) => {
        prev[next] = obj[next];
        return prev
    }, {})
}


exports.generatorTerminalLink = str => {
    return str.replace(/(https:|http).*?\s/g, terminalLink)
}

exports.transToPercent = num => Math.floor(num * 100)