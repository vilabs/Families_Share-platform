const Excel = require('exceljs')
const Profile = require('../models/profile')
const Child = require('../models/child')
const path = require('path')
const emergencyNumbers = require('../constants/emergency-numbers')
const citylab = process.env.CITYLAB
var PdfMake = require('pdfmake')
const fs = require('fs')

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
  return `<div
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
  const sortedTimeslots = timeslots.sort(
    (a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime)
  )
  let specialNeedsProfiles = []
  for (const timeslot of sortedTimeslots) {
    const additionalInfo = timeslot.extendedProperties.shared
    const requiredParents = additionalInfo.requiredParents
    const requiredChildren = additionalInfo.requiredChildren
    const parents = JSON.parse(additionalInfo.parents)
    const children = JSON.parse(additionalInfo.children)
    const parentProfiles = await Profile.find({ user_id: { $in: parents } })
    const childrenProfiles = await Child.find({ child_id: { $in: children } })
    const childrenWithSpecialNeeds = childrenProfiles.filter(
      c => c.allergies || c.special_needs || c.other.info
    )
    specialNeedsProfiles = specialNeedsProfiles.concat(
      childrenWithSpecialNeeds
    )
    const start = new Date(timeslot.start.dateTime)
    const end = new Date(timeslot.end.dateTime)
    const originalStart =
      timeslot.extendedProperties.shared.start || start.getHours()
    const originalEnd =
      timeslot.extendedProperties.shared.end || end.getHours()
    const date = `${start.getMonth() +
      1}-${start.getDate()}-${start.getFullYear()}`
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
    .filter(
      (profile, index, self) =>
        index === self.findIndex(obj => profile['child_id'] === obj['child_id'])
    )
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
  workBook.xlsx.writeFile(`${activity.name.toUpperCase()}.xlsx`).then(() => {
    console.log('Excel created')
    cb()
  })
}

async function createPdf (activity, timeslots, cb) {
  const fonts = {
    Roboto: {
      normal: path.join(__dirname, '../fonts', 'Roboto-Regular.ttf'),
      bold: path.join(__dirname, '../fonts', 'Roboto-Bold.ttf'),
      italics: path.join(__dirname, '../fonts', 'Roboto-Italic.ttf'),
      bolditalics: path.join(__dirname, '../fonts', 'Roboto-BoldItalic.ttf')
    }
  }
  const printer = new PdfMake(fonts)
  const sortedTimeslots = timeslots.sort(
    (a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime)
  )
  const values = []
  const needsValues = []
  let specialNeedsProfiles = []
  for (const timeslot of sortedTimeslots) {
    const additionalInfo = timeslot.extendedProperties.shared
    const requiredParents = additionalInfo.requiredParents
    const requiredChildren = additionalInfo.requiredChildren
    const parents = JSON.parse(additionalInfo.parents)
    const children = JSON.parse(additionalInfo.children)
    const parentProfiles = await Profile.find({ user_id: { $in: parents } })
    const childrenProfiles = await Child.find({ child_id: { $in: children } })
    const childrenWithSpecialNeeds = childrenProfiles.filter(
      c => c.allergies || c.special_needs || c.other.info
    )
    specialNeedsProfiles = specialNeedsProfiles.concat(
      childrenWithSpecialNeeds
    )
    const start = new Date(timeslot.start.dateTime)
    const end = new Date(timeslot.end.dateTime)
    const originalStart =
      timeslot.extendedProperties.shared.start || start.getHours()
    const originalEnd =
      timeslot.extendedProperties.shared.end || end.getHours()
    const date = `${start.getMonth() +
      1}-${start.getDate()}-${start.getFullYear()}`
    values.push([
      timeslot.summary,
      timeslot.description || '-',
      date,
      `${originalStart}:${start.getMinutes()} - ${originalEnd}:${end.getMinutes()}`,
      timeslot.location || '-',
      additionalInfo.cost || '-',
      requiredParents,
      requiredChildren,
      additionalInfo.status,
      parentProfiles.map(p => `${p.given_name} ${p.family_name}`).toString() || '-',
      childrenProfiles.map(c => `${c.given_name} ${c.family_name}`).toString() || '-'
    ])
  }
  specialNeedsProfiles
    .filter(
      (profile, index, self) =>
        index === self.findIndex(obj => profile['child_id'] === obj['child_id'])
    )
    .forEach(profile => {
      needsValues.push({
        name: `${profile.given_name} ${profile.family_name}`,
        allergies: profile.allergies,
        specialNeeds: profile.special_needs,
        otherInfo: profile.other_info
      })
    })
  const docDefinition = {
    pageMargins: 50,
    pageOrientation: 'landscape',
    header: {
      columns: [
        {
          text: 'Families Share Platform',
          alignment: 'right',
          opacity: 0.5,
          margin: 5
        }
      ]
    },
    content: [
      {
        text: activity.name,
        alignment: 'center',
        fontSize: 16,
        margin: [0, 0, 0, 50]
      },
      {
        margin: [0, 0, 0, 50],
        ul: [
          {
            text: ['Description: ', { text: activity.description, bold: true }]
          },
          {
            text: [
              'Repetitive Activity: ',
              { text: activity.repetition ? 'YES' : 'NO', bold: true }
            ]
          },
          {
            text: [
              'Kind of repetition: ',
              {
                text: activity.repetition ? activity.repetition_type : '-',
                bold: true
              }
            ]
          }
        ]
      },
      {
        text: 'SUB-ACTIVITIES/TIMESLOTS',
        alignment: 'center',
        fontSize: 16,
        margin: [0, 0, 0, 50]
      },
      {
        margin: [0, 0, 0, 50],
        alignment: 'center',
        table: {
          headerRows: 1,
          widths: [
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto',
            'auto'
          ],
          body: [
            [
              'Timeslots',
              'Description',
              'Date',
              'Starting & Ending Time',
              'Place',
              'Cost',
              'Min n. of parents',
              'Min n. of children',
              'Status',
              'Participating Parents',
              'Participating Children'
            ],
            ...values
          ]
        }
      },
      {
        text: 'CHILDREN THAT NEED EXTRA ATTENTION',
        alignment: 'center',
        fontSize: 16,
        margin: [0, 0, 0, 50]
      },
      {
        ul: [
          ...needsValues.map(child => ({
            margin: [0, 0, 0, 50],
            text: [
              { text: `${child.name}\n`, bold: true, fontSize: 14 },
              { text: `Allergies: ${child.allergies} \n`, fontSize: 14 },
              { text: `Special Needs: ${child.specialNeeds} \n`, fontSize: 14 },
              { text: `Other Info: ${child.otherInfo} \n`, fontSize: 14 }
            ]
          }))
        ]
      }
    ]
  }
  const pdfDoc = printer.createPdfKitDocument(docDefinition)
  pdfDoc.pipe(fs.createWriteStream(`${activity.name.toUpperCase()}.pdf`))
  pdfDoc.end()
  cb()
}

module.exports = {
  newExportEmail,
  createExcel,
  createPdf
}
