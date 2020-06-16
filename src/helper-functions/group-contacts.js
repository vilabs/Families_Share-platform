const Excel = require('exceljs')

function newGroupContactsEmail (groupName) {
  return (`<div
  style="height:100%;display:table;margin-left:auto;margin-right:auto"
>
  <div style="width:300px">
    <img
      style="display:block;margin-left:auto;margin-right:auto"
      src="https://www.families-share.eu/uploads/images/families_share_logo.png"
    />
      <p style="margin:1rem 0;font-size:1.3rem;color:#565a5c;">
        Attached to this email, you will find ${groupName} group contacts.
      </p>
    </div>
  </div>
</div>`
  )
}

async function createExcel (group, profiles, cb) {
  const workBook = new Excel.Workbook()
  workBook.creator = 'Families Share'
  workBook.created = new Date()
  const sheet = workBook.addWorksheet(`${group.name} Contacts`)
  sheet.columns = [
    {
      header: 'ID',
      key: 'index',
      width: 10,
      style: {
        alignment: {
          horizontal: 'center'
        }
      }
    },
    {
      header: 'Name',
      key: 'name',
      width: 30,
      style: {
        alignment: {
          horizontal: 'center'
        }
      }
    },
    {
      header: 'Surname',
      key: 'surname',
      width: 30,
      style: {
        alignment: {
          horizontal: 'center'
        }
      }
    },
    {
      header: 'Admin',
      key: 'admin',
      width: 20,
      style: {
        alignment: {
          horizontal: 'center'
        }
      }
    },
    {
      header: 'Email',
      key: 'email',
      width: 40,
      style: {
        alignment: {
          horizontal: 'center'
        }
      }
    },
    {
      header: 'Phone',
      key: 'phone',
      width: 40,
      style: {
        alignment: {
          horizontal: 'center'
        }
      }
    }
  ]
  profiles.forEach((profile, index) => {
    sheet.addRow({
      index: index + 1,
      name: profile.given_name,
      surname: profile.family_name,
      admin: profile.admin ? 'X' : '',
      email: profile.email,
      phone: profile.phone ? profile.phone : '-'
    })
  })
  sheet.getRow(1).font = { bold: true }
  workBook.xlsx.writeFile(`contacts.xlsx`)
    .then(() => {
      console.log('Excel created')
      cb()
    })
}

module.exports = {
  newGroupContactsEmail,
  createExcel
}
