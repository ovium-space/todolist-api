//Modules
const express = require('express')
const jwt = require('jsonwebtoken')

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
const api = express()
api.use(express.json())

//PATH
api.use("/api/v1/", authenticate, todoAPI)
api.use("/api/v1/", authenticate, checklistAPI)
api.use("/api/v1/", authenticate, userAPI)
api.use("/api/v1/", authenticate, teamAPI)
api.use("/api/v1/team", authenticate, team_todolist)

//Index
api.get("/", authenticate,(req, res)=>{
    console.log("INDEX")
    res.sendStatus(200)
})

//Login
api.get("/login", async (req, res)=>{
    let username = req.body.username
    let password = req.body.password

    let findUser = await db.user.findOne({where:{ username: username}}).catch((err)=>{
        console.log(err)
        return res.sendStatus(400)
    })

    //Check if user is exist
    if(findUser==null) res.sendStatus(404)

    let userData = findUser.dataValues
    let userID = findUser.user_ID
    let userPassword = userData.password

    //Check password
    if(userPassword == password){
        let token = jwt.sign({ username: userID}, "SECRET")
        res.json({accessToken: token})
    }else res.sendStatus(401)
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

function authenticate(req, res, next){
    let authHeader = req.headers.authorization
    let token = authHeader && authHeader.split(" ")[1]
    //Empty token
    if(token==null) return res.sendStatus(401)

    jwt.verify(token, "SECRET", async (err, user)=>{
        //invalid tokens
        if(err){
            console.log(err)
            return res.sendStatus(400)
        }
        req.body.username = user.username
        next()
    })
    
    
}