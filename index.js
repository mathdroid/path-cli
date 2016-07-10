#!/usr/bin/env node

'use strict'
const chalk = require('chalk')

const Login = require('./ui/views/LoginView')
const Timeline = require('./ui/views/TimelineView')
const helper = require('./lib/helper')

const utoken = helper.getConfig().oauth_token || null

if (utoken == null) {
  console.log(chalk.red('✗') + ' OAuth token not found. Please login with your ' + chalk.bgRed.bold('Path') + ' credentials.')
  Login.login(logger)
} else {
  logger(utoken)
}
