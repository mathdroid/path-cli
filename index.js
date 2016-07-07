const request = require('request')
const moment = require('moment')
const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')

const config = require('./config')

let jsonRes = {}
let momentsArray = [] //metadata for moments
let tlArray = [] // displayed on tl


let showTimeline = (tla) => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'moments',
      message: 'Your timeline:',
      choices: tla
    }
  ]).then(function (answers) {
    let mo = momentsArray[tla.indexOf(answers.moments)]
    console.log(mo.type)
    mo.type=='photo' ? console.log(mo.photo.photo.url+'/'+mo.photo.photo.square.file) : console.log(mo)
    console.log('\n\nDownloading photo...\n\n')
    request
      .get(mo.photo.photo.url+'/'+mo.photo.photo.square.file)
      .on('error', function(err) {
        console.log(err)
      })
      .pipe(fs.createWriteStream('photo.jpg'))
  })

}

let createTimeline = (tljson) => {
  momentsArray = tljson.moments
  return momentsArray.
    map((obj) => (chalk.bold.white(tljson.users[obj.user_id].first_name) + ' ' + tljson.users[obj.user_id].last_name) + '\'s ' + chalk.white.underline(obj.type) + ': ' + (typeof(obj.comments[0])==='object' ? obj.comments[0].body : obj.headline) + chalk.magenta(' (' + obj.seen_its.total + ' views)') + ', ' + chalk.grey(moment.unix(obj.created).fromNow()) +'' )

}
console.log(chalk.bold('Please wait while we initialize your ' + chalk.bgRed('Path') + ' timeline.'))
request('https://api.path.com/3/moment/feed/home?oauth_token='+config.USER_TOKEN+'&limit=60&user_id=4f71d93d3b954a3e53001857&gs=1', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    jsonRes = JSON.parse(body)
    showTimeline(createTimeline(jsonRes))
    // console.dir(jsonRes.moments);
  } else {
    console.error(response)
  }
})
