const request = require('request')
const chalk = require('chalk')

const baseURL = 'https://api.path.com/3'
let tlurl = '/moment/feed/home?limit=60&oauth_token='

let jsonRes = {}
let momentsArray = [] // metadata for moments
let tlArray = [] // displayed on tl

let requestTimeline = (utoken, cb) => {
  request(baseURL + tlurl + utoken, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      cb(JSON.parse(body))
      // try {
      //   console.log(body)
      //   jsonRes = JSON.parse(body)
      //   cb(JSON.parse(body))
      // } catch (err) {
      //   console.log(body)
      //   console.log(chalk.red('✗') + ' There has been an error in the server response.')
      //   cb({})
      // }
      // showTimeline(createTimeline(jsonRes))
    } else {
      console.error(response)
      cb({})
    }
  })
}

module.exports = {
  requestTimeline
}
