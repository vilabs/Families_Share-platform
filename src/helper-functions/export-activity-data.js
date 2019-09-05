const PDFDocument = require('pdfkit')
const fs = require('fs')
const Profile = require('../models/profile')
const Child = require('../models/child')

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

async function createPdf (activity, timeslots, cb) {
  const doc = new PDFDocument({ autoFirstPage: false })
  doc.pipe(fs.createWriteStream(`${activity.name.toUpperCase()}.pdf`))
  doc.addPage({ margin: 50 })
  doc.font('Times-Roman').fontSize(18).text(`Activity`, {
    align: 'center'
  })
  doc.font('Times-Roman').fontSize(14).text(`Name: ${activity.name}`, {
    align: 'left'
  })
  doc.font('Times-Roman').fontSize(14).text(`Description: ${activity.description || ''}`, {
    align: 'left'
  })
  doc.font('Times-Roman').fontSize(14).text(`Repetition: ${activity.repetition}`, {
    align: 'left'
  })
  doc.font('Times-Roman').fontSize(14).text(`Repetition type: ${activity.repetition_type || ''}`, {
    align: 'left'
  })
  doc.font('Times-Roman').fontSize(18).text(`Timeslots`, {
    align: 'center'
  })
  const specialChildren = []
  for (const timeslot of timeslots) {
    const parents = await Profile.find({ user_id: { $in: JSON.parse(timeslot.extendedProperties.shared.parents) } })
    const children = await Child.find({ child_id: { $in: JSON.parse(timeslot.extendedProperties.shared.children) } })
    const start = new Date(timeslot.start.dateTime)
    const end = new Date(timeslot.end.dateTime)
    const startDate = `${start.getMonth() + 1()}-${start.getDate()}-${start.getFullYear()} ${start.getHours()}:${start.getMinutes()}}`
    const endDate = `${start.getMonth() + 1()}-${end.getDate()}-${end.getFullYear()} ${end.getHours()}:${end.getMinutes()}}`
    doc.font('Times-Roman').fontSize(14).text(`Name: ${timeslot.summary || ''}`, {
      align: 'left'
    })
    doc.font('Times-Roman').fontSize(14).text(`Description: ${timeslot.description || ''}`, {
      align: 'left'
    })
    doc.font('Times-Roman').fontSize(14).text(`Location: ${timeslot.location}`, {
      align: 'left'
    })
    doc.font('Times-Roman').fontSize(14).text(`Start time: ${startDate}`, {
      align: 'left'
    })
    doc.font('Times-Roman').fontSize(14).text(`End time: ${endDate}`, {
      align: 'left'
    })
    doc.font('Times-Roman').fontSize(14).text(`Cost: ${timeslot.extendedProperties.shared.cost}`, {
      align: 'left'
    })
    doc.font('Times-Roman').fontSize(14).text(`Status: ${timeslot.extendedProperties.shared.status}`, {
      align: 'left'
    })
    doc.font('Times-Roman').fontSize(14).text(`Parents:`, {
      align: 'left'
    })
    parents.forEach((parent, index) => {
      doc.font('Times-Roman').fontSize(14).text(`${index + 1}. ${parent.given_name} ${parent.family_name}`, {
        align: 'left'
      })
    })
    doc.font('Times-Roman').fontSize(14).text(`Children:`, {
      align: 'left'
    })
    children.forEach((child, index) => {
      doc.font('Times-Roman').fontSize(14).text(`${index + 1}. ${child.given_name} ${child.family_name}`, {
        align: 'left'
      })
      if (child.allergies || child.special_needs || child.other_info) {
        if (specialChildren.filter(c => c.child_id === child.child_id).length === 0) {
          specialChildren.push(child)
        }
      }
    })
    doc.moveDown()
  }
  doc.font('Times-Roman').fontSize(18).text(`Need special attention`, {
    align: 'center'
  })
  specialChildren.forEach((child, index) => {
    doc.font('Times-Roman').fontSize(14).text(`${index + 1}. ${child.given_name} ${child.family_name}`, {
      align: 'left'
    })
    if (child.allergies) {
      doc.font('Times-Roman').fontSize(14).text(`Allergies: ${child.allergies}`, {
        align: 'left'
      })
    }
    if (child.special_needs) {
      doc.font('Times-Roman').fontSize(14).text(`Special needs: ${child.special_needs}`, {
        align: 'left'
      })
    }
    if (child.other_info) {
      doc.font('Times-Roman').fontSize(14).text(`Other info: ${child.other_info}`, {
        align: 'left'
      })
    }
  })
  doc.end()
  cb()
}

module.exports = {
  newExportEmail: newExportEmail,
  createPdf: createPdf
}
