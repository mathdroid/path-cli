'use strict'
const request = require('request')
const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')

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
let ut

function showLoadingBar(message) {
  ui = new BottomBar({bottomBar: loader[i % 4] + message})
  loadingInterval = setInterval(() => {
    ui.updateBottomBar(loader[i++ % 4] + message)
  }, 100)
}

function inputUsername(callback) {
  cb = callback
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
function inputPassword(username) {
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
  });
}

function apiAuthenticate(username, password) {
  showLoadingBar('Logging in as ' + chalk.bold.underline(username) + '...')
  request.post({url:'https://api.path.com/3/user/authenticate', formData: {post: JSON.stringify({
      login: username,
      password: password,
      client_id: 'MzVhMzQ4MTEtZWU2Ni00MzczLWE5NTItNTBhYjJlMzE0YTgz',
      reactivate_user: 1
    })}
  }, function optionalCallback(err, httpResponse, body) {
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
    ui.updateBottomBar( chalk.green('✓') + chalk.bold(' Logged in') + ' as ' + chalk.bold(userJson.first_name + ' ' + userJson.last_name) + '. Your OAuth token is \'' + chalk.underline(userJson.oauth_token) + '\'.\n')
    inquireSaveCred()
  });
}

function inquireSaveCred() {
  inquirer.prompt([
    {
      type: 'confirm',
      message: 'Save credentials (oauth_token) in local file: ',
      name: 'save',
      default: false
    }
  ]).then(function (save) {
    if (save.save) {
      showLoadingBar('Saving to ' + __dirname + '/config.json')
      fs.writeFile('./config.json', JSON.stringify({oauth_token: userJson.oauth_token}), (err) => {
        clearInterval(loadingInterval)
        if (err) throw err
        ui.updateBottomBar( chalk.green('✓') + chalk.bold(' Saved to ') + __dirname + '/config.json')
        cb(userJson.oauth_token)
      });
    } else {
      ui.updateBottomBar( chalk.green('✓') + ' Credentials not saved. Proceeding to timeline.')
      cb(userJson.oauth_token)
    }
  });
}

module.exports = {
  login: inputUsername
}
