const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const cipher = require("../cipher")

router.use(express.json())

//Model
const { user } = require('../models')

//Login
router.post("/", async (req, res)=>{
    //Define username and password
    let username = req.body.username
    let password = req.body.password

    //If username and password is null then return 400
    if(!username && !password) return res.status(400).send("Please fill username and password correctly.")

    //Search for username in database
    let findUser = await user.findOne({where:{ username: username}}).catch((err)=>{
        console.log(err)
    })

    //If username not exist then return 404
    if(findUser==null) {
        return res.status(404).send("User not found.")
    }

    //Get user password
    let userPassword = cipher.decrypt(JSON.parse(findUser.dataValues.password))

    //Get user ID
    let userID = findUser.user_ID

    //Check password if match then sign token
    if(userPassword == password){
        let token = jwt.sign({ user_ID: userID}, process.env.SECRET_KEY)
        res.status(200).json({accessToken: token})
    }else res.status(401).send("Incorrect Password.")
})

module.exports = router