const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

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
    })

    console.log(findUser)

    //Username not exist
    if(findUser==null) {
        return res.status(404).send("User not found.")
    }

    let userData = findUser.dataValues
    let userID = findUser.user_ID
    let userPassword = userData.password

    //Check password
    if(userPassword == password){
        let token = jwt.sign({ user_ID: userID}, process.env.SECRET_KEY)
        res.status(200).json({accessToken: token})
    }else res.status(401).send("Incorrect Password.")
})

module.exports = router