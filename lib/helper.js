const path = require('path')
const chalk = require('chalk')
const fs = require('fs')

let getConfig = () => {
  let config = {}
  try {
    fs.statSync(path.join(__dirname, '..', 'config.json')).isFile() ? console.log(chalk.green('✓') + ' Config file found.') : process.exit()
    let data = fs.readFileSync(path.join(__dirname, '..', 'config.json'))
    try {
      config = JSON.parse(data)
      if (!config.oauth_token) {
        console.log(chalk.red('✗') + ' No oauth_token found in config file.')
      } else {
        return config
      }
    } catch (err) {
      console.log(chalk.red('✗') + ' There has been an error parsing config.json.')
      config = {}
    }
  } catch (err) {
    console.log(chalk.red('✗') + ' No configuration file found.')
    config = {}
  }
  if (process.env.PATH_CLI_USER_TOKEN) {
    console.log(chalk.green('✓') + ' Found token in process environment.')
    return {oauth_token: process.env.PATH_CLI_USER_TOKEN}
  } else {
    console.log(chalk.red('✗') + ' No oauth_token found in process environment.')
  }
  return config
}

module.exports = {
  getConfig
}
