const express = require("express")
const router = express.Router()

router.use(express.json())

//Model
const { team } = require('../models')
const { team_user } = require("../models")
const { user } = require("../models")

router.get("/team", async (req, res) => {
    let data = await team.findAll().catch(err=>{
        console.log(err)
        res.sendStatus(400)
    })
    res.send(data)
})

router.post("/team/add", async (req, res) => {
    let data = await team.create({
        team_ID: req.body.team_ID,
        leader_ID: req.body.leader_ID,
        name: req.body.name
    }).catch(err=>{
        console.log(err)
        res.sendStatus(400)
    })
    data.addUser(req.body.leader_ID)
    res.send(data)
})

module.exports = router