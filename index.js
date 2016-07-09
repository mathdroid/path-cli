#!/usr/bin/env node

'use strict'
const request = require('request')
const moment = require('moment')
const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const imageToAscii = require("image-to-ascii")

const config = require('./config')
const Login = require('./login')

const utoken = config.oauth_token || process.env.PATH_CLI_USER_TOKEN || null

let tlurl = 'https://api.path.com/3/moment/feed/home?limit=60&oauth_token='

let jsonRes = {}
let momentsArray = [] //metadata for moments
let tlArray = [] // displayed on tl

let showTimeline = (tla) => {
  tla = tla.concat([
      new inquirer.Separator(),
      'Older',
      'Refresh',
      'Exit',
      new inquirer.Separator(), ])
  inquirer.prompt([
    {
      type: 'list',
      name: 'moments',
      message: 'Your timeline:',
      choices: tla
    }
  ]).then( (answers) => {
    let mo = momentsArray[tla.indexOf(answers.moments)]
    // console.log(mo.type)
    // console.dir(mo[mo.type])
    mo.type=='photo' ? console.log(mo.photo.photo.url+'/'+mo.photo.photo.square.file) : console.log(mo)
    imageToAscii(mo.photo.photo.url+'/'+mo.photo.photo.square.file, {
        colored: true,
        pxWidth: 5,
        size: {
          height: "200%"
        }
    }, (err, converted) => {
      console.log(mo.emotions)
        console.log(err || converted)
        let emoteCount = {}
        console.log(mo.emotions.total + ' emotions.')
        mo.emotions.users.forEach((em) => {
          if (emoteCount.hasOwnProperty(em.emotion_type)) {
            emoteCount[em.emotion_type]++
          } else {
            emoteCount[em.emotion_type] = 0
          }
        })
        for (var k in emoteCount){
            if (emoteCount.hasOwnProperty(k)) {
              console.log((emoteCount[k]+1) + ' ' + k + 's ')
            }
        }
        console.log(chalk.bold.underline('comments:'))
        mo.comments.forEach((comment, idx) => {
          console.log((idx+1) + '. ' + comment.body + ' - ' + chalk.magenta(jsonRes.users[comment.user_id].first_name) )
        })
        inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'Your action:',
            choices: ['Comment', 'Emote', 'Back', 'Back and Refresh', 'Exit']
          }
        ]).then((answers) => {
          showTimeline(tlArray)
        })
    })

  })

}

let createTimeline = (tljson) => {
  momentsArray = tljson.moments
  tlArray = momentsArray.
    map((obj) => (chalk.bold.white(tljson.users[obj.user_id].first_name) + ' ' + tljson.users[obj.user_id].last_name) + '\'s ' + chalk.white.underline(obj.type) + ': ' + (typeof(obj.comments[0])==='object' ? (obj.comments[0].body).split('\n').join('⏎ ') : obj.headline) + chalk.magenta(' (' + obj.seen_its.total + ' views)') + ', ' + chalk.grey(moment.unix(obj.created).fromNow()) +'' )
  return tlArray
}

let requestTimeline = (utoken) => {
  request(tlurl+utoken, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      jsonRes = JSON.parse(body)
      showTimeline(createTimeline(jsonRes))
      // console.dir(jsonRes.moments);
    } else {
      console.error(response)
    }
  })
}

if (utoken==null) {
  console.log(chalk.red('✗') + ' OAuth token not found. Please login with your ' + chalk.bgRed.bold('Path') + ' credentials.')
  Login.login(requestTimeline)
} else {
  requestTimeline(utoken)
}
