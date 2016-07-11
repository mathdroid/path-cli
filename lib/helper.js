const path = require('path')
const chalk = require('chalk')
const fs = require('fs')
const dns = require('dns')

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

let getConnection = (cb) => {
  dns.lookup('api.path.com', err => {
  	if (err && err.code === 'ENOTFOUND') {
  		console.log(`${chalk.bold.red('✗')}${chalk.dim('Please check your internet connection to use path-cli.')}`)
  		process.exit(1)
  	} else {
  		console.log(`${chalk.dim(`Welcome to ${chalk.white.underline('path-cli')}.`)}`)
      cb()
  	}
  });
}
// ›
module.exports = {
  getConnection,
  getConfig
}
