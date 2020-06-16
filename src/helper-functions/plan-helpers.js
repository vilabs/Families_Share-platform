const Excel = require('exceljs')
const Profile = require('../models/profile')
const Child = require('../models/child')
const Parent = require('../models/parent')
const moment = require('moment')
const objectid = require('objectid')

const syncChildSubscriptions = async participants => {
  const currentChildSuscriptions = [...new Set(participants[0].needs.reduce((a, b) => a.concat(b.children), []))]
  for (const childSubscription of currentChildSuscriptions) {
    const parent = await Parent.findOne({ child_id: childSubscription, parent_id: { $ne: participants[0].user_id } })
    participants.forEach((participant) => {
      if (parent && participant.user_id === parent.parent_id) {
        if (participant.needs.length > 0) {
          participant.needs.forEach(otherParentNeed => {
            if (otherParentNeed.children.includes(childSubscription)) {
              otherParentNeed.children.splice(otherParentNeed.children.indexOf(childSubscription), 1)
            }
          })
          participant.needs = participant.needs.filter(n => n.children.length > 0)
          participants[0].needs
            .filter(n => n.children.includes(childSubscription))
            .forEach(myNeed => {
              const needIndex = participant.needs.findIndex(n => moment(n.day).format('DDMMYY') === moment(myNeed.day).format('DDMMYY'))
              if (needIndex === -1) {
                participant.needs.push({
                  day: myNeed.day,
                  children: [childSubscription]
                })
              } else {
                participant.needs[needIndex].children.push(childSubscription)
              }
            })
          participant.needs = participant.needs.sort((a, b) => new Date(a) - new Date(b))
        }
      }
    })
  }
  return participants
}

const getMetrics = (connections, subscriptions, slots, plan) => {
  const needCoverage = {} // percentage of parents needs that have been covered
  const totalContribution = {} // parents total contribution % to all slots
  const fulfilledContribution = {}// parents total contribution % to optimal-fulfilled slots
  Object.keys(connections).forEach(parentId => {
    needCoverage[parentId] = 0
    fulfilledContribution[parentId] = 0
    totalContribution[parentId] = 0
  })
  subscriptions.forEach(slot => {
    slot.isOptimal = (slot.volunteers.length >= plan.min_volunteers) && (slot.volunteers.length / slot.children.length) >= (1 / plan.ratio)
    slot.volunteers.forEach(parent => {
      if (slot.isOptimal) {
        fulfilledContribution[parent] += 1
        slot.children.forEach(child => {
          if (connections[parent].includes(child)) {
            needCoverage[parent] += 1
          }
        })
      }
      totalContribution[parent] += 1
    })
  })
  // turning metric values to percentages
  const optimalSlots = subscriptions.filter(s => s.isOptimal).length
  Object.keys(connections).forEach(parent => {
    if (connections[parent].length) {
      needCoverage[parent] /= connections[parent].length
      totalContribution[parent] /= slots.length
      if (optimalSlots) {
        fulfilledContribution[parent] /= optimalSlots
      } else {
        fulfilledContribution[parent] = 0
      }
    } else {
      needCoverage[parent] = 1 // should further elaborate on this
    }
  })
  return { needCoverage, totalContribution, fulfilledContribution }
}

const rankVolunteers = (slot, fulfilledContribution, needCoverage) => {
  return slot.volunteers.sort((a, b) => {
    const fulfilledContributionRanking = fulfilledContribution[a] - fulfilledContribution[b]
    if (fulfilledContributionRanking > 0) {
      return -1
    } else if (fulfilledContributionRanking < 0) {
      return 1
    } else {
      // remove parent that has lower need coverage
      const needCoverageRanking = needCoverage[a] - needCoverage[b]
      if (needCoverageRanking > 0) {
        return 1
      } else {
        return -1
      }
    }
  })
}

const findOptimalSolution = (plan) => {
  const { participants } = plan
  let people = []
  let slots = []
  const connections = {}
  // create array with people and array with slots and parent-children needs object
  participants.forEach(p => {
    connections[p.user_id] = []
    people.push({ id: p.user_id, type: 'parent' })
    p.availabilities.forEach(a => {
      slots.push(`${moment(a.day).format('DD MMM YYYY')}-AM`)
      slots.push(`${moment(a.day).format('DD MMM YYYY')}-PM`)
    })
    p.needs.forEach(n => {
      slots.push(`${moment(n.day).format('DD MMM YYYY')}-AM`)
      slots.push(`${moment(n.day).format('DD MMM YYYY')}-PM`)
      n.children.forEach(c => {
        connections[p.user_id].push(c)
        connections[p.user_id].push(c)
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
  // sorts slots by date
  slots = slots.sort((a, b) => {
    return new Date(a.split('-')[0]) - new Date(b.split('-')[0])
  })
  // assign people to slots
  let subscriptions = slots.map(s => {
    const tmp = {
      slot: s,
      children: [],
      volunteers: []
    }
    people.forEach(p => {
      if (p.type === 'parent') {
        const availability = participants
          .find(pa => pa.user_id === p.id)
          .availabilities
          .find(a => s.includes(moment(a.day).format('DD MMM YYYY')))
        if (availability) {
          if (availability.meridiem === 'both') {
            const day = s.split('-')[0]
            if (day === moment(availability.day).format('DD MMM YYYY')) {
              tmp.volunteers.push(p.id)
            }
          } else if (s === `${moment(availability.day).format('DD MMM YYYY')}-${availability.meridiem}`) {
            tmp.volunteers.push(p.id)
          }
        }
      } else {
        for (const pa of participants) {
          for (const ne of pa.needs) {
            const d = moment(ne.day).format('DD MMM YYYY')
            if ((`${d}-AM` === s || `${d}-PM` === s) && ne.children.includes(p.id)) {
              if (!tmp.children.includes(p.id)) {
                tmp.children.push(p.id)
              }
            }
          }
        }
      }
    })
    return tmp
  })
  // filter subscriptions to remove unnecessary slots
  subscriptions = subscriptions.filter(s => s.children.length > 0)
  // removing redundant parents
  subscriptions.forEach(slot => {
    const redundantParents = Math.min(
      slot.volunteers.length - plan.min_volunteers,
      Math.floor(slot.volunteers.length - slot.children.length * (1 / plan.ratio))
    )
    if (redundantParents > 0) {
      for (let i = 0; i < redundantParents; i++) {
        const { needCoverage, fulfilledContribution } = getMetrics(connections, subscriptions, slots, plan)
        const volunteerRanking = rankVolunteers(slot, fulfilledContribution, needCoverage)
        slot.volunteers.splice(slot.volunteers.indexOf(volunteerRanking[0]), 1)
      }
    }
  })
  return subscriptions
}

function newExportEmail (plan_name) {
  return `<div
  style="height:100%;display:table;margin-left:auto;margin-right:auto"
>
  <div style="width:300px">
    <img
      style="display:block;margin-left:auto;margin-right:auto"
      src="https://www.families-share.eu/uploads/images/families_share_logo.png"
    />
      <p style="margin:1rem 0;font-size:1.3rem;color:#565a5c;">
          You requested to export plan ${plan_name}. Attached to this email, you will find a xls containing the activity's information.
      </p>
    </div>
  </div>
</div>`
}

const createNeedsSheet = (workBook, parentProfiles, childrenProfiles, slots, people, plan) => {
  const needsSheet = workBook.addWorksheet('Children Needs')
  needsSheet.columns = [
    {
      key: 'child',
      width: 20
    },
    {
      key: 'parent',
      width: 20
    },
    ...slots.map(s => ({
      key: s
    }))
  ]
  let row = {
    child: ' ',
    parent: ' '
  }
  slots.forEach(s => {
    row[s] = moment(new Date(s)).format('dddd')
  })
  needsSheet.addRow(row)
  row = {
    child: 'Child name',
    parent: 'Parent name'
  }
  slots.forEach(s => {
    row[s] = moment(new Date(s)).format('DD/MM/YYYY')
  })
  const headersRow = needsSheet.addRow(row)
  headersRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFEFEFEF' }
  }
  headersRow.height = 20
  headersRow.border = {
    bottom: { style: 'thick', color: { argb: 'FFDADFE9' } }
  }
  headersRow.font = { bold: true }

  needsSheet.getColumn('B').border = {
    right: { style: 'thick', color: { argb: 'FFDADFE9' } }
  }
  needsSheet.getCell('B2').border = {
    bottom: { style: 'thick', color: { argb: 'FFDADFE9' } },
    right: { style: 'thick', color: { argb: 'FFDADFE9' } }
  }
  people.filter(p => p.type === 'child').forEach(child => {
    const childProfile = childrenProfiles.find(c => c.child_id === child.id)
    const parentProfile = parentProfiles.find(p => p.user_id === child.parent)
    row = {
      child: childProfile.given_name,
      parent: `${parentProfile.given_name} ${parentProfile.family_name}`
    }
    slots.forEach(s => {
      row[s] = ''
      plan.participants.forEach(p => {
        const need = p.needs.find(n => moment(n.day).format('DD MMMM YYYY') === s)
        if (need) {
          if (need.children.includes(child.id)) {
            row[s] = 'x'
          }
        }
      })
    })
    const needRow = needsSheet.addRow(row)
    needRow.alignment = { horizontal: 'center' }
  })
}

const createAvailabilitiesSheet = (workBook, parentProfiles, slots, plan) => {
  const availabilitiesSheet = workBook.addWorksheet('Parent Availabilities')
  availabilitiesSheet.getColumn('A').width = 20
  let columns = [
    {
      key: 'parent'
    }
  ]
  slots.forEach((s, index) => {
    columns.push({
      key: `${s}-AM`
    })
    columns.push({
      key: `${s}-PM`
    })
    availabilitiesSheet.mergeCells(1, 2 * index + 2, 1, 2 * index + 3)
    availabilitiesSheet.mergeCells(2, 2 * index + 2, 2, 2 * index + 3)
  })
  const weekdaysRow = availabilitiesSheet.getRow(1)
  weekdaysRow.alignment = { horizontal: 'center' }
  const datesRow = availabilitiesSheet.getRow(2)
  datesRow.alignment = weekdaysRow.alignment
  const meridiemRow = availabilitiesSheet.getRow(3)
  meridiemRow.alignment = weekdaysRow.alignment
  const headersRow = availabilitiesSheet.getRow(4)
  datesRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFEFEFEF' }
  }
  datesRow.font = { bold: true }
  meridiemRow.font = datesRow.font
  meridiemRow.fill = datesRow.fill
  headersRow.fill = datesRow.fill
  headersRow.font = datesRow.font
  headersRow.alignment = weekdaysRow.alignment
  headersRow.getCell(1).value = 'Parent name'
  headersRow.getCell(1).border = {
    right: { style: 'thick', color: { argb: 'FFDADFE9' } }
  }
  availabilitiesSheet.getCell('A4').border = {
    right: { style: 'thick', color: { argb: 'FFDADFE9' } }
  }
  slots.forEach((s, index) => {
    weekdaysRow.getCell(index * 2 + 2).value = moment(new Date(s)).format('dddd')
    datesRow.getCell(index * 2 + 2).value = moment(new Date(s)).format('DD/MM/YYYY')
    meridiemRow.getCell(index * 2 + 2).value = 'AM'
    meridiemRow.getCell(index * 2 + 3).value = 'PM'
  })
  availabilitiesSheet.getColumn('A').border = {
    right: { style: 'thick', color: { argb: 'FFDADFE9' } }
  }
  headersRow.border = {
    bottom: { style: 'thick', color: { argb: 'FFDADFE9' } }
  }
  parentProfiles.forEach((profile, index) => {
    let row = availabilitiesSheet.getRow(5 + index)
    row.alignment = { horizontal: 'center' }
    row.getCell(1).value = `${profile.given_name} ${profile.family_name}`
    row.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB7E1CD' }
    }
    slots.forEach((s, index) => {
      const participant = plan.participants.find(p => p.user_id === profile.user_id)
      const availability = participant.availabilities.find(a => moment(a.day).format('DD MMMM YYYY') === s)
      if (availability) {
        if (availability.meridiem === 'both') {
          row.getCell(2 * index + 2).value = 'x'
          row.getCell(2 * index + 3).value = 'x'
        } else if (availability.meridiem === 'am') {
          row.getCell(2 * index + 2).value = 'x'
        } else {
          row.getCell(2 * index + 3).value = 'x'
        }
      }
    })
  })
}

const createNeedsAndAvailabilitiesSheet = (workBook, parentProfiles, slots, people, plan) => {
  const needsAndAvailabilitiesSheet = workBook.addWorksheet('Needs And Availabilities')
  needsAndAvailabilitiesSheet.getColumn('A').width = 20
  needsAndAvailabilitiesSheet.getColumn('B').width = 20

  let columns = [
    {
      key: 'parent'
    },
    {
      key: 'babysitter'
    }
  ]
  slots.forEach((s, index) => {
    columns.push({
      key: `${s}-AM`
    })
    columns.push({
      key: `${s}-PM`
    })
    needsAndAvailabilitiesSheet.mergeCells(1, 2 * index + 3, 1, 2 * index + 4)
    needsAndAvailabilitiesSheet.mergeCells(2, 2 * index + 3, 2, 2 * index + 4)
  })
  const weekdaysRow = needsAndAvailabilitiesSheet.getRow(1)
  weekdaysRow.alignment = { horizontal: 'center' }
  const datesRow = needsAndAvailabilitiesSheet.getRow(2)
  datesRow.alignment = weekdaysRow.alignment
  const meridiemRow = needsAndAvailabilitiesSheet.getRow(3)
  meridiemRow.alignment = weekdaysRow.alignment
  const headersRow = needsAndAvailabilitiesSheet.getRow(4)
  datesRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFEFEFEF' }
  }
  datesRow.font = { bold: true }
  meridiemRow.font = datesRow.font
  meridiemRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFB7E1CD' }
  }
  headersRow.fill = datesRow.fill
  headersRow.alignment = weekdaysRow.alignment
  headersRow.font = datesRow.font
  headersRow.getCell(1).value = 'Parent name'
  headersRow.getCell(2).value = 'Babysistter'
  headersRow.getCell(2).border = {
    right: { style: 'thick', color: { argb: 'FFDADFE9' } }
  }
  needsAndAvailabilitiesSheet.getCell('B4').border = {
    right: { style: 'thick', color: { argb: 'FFDADFE9' } }
  }
  slots.forEach((s, index) => {
    weekdaysRow.getCell(index * 2 + 3).alignment = { horizontal: 'center' }
    datesRow.getCell(index * 2 + 3).alignment = { horizontal: 'center' }
    meridiemRow.getCell(index * 2 + 3).alignment = { horizontal: 'center' }
    meridiemRow.getCell(index * 2 + 4).alignment = { horizontal: 'center' }
    weekdaysRow.getCell(index * 2 + 3).value = moment(new Date(s)).format('dddd')
    datesRow.getCell(index * 2 + 3).value = moment(new Date(s)).format('DD/MM/YYYY')
    meridiemRow.getCell(index * 2 + 3).value = 'AM'
    meridiemRow.getCell(index * 2 + 4).value = 'PM'
  })
  needsAndAvailabilitiesSheet.getColumn('B').border = {
    right: { style: 'thick', color: { argb: 'FFDADFE9' } }
  }
  headersRow.border = {
    bottom: { style: 'thick', color: { argb: 'FFDADFE9' } }
  }
  parentProfiles.forEach((profile, index) => {
    let row = needsAndAvailabilitiesSheet.getRow(5 + index)
    row.alignment = { horizontal: 'center' }
    row.getCell(1).value = `${profile.given_name} ${profile.family_name}`
    row.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB7E1CD' }
    }
    slots.forEach((s, index) => {
      const participant = plan.participants.find(p => p.user_id === profile.user_id)
      const availability = participant.availabilities.find(a => moment(a.day).format('DD MMMM YYYY') === s)
      if (availability) {
        if (availability.meridiem === 'both') {
          row.getCell(2 * index + 3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFEFEF' } }
          row.getCell(2 * index + 4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFEFEF' } }
        } else if (availability.meridiem === 'am') {
          row.getCell(2 * index + 3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFEFEF' } }
        } else {
          row.getCell(2 * index + 4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFEFEF' } }
        }
      }
    })
  })
}

const createPlanSheet = (workBook, plan) => {
  const planSheet = workBook.addWorksheet('Plan details')
  planSheet.columns = [
    {
      key: 'name',
      header: 'Name'
    },
    {
      key: 'description',
      header: 'Description'
    },
    {
      key: 'category',
      header: 'Category'
    },
    {
      key: 'location',
      header: 'Location'
    },
    {
      key: 'from',
      header: 'From'
    },
    {
      key: 'to',
      header: 'To'
    },
    {
      key: 'deadline',
      header: 'Deadline'
    },
    {
      key: 'ratio',
      header: 'Children to Volunteers ratio'
    },
    {
      key: 'min_volunteers',
      header: 'Min number of volunteers'
    },
    {
      key: 'state',
      header: 'State'
    }
  ]
  planSheet.addRow({
    name: plan.name,
    description: plan.description,
    location: plan.location,
    min_volunteers: plan.min_volunteers,
    ratio: plan.ratio,
    from: moment(plan.from).format('DD/MM/YYYY'),
    to: moment(plan.to).format('DD/MM/YYYY'),
    deadline: moment(plan.deadline).format('DD/MM/YYYY'),
    category: plan.category,
    state: plan.state
  })
}

const createSolutionSheet = (workBook, solution, parents, children) => {
  const solutionSheet = workBook.addWorksheet('Solution')
  solutionSheet.getColumn('A').width = 20

  let columns = [
    {
      key: 'name'
    }
  ]
  solution.forEach(({ slot }, index) => {
    columns.push({
      key: slot
    })
    if (index % 2 === 0) {
      solutionSheet.mergeCells(1, index + 2, 1, index + 3)
      solutionSheet.mergeCells(2, index + 2, 2, index + 3)
    }
  })
  const weekdaysRow = solutionSheet.getRow(1)
  weekdaysRow.alignment = { horizontal: 'center' }
  const datesRow = solutionSheet.getRow(2)
  datesRow.alignment = weekdaysRow.alignment
  const meridiemRow = solutionSheet.getRow(3)
  meridiemRow.alignment = weekdaysRow.alignment
  const headersRow = solutionSheet.getRow(4)
  datesRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFEFEFEF' }
  }
  datesRow.font = { bold: true }
  meridiemRow.font = datesRow.font
  meridiemRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFB7E1CD' }
  }
  headersRow.fill = datesRow.fill
  headersRow.alignment = weekdaysRow.alignment
  headersRow.font = datesRow.font
  headersRow.getCell(1).value = 'Parent name'
  headersRow.getCell(2).border = {
    right: { style: 'thick', color: { argb: 'FFDADFE9' } }
  }
  solutionSheet.getCell('A4').border = {
    right: { style: 'thick', color: { argb: 'FFDADFE9' } }
  }
  solution.forEach(({ slot }, index) => {
    if (index % 2 === 0) {
      weekdaysRow.getCell(index + 2).alignment = { horizontal: 'center' }
      datesRow.getCell(index + 2).alignment = { horizontal: 'center' }
      datesRow.getCell(index + 2).value = slot
      weekdaysRow.getCell(index + 2).value = moment(new Date(slot.split('-')[0])).format('dddd')
    }
    meridiemRow.getCell(index + 2).alignment = { horizontal: 'center' }
    meridiemRow.getCell(index + 2).value = slot.split('-')[1]
  })
  solutionSheet.getColumn('B').border = {
    right: { style: 'thick', color: { argb: 'FFDADFE9' } }
  }
  headersRow.border = {
    bottom: { style: 'thick', color: { argb: 'FFDADFE9' } }
  }
  parents.forEach((profile, index) => {
    let row = solutionSheet.getRow(5 + index)
    row.alignment = { horizontal: 'center' }
    row.getCell(1).value = `${profile.given_name} ${profile.family_name}`
    row.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB7E1CD' }
    }
    solution.forEach(({ volunteers }, index) => {
      if (volunteers.includes(profile.user_id)) {
        row.getCell(index + 2).value = 'X'
      }
    })
  })
  const childHeaderRow = solutionSheet.getRow(5 + parents.length)
  childHeaderRow.getCell(1).value = 'Child name'
  childHeaderRow.font = datesRow.font
  childHeaderRow.fill = datesRow.fill
  childHeaderRow.alignment = weekdaysRow.alignment
  children.forEach((profile, index) => {
    let row = solutionSheet.getRow(5 + parents.length + 1 + index)
    row.alignment = { horizontal: 'center' }
    row.getCell(1).value = `${profile.given_name} ${profile.family_name}`
    row.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB7E1CD' }
    }
    solution.forEach(({ children }, index) => {
      if (children.includes(profile.child_id)) {
        row.getCell(index + 2).value = 'X'
      }
    })
  })
}

async function createExcel (plan, cb) {
  const workBook = new Excel.Workbook()
  workBook.creator = 'Families Share'
  workBook.created = new Date()
  let people = []
  const start = moment(plan.from)
  const end = moment(plan.to)
  const slots = [start.format('DD MMMM YYYY')]
  while (start.add(1, 'days').diff(end) <= 0) {
    slots.push(start.clone().format('DD MMMM YYYY'))
  }
  slots.push(end.format('DD MMMM YYYY'))
  plan.participants.forEach(p => {
    people.push({ id: p.user_id, type: 'parent' })
    p.needs.forEach(n => {
      n.children.forEach(c => {
        people.push({ id: c, type: 'child', parent: p.user_id })
      })
    })
  })
  const filteredSlots = slots.filter(slot => {
    let found = false
    plan.participants.forEach(pa => {
      if (pa.needs.map(need => moment(need.day).format('DD MMMM YYYY')).includes(slot)) {
        found = true
      }
    })
    return found
  })
  people = people.filter(
    (person, index, self) =>
      index === self.findIndex(obj => person.id === obj.id)
  )
  const parentProfiles = await Profile.find({ user_id: { $in: people.filter(p => p.type === 'parent').map(p => p.id) } })
  const childrenProfiles = await Child.find({ child_id: { $in: people.filter(p => p.type === 'child').map(p => p.id) } })

  createPlanSheet(workBook, plan)
  createNeedsSheet(workBook, parentProfiles, childrenProfiles, slots, people, plan)
  createAvailabilitiesSheet(workBook, parentProfiles, filteredSlots, plan)
  createNeedsAndAvailabilitiesSheet(workBook, parentProfiles, filteredSlots, people, plan)
  workBook.xlsx.writeFile(`plan.xlsx`).then(() => {
    cb()
  })
}

async function createSolutionExcel (plan, cb) {
  const workBook = new Excel.Workbook()
  workBook.creator = 'Families Share'
  workBook.created = new Date()
  const parents = [...new Set(plan.solution.map(slot => slot.volunteers).flat())]
  const children = [...new Set(plan.solution.map(slot => slot.children).flat())]
  const parentProfiles = await Profile.find({ user_id: { $in: parents } })
  const childrenProfiles = await Child.find({ child_id: { $in: children } })
  createSolutionSheet(workBook, plan.solution, parentProfiles, childrenProfiles)
  workBook.xlsx.writeFile(`plan_solution.xlsx`).then(() => {
    cb()
  })
}

const getRandomColor = () => {
  var letters = '0123456789ABCDEF'
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const transformPlanToActivities = (plan, group, userId) => {
  const events = []
  const activity = {}
  const activity_id = objectid()
  activity.status = 'accepted'
  activity.activity_id = activity_id
  activity.group_id = group.group_id
  activity.group_name = group.name
  activity.name = plan.name
  activity.color = getRandomColor()
  activity.description = plan.description
  activity.creator_id = userId
  activity.repetition = false
  activity.repetition_type = 'none'
  activity.different_timeslots = true
  plan.solution.forEach(slot => {
    const event = {
      description: plan.description,
      location: plan.location,
      summary: plan.name,
      start: {
        date: null,
        dateTime: slot.start
      },
      end: {
        date: null,
        dateTime: slot.end
      },
      extendedProperties: {
        shared: {
          requiredParents: plan.min_volunteers,
          requiredChildren: 2,
          cost: '',
          link: '',
          parents: JSON.stringify(slot.volunteers),
          children: JSON.stringify(slot.children),
          externals: JSON.stringify([]),
          status: 'ongoing',
          activityColor: activity.color,
          category: plan.category,
          activityId: activity.activity_id,
          groupId: group.group_id,
          repetition: 'none',
          start: slot.startHour,
          end: slot.endHour
        }
      }
    }
    events.push(event)
  })
  return [activity, events]
}

module.exports = {
  findOptimalSolution,
  newExportEmail,
  createExcel,
  createSolutionExcel,
  syncChildSubscriptions,
  transformPlanToActivities
}
