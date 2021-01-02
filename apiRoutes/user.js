const express = require("express")
const router = express.Router()
const authenticator = require('../authenticator')
const cipher = require("../cipher")

router.use(express.json())

//Model
const { user } = require('../models')
const { todolist } = require('../models')
const { checklist } = require("../models")
const { team } = require('../models')

router.get("/:id", authenticator, async (req, res)=>{
    let data = await user.findOne({
        where:{ user_ID: req.params.id},
        attributes: {exclude: ["password"]},
        include:[{
            model: todolist,
            include:[checklist]
        }, {
            model: team,
            as: "with"
        }]
    }).catch((err)=>{
        console.log(err)
        res.sendStatus(500)
        return "Error"
    })

    if(data == "Error") return false

    res.send(data)
})

router.post("/add", async (req, res)=>{
    //Hashing password
    let hashedPassword = cipher.encrypt(req.body.password)

    let data = await user.create({
        user_ID: req.body.user_ID,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword
    }).catch((err)=>{
        if(err) res.send(err)
    })

    res.send(data)
})

router.patch("/update/:id", authenticator, async (req, res)=>{
    let userID = req.params.id
    let data = await user.update(req.body, {where:{ user_ID: userID }}).catch((err)=>res.send(err))
    res.send(data)
})

router.delete("/delete/:id", authenticator, async (req, res)=>{
    let userID = req.params.id
    let data =  await user.findOne({where: {user_ID: userID}}).then((result) => {
        return user.destroy({where:{user_ID: userID}}).then(() => {return result})
    })
    res.send(data)
})

module.exports = router