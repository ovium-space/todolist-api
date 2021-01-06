const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const cipher = require("../cipher")

router.use(express.json())

//Model
const { user } = require('../models')

//Login
router.post("/", async (req, res)=>{
    let username = req.body.username
    let password = req.body.password
    if(!username && !password) return res.sendStatus(400)
    let findUser = await user.findOne({where:{ username: username}}).catch((err)=>{
        console.log(err)
        return res.sendStatus(400)
    })

    //Username not exist
    if(findUser==null) return res.sendStatus(404)

    //Get user password
    let userPassword = cipher.decrypt(JSON.parse(findUser.dataValues.password))

    //Get user ID
    let userID = findUser.user_ID

    //Check password if match then sign token
    if(userPassword == password){
        let token = jwt.sign({ user_ID: userID}, process.env.SECRET_KEY)
        res.json({accessToken: token})
    }else res.status(401).send("Incorrect Password.")
})

module.exports = router