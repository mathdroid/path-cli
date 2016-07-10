const baseURL = 'https://api.path.com/3'
let tlurl = 'https://api.path.com/3/moment/feed/home?limit=60&oauth_token='

let jsonRes = {}
let momentsArray = [] // metadata for moments
let tlArray = [] // displayed on tl

let requestTimeline = (utoken) => {
  request(tlurl + utoken, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      jsonRes = JSON.parse(body)
      showTimeline(createTimeline(jsonRes))
    } else {
      console.error(response)
    }
  })
}
