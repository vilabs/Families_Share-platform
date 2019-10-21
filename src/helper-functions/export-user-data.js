const PDFDocument = require('pdfkit')
const fs = require('fs')
const moment = require('moment')
const path = require('path')

function newExportEmail (given_name) {
  return (`<div
  style="height:100%;display:table;margin-left:auto;margin-right:auto"
>
  <div style="width:300px">
    <img
      style="display:block;margin-left:auto;margin-right:auto"
      src="https://www.families-share.eu/uploads/images/families_share_logo.png"
    />
      <p style="margin:1rem 0;font-size:1.3rem;color:#565a5c;">
        ${given_name},
          you requested to export all your data. Attached to this email, you will find a pdf containing all your personal information.
      </p>
    </div>
  </div>
</div>`
  )
}

function createPdf (profile, groups, children, events, cb) {
  const doc = new PDFDocument({ autoFirstPage: false })
  doc.pipe(fs.createWriteStream(`${profile.given_name.toUpperCase()}_${profile.family_name.toUpperCase()}.pdf`))
  doc.addPage({ margin: 50 })

  doc.fontSize(18).text(`User's Profile`, {
    align: 'center'
  })
  doc.image(path.join(__dirname, `../..${profile.image.path}`), { width: 150 })
  doc.moveDown()
  doc.fontSize(14)
  doc.text(`Given name: ${profile.given_name}`, {
    align: 'left' })
  doc.text(`Family name: ${profile.family_name}`, {
    align: 'left' })
  doc.text(`Email: ${profile.email}`, {
    align: 'left' })
  doc.text(`Number: ${profile.phone}`, {
    align: 'left' })
  doc.text(`Address: ${profile.address.city}, ${profile.address.street} ${profile.address.number}`, {
    align: 'left' })
  doc.moveDown()
  doc.fontSize(18)
  doc.text(`User's Groups`, {
    align: 'center'
  })
  doc.fontSize(14)
  groups.forEach((group, index) => {
    doc.text(`${index + 1}. ${group.name}`, {
      align: 'left' })
  })
  doc.moveDown()
  doc.fontSize(18)
  doc.text(`User's Children`, {
    align: 'center'
  })
  doc.fontSize(14)
  children.forEach(child => {
    doc.image(path.join(__dirname, `../..${child.image.path}`), { width: 150, heigh: 150 })
    doc.moveDown()
    doc.text(`Given name: ${child.given_name}`, {
      align: 'left' })
    doc.text(`Family name: ${child.family_name}`, {
      align: 'left' })
    doc.text(`Gender: ${child.gender}`, {
      align: 'left' })
    doc.text(`Birthday: ${moment(child.birthdate).format('DD MMMM YYYY')}`, {
      align: 'left' })
    doc.text(`Allergies: ${child.allergies}`, {
      align: 'left' })
    doc.text(`Special needs: ${child.special_needs}`, {
      align: 'left' })
    doc.text(`Other info: ${child.other_info}`, {
      align: 'left' })
    doc.moveDown()
  })
  doc.fontSize(18)
  doc.text(`User's Events`, {
    align: 'center'
  })
  doc.fontSize(14)
  events.forEach((event, index) => {
    doc.text(`${index + 1}. ${event.summary}`, {
      align: 'left' })
  })
  doc.end()
  cb()
}

module.exports = {
  newExportEmail: newExportEmail,
  createPdf: createPdf
}
