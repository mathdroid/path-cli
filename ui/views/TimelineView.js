const Timeline = require('../../lib/Timeline')
const inquirer = require('inquirer')

let TL

let showTimeline = (tlinstance) => {
  console.log(tlinstance)
  let tla
  tla = tlinstance.timelineArray.concat([
    new inquirer.Separator(),
    'Older',
    'Refresh',
    'Exit',
    new inquirer.Separator() ])
  inquirer.prompt([
    {
      type: 'list',
      name: 'moments',
      message: 'Your timeline:',
      pageSize: 50,
      choices: tla
    }
  ]).then((answers) => {
    let mo = TL.moments[tla.indexOf(answers.moments)]
    console.log(mo)
    // console.log(mo.type)
    // console.dir(mo[mo.type])
    // mo.type === 'photo' ? console.log(mo.photo.photo.url + '/' + mo.photo.photo.square.file) : console.log(mo)
    // imageToAscii(mo.photo.photo.url + '/' + mo.photo.photo.square.file, {
    //   colored: true,
    //   pxWidth: 5,
    //   size: {
    //     height: '200%'
    //   }
    // }, (err, converted) => {
    //   console.log(mo.emotions)
    //   console.log(err || converted)
    //   let emoteCount = {}
    //   console.log(mo.emotions.total + ' emotions.')
    //   mo.emotions.users.forEach((em) => {
    //     if (emoteCount.hasOwnProperty(em.emotion_type)) {
    //       emoteCount[em.emotion_type]++
    //     } else {
    //       emoteCount[em.emotion_type] = 1
    //     }
    //   })
    //   for (let k in emoteCount) {
    //     if (emoteCount.hasOwnProperty(k)) {
    //       console.log((emoteCount[k]) + ' ' + k + 's ')
    //     }
    //   }
    //   console.log(chalk.bold.underline('comments:'))
    //   mo.comments.forEach((comment, idx) => {
    //     console.log((idx + 1) + '. ' + comment.body + ' - ' + chalk.magenta(jsonRes.users[comment.user_id].first_name))
    //   })
    //   inquirer.prompt([
    //     {
    //       type: 'list',
    //       name: 'action',
    //       message: 'Your action:',
    //       choices: ['Comment', 'Emote', 'Back', 'Back and Refresh', 'Exit']
    //     }
    //   ]).then((answers) => {
    //     showTimeline(tlArray)
    //   })
    // })
  })
}

let goToTimelineView = (dataJSON) => {
  TL = new Timeline(dataJSON)
  showTimeline(TL)
}

module.exports = {
  goToTimelineView
}
