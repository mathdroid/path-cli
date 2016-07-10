
let createTimeline = (tljson) => {
  momentsArray = tljson.moments
  tlArray = momentsArray.map((obj) => (chalk.bold.white(tljson.users[obj.user_id].first_name) + ' ' + tljson.users[obj.user_id].last_name) + "'s " + chalk.white.underline(obj.type) + ': ' + (typeof obj.comments[0] === 'object' ? (obj.comments[0].body).split('\n').join('⏎ ') : obj.headline) + chalk.magenta(' (' + obj.seen_its.total + ' views)') + ', ' + chalk.grey(moment.unix(obj.created).fromNow()) + '\n\n')
  return tlArray
}
