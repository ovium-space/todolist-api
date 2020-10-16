//Modules
const express = require('express')
const api = express()

//Rounters
const todoAPI = require("./apiRoutes/todolist")
const checklistAPI = require("./apiRoutes/checklist")

//Database
const db = require('./models')

const port = process.env.PORT || 3000

api.use(express.json())
api.use("/api/v1/", todoAPI)
api.use("/api/v1/", checklistAPI)

api.get("/", (req, res)=>{
    console.log("INDEX")
    res.sendStatus(200)
})

//Authenticate database
db.sequelize.authenticate().then(()=>{
    console.log("Connected to database.")
}).catch((err)=>{
    console.log("Failed to connect to database: \n" + err)
})

api.listen(port, ()=>{
    console.log(`Listen on port: ${port}`)
})