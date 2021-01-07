require("dotenv").config()
//Modules
const express = require("express")
const jwt = require("jsonwebtoken")
const authenticator = require("./authenticator")
const cron = require("node-cron")
const mailer = require("./mailer")

//Rounters
const todoAPI = require("./apiRoutes/todolist")
const checklistAPI = require("./apiRoutes/checklist")
const userAPI = require("./apiRoutes/user")
const teamAPI = require("./apiRoutes/team")
const team_todolist = require("./apiRoutes/team_todolist")
const authenticate = require("./apiRoutes/authenticate")
const team_checklist = require("./apiRoutes/team_checklist")
const imageUploader = require("./apiRoutes/imageUploader")

//Database
const db = require("./models")

//Set PORT
const port = process.env.PORT || 3000

//API USED
const api = express()
api.use(express.json())

//PATH
api.use("/api/v1/todolist", todoAPI)
api.use("/api/v1/checklist", checklistAPI)
api.use("/api/v1/user", userAPI)
api.use("/api/v1/team", teamAPI)
api.use("/api/v1/team/todolist", team_todolist)
api.use("/login", authenticate)
api.use("/api/v1/team/checklist", team_checklist)
api.use("/api/v1/", imageUploader)

//Index
api.get("/", authenticator, (req, res) => {
  res.sendStatus(200)
})

//Debug only!
api.get("/reset", async (req, res) => {
  db.sequelize
    .sync({ force: true })
    .then(() => {
      console.log("Database Sync!")
    })
    .catch((err) => console.log(err))
  res.sendStatus(200)
})

//Authenticate database
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to database.")
  })
  .catch((err) => {
    console.log("Failed to connect to database: \n" + err)
  })

//Let's API Listen on PORT
api.listen(port, () => {
  console.log(`Listen on port: ${port}`)
})

//schedule email
cron.schedule(
  "0 8 * * *",
  () => {
    mailer.checkTodolist()
  },
  {
    timezone: "Asia/Bangkok",
  }
)
