const mailer = require("nodemailer")
const { todolist } = require("./models")
const { checklist } = require("./models")
const { user } = require("./models")

//date now
let date = new Date()
let day = date.getDate()
let month = date.getMonth()
let year = date.getFullYear()

//sender
let transporter = mailer.createTransport({
  host: "smtp.gmail.com", // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

//check
async function checkTodolist() {
  let content = []
  let todayChecklist = []
  let notDoneChecklist = []
  let dest = ""
  let allUser = await user.findAll({ raw: true })
  for (const user1 of allUser) {
    let dest = user1["email"]
    let allTodolist = await todolist.findAll({ raw: true, where: { user_ID: user1["user_ID"] } })
    for (const todo of allTodolist) {
      //check date of todolist
      if (checktime(todo["start_datetime"])) {
        //Today Checklist
        let allChecklist = await checklist.findAll({
          raw: true,
          where: { todolist_ID: todo["todolist_ID"] },
        })
        for (const checklist of allChecklist) {
          if (!checktime(checklist["due_datetime"])) continue
          todayChecklist.push(checklist["name"])
        }
        //Checklist not done
        let isCheck = allChecklist.filter((data) => {
          return (
            data["checklist_check"] == false && data["expire_datetime"].getTime() < date.getTime()
          )
        }) //
        notDoneChecklist = isCheck.map((data) => {
          return (
            data["name"] +
            " " +
            data["due_datetime"].getDate() +
            "-" +
            (parseInt(data["due_datetime"].getMonth()) + 1) +
            "-" +
            data["due_datetime"].getFullYear()
          )
        })
        let json = {
          todolist: todo["name"],
          checklist: todayChecklist,
          expireChecklist: notDoneChecklist,
        }
        content.push(json)
        todayChecklist = []
        notDoneChecklist = []
        console.log(content)
        //sendmail(dest, content)
      }
    }
    content = []
  }
}

//send
function sendmail(dest, content) {
  //email
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: dest,
    subject: "Todo " + day + "-" + (parseInt(month) + 1) + "-" + year,
    html: "",
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err)
    else console.log(info)
  })
}

//check date month year
function checktime(time) {
  if (day == time.getDate() && month == time.getMonth() && year == time.getFullYear()) {
    return true
  } else {
    return false
  }
}

module.exports = { checkTodolist }
