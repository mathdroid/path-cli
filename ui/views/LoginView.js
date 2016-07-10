'use strict'
const request = require('request')
const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

const BottomBar = inquirer.ui.BottomBar
let loader = [
  '/ ',
  '| ',
  '\\ ',
  '- '
]
let i = 4
let loadingInterval
let ui

let userJson = {}
let cb

let showLoadingBar = (message) => {
  ui = new BottomBar({bottomBar: loader[i % 4] + message})
  loadingInterval = setInterval(() => {
    ui.updateBottomBar(loader[i++ % 4] + message)
  }, 100)
}

let inputUsername = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'Path email address: '
    }
  ]).then(function (answers) {
    inputPassword(answers)
  })
}

let inputPassword = (username) => {
  inquirer.prompt([
    {
      type: 'password',
      message: 'Path password: ',
      name: 'password'
    }
  ]).then(function (password) {
    // console.log(JSON.stringify(username, null, '  '))
    // console.log(JSON.stringify(answers, null, '  '))
    apiAuthenticate(username.username, password.password)
  })
}

let apiAuthenticate = (username, password) => {
  showLoadingBar('Logging in as ' + chalk.bold.underline(username) + '...')
  request.post({url: 'https://api.path.com/3/user/authenticate', formData: {post: JSON.stringify({
    login: username,
    password: password,
    client_id: 'MzVhMzQ4MTEtZWU2Ni00MzczLWE5NTItNTBhYjJlMzE0YTgz',
    reactivate_user: 1
  })}
  }, function optionalCallback (err, httpResponse, body) {
    clearInterval(loadingInterval)
    if (err) {
      ui.updateBottomBar(chalk.red('✗') + ' LOGIN FAILURE. ')
      return console.error('Error:', err)
    }
    userJson = JSON.parse(body)
    if (userJson.error_code) {
      ui.updateBottomBar(chalk.red('✗') + ' LOGIN FAILURE. ')
      console.error('Reason:', userJson.error_reason)
      return process.exit()
    }
    ui.updateBottomBar(chalk.green('✓') + chalk.bold(' Logged in') + ' as ' + chalk.bold(userJson.first_name + ' ' + userJson.last_name) + ". Your OAuth token is '" + chalk.underline(userJson.oauth_token) + "'.\n")
    return inquireSaveCred()
  })
}

let inquireSaveCred = () => {
  inquirer.prompt([
    {
      type: 'confirm',
      message: 'Save credentials (oauth_token) in local file: ',
      name: 'save',
      default: false
    }
  ]).then(function (answer) {
    if (answer.save) {
      showLoadingBar('Saving to ' + String(__dirname) + '../../config.json')
      fs.writeFile(path.join(__dirname, '../..', 'config.json'), JSON.stringify({oauth_token: userJson.oauth_token}), (err) => {
        clearInterval(loadingInterval)
        if (err) throw err
        ui.updateBottomBar(chalk.green('✓') + chalk.bold(' Saved to ') + String(__dirname) + '/../../config.json')
        cb(userJson.oauth_token)
      })
    } else {
      ui.updateBottomBar(chalk.green('✓') + ' Credentials not saved. Proceeding to timeline.')
      cb(userJson.oauth_token)
    }
  })
}

let doLogin = (callback) => {
  cb = callback
  inputUsername()
}

module.exports = {
  login: doLogin
}
