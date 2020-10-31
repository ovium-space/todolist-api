//Modules
const express = require('express')
const api = express()

//Rounters
const todoAPI = require("./apiRoutes/todolist")
const checklistAPI = require("./apiRoutes/checklist")
const userAPI = require("./apiRoutes/user")

//Database
const db = require('./models')

//Set PORT
const port = process.env.PORT || 3000

//API USED
api.use(express.json())
api.use("/api/v1/", todoAPI)
api.use("/api/v1/", checklistAPI)
api.use("/api/v1/", userAPI)

//Index
api.get("/", async (req, res)=>{
    console.log("INDEX")
     let teamADD = await db.team.create({
        team_ID:"1",
        name:"trainee"
    })
     let bruh = await db.user.create({
        user_ID: "3",
        firstname: "punpetch",
        lastname: "prakongapak",
        email: "bigbosskts22@hotmail.com",
        username: "bigboss",
        password: "123456"
    })
    let find = await db.user.findOne({
        where:{
            user_ID: "3"
        }
    })


    console.log(find)
    res.sendStatus(200)
})

//Debug only!
api.get("/reset", async (req, res)=>{
    db.sequelize.sync({force: true}).then(()=>{console.log("Database Sync!")}).catch(err=>console.log(err))
    res.sendStatus(200)
})

//Authenticate database
db.sequelize.authenticate().then(()=>{
    console.log("Connected to database.")
}).catch((err)=>{
    console.log("Failed to connect to database: \n" + err)
})

//Let's API Listen on PORT
api.listen(port, ()=>{
    console.log(`Listen on port: ${port}`)
})