#!/usr/bin/env node

'use strict'
const chalk = require('chalk')

const PathClient = require('./lib/PathClient')
const LoginView = require('./ui/views/LoginView')
const TimelineView = require('./ui/views/TimelineView')
const helper = require('./lib/helper')


let logger = (msg) => {
  console.log(msg)
}

let main = () => {
  const utoken = helper.getConfig().oauth_token || null
  if (utoken == null) {
    console.log(chalk.red('✗') + ' OAuth token not found. Please login with your ' + chalk.bgRed.bold('Path') + ' credentials.')
    LoginView.login(TimelineView.initTimelineView)
  } else {
    // logger(utoken)
    PathClient.requestTimeline(utoken, TimelineView.initTimelineView)
  }
}

helper.getConnection(main)
