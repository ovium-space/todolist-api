const express = require("express")
const router = express.Router()

router.use(express.json())

//Model
const { user } = require('../models')

router.get("/team", async (req, res) =>{
    let data = await team.findAll({include: [user]}).catch((err)=>{res.send(err)})
    res.send(data)
})

// router.post("/team/add", async (req, res)=>{
//     let data = await team.create({
//         team_ID: req.team
//     }).catch((err)=>{res.send(err)})
// })