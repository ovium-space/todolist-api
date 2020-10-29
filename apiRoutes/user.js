const express = require("express")
const User = express.Router()

User.use(express.json())

//Model
const { user } = require('../models')
const { todolist } = require('../models')

User.get("/user", async (req, res)=>{
    let data = await user.findAll({ include:[todolist] }).catch((err)=>res.send(err))
    res.send(data)
})

User.post("/user/add", async (req, res)=>{
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

User.patch("/user/update/:id", async (req, res)=>{
    let userID = req.params.id
    let data = await user.update(req.body, {where:{ user_ID: userID }})
    res.send(data)
})

User.delete("/user/delete/:id", async (req, res)=>{
    let userID = req.params.id
    let datadelete =  await user.findOne({where: {user_ID: userID}}).then((result) => {
        return user.destroy({where:{user_ID: userID}}).then(() => {return result})
    })
    res.send(datadelete)
})

module.exports = User