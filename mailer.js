const mailer = require('nodemailer')
const { todolist } = require('./models')
const { checklist } = require('./models')
const { user } = require('./models')

//sender
let transporter = mailer.createTransport( {
    host: "smtp.gmail.com", // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})
//check
async function checkTodolist(){
    let text = []
    let destination = ""
    let allUser = await user.findAll({raw:true})
    for (const data of allUser) {
        let allTodolist = await todolist.findAll({raw:true, where: {user_ID: data['user_ID']}})
        for (const data1 of allTodolist) {
            let allChecklist = await checklist.findAll({raw:true, where:{todolist_ID: data1['todolist_ID']}})
            let isCheck = allChecklist.filter((data)=>{return data['checklist_check'] == false})
            if (isCheck.length > 0) text.push(data1['name'])
        }
        if(text.length != 0) {
            destination = data['email']
            console.log(destination, text.toString())
            //sendmail(destination, text)
        }
        text = []
    }
}

//send
function sendmail(dest, todolist){
    //email
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: dest,
        subject: 'Todolist do not finish',
        text: todolist.toString()
    }
    transporter.sendMail(mailOptions, (err, info)=>{
        if (err) console.log(err)
        else console.log(info)
    })
}

module.exports = { checkTodolist }