const express = require("express")
const router = express.Router()

router.use(express.json())

//Model
const { user } = require('../models')
const { todolist } = require('../models')
const { team } = require('../models')

router.get("/:id", async (req, res)=>{
    let data = await user.findAll({
        where:{ user_ID: req.params.id},
        include:[todolist, team]
    }).catch((err)=>res.send(err))
    res.send(data)
})

router.post("/add", async (req, res)=>{
    let data = await user.create({
        user_ID: req.body.user_ID,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }).catch((err)=>{
        if(err) res.send(err)
    })
    res.send(data)
})

router.patch("/update/:id", async (req, res)=>{
    let userID = req.params.id
    let data = await user.update(req.body, {where:{ user_ID: userID }}).catch((err)=>res.send(err))
    res.send(data)
})

router.delete("/delete/:id", async (req, res)=>{
    let userID = req.params.id
    let data =  await user.findOne({where: {user_ID: userID}}).then((result) => {
        return user.destroy({where:{user_ID: userID}}).then(() => {return result})
    })
    res.send(data)
})

module.exports = router