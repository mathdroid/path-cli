const chalk = require('chalk')
const moment = require('moment')

let instance = null

let _datastore = {}

let _moments = []
let _users = {}

let _books = {}
let _cover = {}
let _locations = {}
let _movies = {}
let _music = {}
let _places = {}
let _sleep = {}
let _stickers = {}
let _tv = {}

let _timelineArray = []

let isNotAlreadyInMoments = (value) => {
  return _moments.indexOf(value) === -1
}

let updateDatastore = (newDatastore) => {
  console.dir(newDatastore)
  _moments = _moments.concat(newDatastore.moments.filter(isNotAlreadyInMoments))
  _datastore = Object.assign(newDatastore, _datastore)
  _users = _datastore.users

  _books = _datastore.books
  _cover = _datastore.cover
  _locations = _datastore.locations
  _movies = _datastore.movies
  _music = _datastore.music
  _places = _datastore.places
  _sleep = _datastore.sleep
  _stickers = _datastore.stickers
  _tv = _datastore.tv
}

module.exports = class Timeline {
  constructor (dataJSON) {
    if (!instance) {
      updateDatastore(dataJSON)
      timelineArray = momentsArray.map((obj) => (chalk.bold.white(_users[obj.user_id].first_name) + ' ' + _users[obj.user_id].last_name) + "'s " + chalk.white.underline(obj.type) + ': ' + (typeof obj.comments[0] === 'object' ? (obj.comments[0].body).split('\n').join('⏎ ') : obj.headline) + chalk.magenta(' (' + obj.seen_its.total + ' views)') + ', ' + chalk.grey(moment.unix(obj.created).fromNow()) + '\n\n')
      instance = {
        moments: momentsArray,
        timelineArray
      }
    }

    return instance
  }
}

// let createTimeline = (dataJSON) => {
//   updateDatastore(dataJSON)
//   let momentsArray = [].concat(_moments)
//   timelineArray = momentsArray.map((obj) => (chalk.bold.white(_users[obj.user_id].first_name) + ' ' + _users[obj.user_id].last_name) + "'s " + chalk.white.underline(obj.type) + ': ' + (typeof obj.comments[0] === 'object' ? (obj.comments[0].body).split('\n').join('⏎ ') : obj.headline) + chalk.magenta(' (' + obj.seen_its.total + ' views)') + ', ' + chalk.grey(moment.unix(obj.created).fromNow()) + '\n\n')
//   return timelineArray
// }

// module.exports = {
//   createTimeline,
//   _moments
// }
