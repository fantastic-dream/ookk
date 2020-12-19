#!/usr/bin/env node
'use strict'
const meow = require('meow')
const chalk = require('chalk')
const updateNotifier = require('update-notifier')
const ookk = require('..')

const cli = meow(`
  Usage
    $ ookk <url>

  Options
    --key        Google API Key.
    --strategy   Strategy to use when analyzing the page: mobile|desktop

  Example
    $ ookk https://zwkang.com --strategy=mobile
`)

updateNotifier({ pkg: cli.pkg }).notify()

if (!cli.input[0]) {
  console.error('Specify a URL')
  process.exit(1)
}

ookk(cli.input[0], cli.flags)
  .then(() => {
    process.exit()
  })
  .catch(error => {
    if (error.noStack) {
      console.error(chalk.red(error.message))
      process.exit(1)
    } else {
      throw error
    }
  })
