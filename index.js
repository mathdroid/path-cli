#!/usr/bin/env node

'use strict'
const chalk = require('chalk')

const PathClient = require('./lib/PathClient')
const Login = require('./ui/views/LoginView')
const Timeline = require('./ui/views/TimelineView')
const helper = require('./lib/helper')


let logger = (msg) => {
  console.log(msg)
}

let main = () => {
  const utoken = helper.getConfig().oauth_token || null
  if (utoken == null) {
    console.log(chalk.red('✗') + ' OAuth token not found. Please login with your ' + chalk.bgRed.bold('Path') + ' credentials.')
    Login.login(logger)
  } else {
    // logger(utoken)
    PathClient.requestTimeline(utoken, Timeline.goToTimelineView)
  }
}

helper.getConnection(main)
