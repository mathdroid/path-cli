const request = require('request')
const moment = require('moment')
const inquirer = require('inquirer')

const config = require('./config')

let jsonRes = {}
let momentsArray = [] //metadata for moments
let tlArray = [] // displayed on tl

let showTimeline = (tla) => {
  // tla.forEach((value) => {
  //   console.log(value)
  // })
  inquirer.prompt([
    {
      type: 'list',
      name: 'theme',
      message: 'What do you want to do?',
      choices: tla
    }
  ]).then(function (answers) {
    console.log(JSON.stringify(answers, null, '  '));
  })

}

let createTimeline = (tljson) => {
  momentsArray = tljson.moments
  return momentsArray.
    map((obj) => tljson.users[obj.user_id].first_name + ' ' + tljson.users[obj.user_id].last_name + '\'s ' + obj.type + ': ' + (typeof(obj.comments[0])==='object' ? obj.comments[0].body : obj.headline) + ' (' + obj.seen_its.total + ' views), ' + moment.unix(obj.created).fromNow() +'' )

}

request('https://api.path.com/3/moment/feed/home?oauth_token='+config.USER_TOKEN+'&limit=60&user_id=4f71d93d3b954a3e53001857&gs=1', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    jsonRes = JSON.parse(body)
    showTimeline(createTimeline(jsonRes))
    // console.dir(jsonRes.moments);
  } else {
    console.error(response)
  }
})
