//Modules
const express = require('express')
const api = express()

//Rounters
const todoAPI = require("./apiRoutes/todolist")
const checklistAPI = require("./apiRoutes/checklist")
const userAPI = require("./apiRoutes/user")
const teamAPI = require("./apiRoutes/team")
const team_todolist = require("./apiRoutes/team_todolist")

//Database
const db = require('./models')

//Set PORT
const port = process.env.PORT || 3000

//API USED
api.use(express.json())
api.use("/api/v1/", todoAPI)
api.use("/api/v1/", checklistAPI)
api.use("/api/v1/", userAPI)
api.use("/api/v1/", teamAPI)
api.use("/api/v1/team", team_todolist)

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