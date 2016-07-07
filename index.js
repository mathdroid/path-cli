const request = require('request')
const moment = require('moment')
const config = require('./config')

let jsonRes = {}

let createTimeline = (tljson) => {
  tljson.moments.
    map((obj) => obj.type + ': ' + (typeof(obj.comments[0])==='object' ? obj.comments[0].body : obj.headline) + '\n(' + obj.seen_its.total + ' views), ' + moment.unix(obj.created).fromNow() +'\nBy: ' + tljson.users[obj.user_id].first_name + ' ' + tljson.users[obj.user_id].last_name + '\n' ).
    forEach((value) => {console.log(value)})
}

request('https://api.path.com/3/moment/feed/home?oauth_token='+config.USER_TOKEN+'&limit=60&user_id=4f71d93d3b954a3e53001857&gs=1', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    jsonRes = JSON.parse(body)
    createTimeline(jsonRes)
    // console.dir(jsonRes.moments);
  } else {
    console.error(response)
  }
})
