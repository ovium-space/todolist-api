//Modules
const express = require('express')
const api = express()

//Rounters
const todoAPI = require("./apiRoutes/todolist")
const checklistAPI = require("./apiRoutes/checklist")
const userAPI = require("./apiRoutes/user")
const teamAPI = require("./apiRoutes/team")
const team_todolist = require("./apiRoutes/team_todolist")
const team_checklist = require("./apiRoutes/team_checklist")

//Database
const db = require('./models')

//Set PORT
const port = process.env.PORT || 3000

//API USED
const api = express()
api.use(express.json())

//PATH
api.use("/api/v1/todolist", authenticator, todoAPI)
api.use("/api/v1/checklist", authenticator, checklistAPI)
api.use("/api/v1/user", authenticator, userAPI)
api.use("/api/v1/team", authenticator, teamAPI)
api.use("/api/v1/team/todolist", authenticator, team_todolist)
api.use("/api/v1/team/checklist", authenticator, team_checklist)
api.use("/login", authenticate)

//Index
api.get("/", (req, res)=>{
    console.log("INDEX")
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