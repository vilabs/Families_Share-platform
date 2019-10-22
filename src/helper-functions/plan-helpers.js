
const findOptimalSolution = async plan => {
  const { ratio, min_volunteeers: minVolunteers, participants } = plan
  let people = []
  let slots = []
  // create array with people and array with slots
  participants.forEach(p => {
    people.push({ id: p.user_id, type: 'parent' })
    p.availabilities.forEach(a => slots.push(a.day.getTime()))
    p.needs.forEach(n => {
      slots.push(n.day.getTime())
      n.children.forEach(c => {
        people.push({ id: c, type: 'child' })
      })
    })
  })
  // remove duplicates from people and slots
  people = people.filter(
    (person, index, self) =>
      index === self.findIndex(obj => person.id === obj.id)
  )
  slots = [...new Set(slots)]
  // assign people to slots
  let subscriptions = slots.map(s =>
    people.map(p => {
      if (p.type === 'parent') {
        if (
          participants
            .find(pa => pa.user_id === p.id)
            .availabilities
            .map(a => a.day.getTime())
            .includes(s)
        ) {
          return 'p'
        }
        return '-'
      } else {
        for (const pa of participants) {
          for (const ne of pa.needs) {
            if (ne.day.getTime() === s && ne.children.includes(p.id)) {
              return 'c'
            }
          }
        }
        return '-'
      }
    })
  )
  // remove unnecessary slots
  subscriptions = subscriptions.filter((sub, index) => {
    if (sub.includes('c')) {
      return true
    } else {
      slots[index] = null
      return false
    }
  })
  slots = slots.filter(s => s !== null)
  // find fullfilled
  const fullfilled = subscriptions.map(sub => {
    const totalParents = sub.filter(s => s === 'p').length
    const totalChildren = sub.filter(s => s === 'c').length
    if (totalParents >= minVolunteers && Math.ceil(totalChildren / totalParents) <= ratio) {
      return 1
    }
    return 0
  })
  console.log(fullfilled)
}

module.exports = {
  findOptimalSolution
}
