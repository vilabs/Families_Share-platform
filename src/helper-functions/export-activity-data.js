const Excel = require('exceljs')
const Profile = require('../models/profile')
const Child = require('../models/child')
const emergencyNumbers = require('../constants/emergency-numbers')
const citylab = process.env.CITYLAB

let citylabEmergencyNumbers

switch (citylab) {
  case 'Bologna':
  case 'Budapest':
  case 'Venice':
    citylabEmergencyNumbers = emergencyNumbers['Italy']
    break
  case 'DeStuverij':
    citylabEmergencyNumbers = emergencyNumbers['Belgium']
    break
  case 'Thessaloniki':
    citylabEmergencyNumbers = emergencyNumbers['Greece']
    break
  default:
    citylabEmergencyNumbers = emergencyNumbers['Hungary']
}

function newExportEmail (activity_name) {
  return (`<div
  style="height:100%;display:table;margin-left:auto;margin-right:auto"
>
  <div style="width:300px">
    <img
      style="display:block;margin-left:auto;margin-right:auto"
      src="https://www.families-share.eu/uploads/images/families_share_logo.png"
    />
      <p style="margin:1rem 0;font-size:1.3rem;color:#565a5c;">
          You requested to export activity ${activity_name}. Attached to this email, you will find a pdf containing the activity's information.
      </p>
    </div>
  </div>
</div>`
  )
}

async function createExcel (activity, timeslots, cb) {
  const workBook = new Excel.Workbook()
  workBook.creator = 'Families Share'
  workBook.created = new Date()
  const activitySheet = workBook.addWorksheet('Activity details')
  activitySheet.columns = [
    {
      header: 'Activity',
      key: 'activity'
    },
    {
      header: 'Description',
      key: 'activityDescription'
    },
    {
      header: 'Timeslot',
      key: 'timeslot'
    },
    {
      header: 'Date',
      key: 'date'
    },
    {
      header: 'Start Time',
      key: 'start'
    },
    {
      header: 'End time',
      key: 'end'
    },
    {
      header: 'Description',
      key: 'timeslotDescription'
    },
    {
      header: 'Location',
      key: 'location'
    },
    {
      header: 'Cost',
      key: 'cost'
    },
    {
      header: 'No of Required Parents',
      key: 'requiredParents'
    },
    {
      header: 'No of Required Children',
      key: 'requiredChildren'
    },
    {
      header: 'With Enough Participants',
      key: 'enoughParticipants'
    },
    {
      header: 'Parents',
      key: 'parents'
    },
    {
      header: 'Children',
      key: 'children'
    },
    {
      header: 'Children with special needs',
      key: 'specialNeeds'
    },
    {
      header: 'Status',
      key: 'status'
    }
  ]
  const sortedTimeslots = timeslots.sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime))
  let specialNeedsProfiles = []
  for (const timeslot of sortedTimeslots) {
    const additionalInfo = timeslot.extendedProperties.shared
    const requiredParents = additionalInfo.requiredParents
    const requiredChildren = additionalInfo.requiredChildren
    const parents = JSON.parse(additionalInfo.parents)
    const children = JSON.parse(additionalInfo.children)
    const parentProfiles = await Profile.find({ user_id: { $in: parents } })
    const childrenProfiles = await Child.find({ child_id: { $in: children } })
    const childrenWithSpecialNeeds = childrenProfiles.filter(c => c.allergies || c.special_needs || c.other.info)
    specialNeedsProfiles = specialNeedsProfiles.concat(childrenWithSpecialNeeds)
    const start = new Date(timeslot.start.dateTime)
    const end = new Date(timeslot.end.dateTime)
    const originalStart = timeslot.extendedProperties.shared.start || start.getHours()
    const originalEnd = timeslot.extendedProperties.shared.end || end.getHours()
    const date = `${start.getMonth() + 1}-${start.getDate()}-${start.getFullYear()}`
    activitySheet.addRow({
      activity: activity.name,
      activityDescription: activity.description,
      timeslot: timeslot.summary,
      date,
      start: `${originalStart}:${start.getMinutes()}`,
      end: `${originalEnd}:${end.getMinutes()}`,
      timeslotDescription: timeslot.description,
      location: timeslot.location,
      cost: additionalInfo.cost,
      requiredParents,
      requiredChildren,
      enoughParticipants:
        parents.length >= requiredParents && children.length >= requiredChildren
          ? 'YES'
          : 'NO',
      parents: parentProfiles
        .map(p => `${p.given_name} ${p.family_name}`)
        .toString(),
      children: childrenProfiles
        .map(c => `${c.given_name} ${c.family_name}`)
        .toString(),
      specialNeeds: childrenWithSpecialNeeds
        .map(c => `${c.given_name} ${c.family_name}`)
        .toString(),
      status: additionalInfo.status
    })
  }
  activitySheet.mergeCells(`A2:A${timeslots.length + 1}`)
  activitySheet.mergeCells(`B2:B${timeslots.length + 1}`)
  activitySheet.getCell('A2').alignment = { vertical: 'middle' }
  activitySheet.getCell('B2').alignment = { vertical: 'middle' }
  const needsSheet = workBook.addWorksheet('Important Information')
  needsSheet.columns = [
    {
      header: 'Child',
      key: 'child'
    },
    {
      header: 'Allergies',
      key: 'allergies'
    },
    {
      header: 'Special Needs',
      key: 'specialNeeds'
    },
    {
      header: 'Other info',
      key: 'otherInfo'
    }
  ]
  specialNeedsProfiles
    .filter((profile, index, self) => index === self.findIndex((obj) => (
      profile['child_id'] === obj['child_id'])))
    .forEach(profile => {
      needsSheet.addRow({
        child: `${profile.given_name} ${profile.family_name}`,
        allergies: profile.allergie,
        specialNeeds: profile.special_needs,
        otherInfo: profile.other_info
      })
    })
  const emergencySheet = workBook.addWorksheet('Emergency Numbers')
  emergencySheet.columns = [
    {
      header: 'Service',
      key: 'service'
    },
    {
      header: 'Number',
      key: 'number'
    }
  ]
  citylabEmergencyNumbers.forEach(emergency => {
    emergencySheet.addRow({
      service: emergency.service,
      number: emergency.number
    })
  })
  workBook.xlsx.writeFile(`${activity.name.toUpperCase()}.xlsx`)
    .then(() => {
      console.log('Excel created')
      cb()
    })
}

module.exports = {
  newExportEmail,
  createExcel
}
