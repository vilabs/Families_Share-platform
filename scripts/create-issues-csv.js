const axios = require('axios')
const moment = require('moment')

const fetchBatch = async (page) => {
  return axios({
    url: `https://api.github.com/repos/AuthEceSoftEng/Families_Share-platform/issues?state=all&direction=asc&labels=User%20feedback&page=${page}`,
    method: 'get',
    headers: {
      'Authorization': 'Bearer 2eb3bc2e9fc7be9140cb21a78ab0dae9a1aaf4a2'
    }
  }).then(response => {
    return response.data
  }).catch(err => console.log(err))
}

const create = async () => {
  let issues = []
  let page = 1
  let batch = await fetchBatch(page)
  issues = issues.concat(batch)
  while (batch.length > 0) {
    page += 1
    batch = await fetchBatch(page)
    issues = issues.concat(batch)
  }
  console.log('Title;Date Reported;Labels;Description')
  for (let i = 0; issues.length; i += 1) {
    let { title, body, created_at: created, labels } = issues[i]
    const filteredLabels = labels.filter(label => label.name !== 'User feedback')
    if (filteredLabels.length) {
      const initial = `=\"${filteredLabels[0].name}\"`

      const accumulator = (a, b) => `${a}&CHAR(10)&\"${b.name}\"`
      labels = filteredLabels.slice(1).reduce(accumulator, initial)
    } else {
      labels = ''
    }
    created = moment(created).format('DD-MM-YYYY')
    body = body.slice(0, body.indexOf(';'))
    body = body.replace(',', ' ')
    console.log(`${title};${created};${labels};${JSON.stringify(body)}`)
  }
}

create()
