const axios = require('axios')

const fetchBatch = async (page) => {
  return axios({
    url: `https://api.github.com/repos/AuthEceSoftEng/Families_Share-platform/issues?state=all&direction=asc&page=${page}`,
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
  console.log('Number Title')
  for (let i = 0; i < issues.length; i += 1) {
    console.log(`${issues[i].number} ${issues[i].title}`)
  }
}

create()
