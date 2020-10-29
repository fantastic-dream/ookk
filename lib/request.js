const ora = require("ora");
const axios = require('axios');
const chalk = require("chalk");

const spinner = ora('');

axios.interceptors.request.use(function (config) {
    spinner.start(config.url)
    return config;
}, function (error) {
    spinner.stop(chalk.red(error.message))
    return Promise.reject(error);
});


axios.interceptors.response.use(function (response) {
    spinner.stop(chalk.green(` success get the lighthouse data `))
    return response;
}, function (error) {
    spinner.stop(chalk.red(error.message))
    return Promise.reject(error);
});




exports.get = axios.get;
exports.post = axios.post