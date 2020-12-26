const express = require("express")
const router = express.Router()

router.use(express.json())

//Model
const { team } = require('../models')
const { user } = require("../models")

router.get("/:id", async (req, res) => {
    let data = await team.findAll({
        where:{ team_ID: req.params.id},
        include:[{
            model: user,
            through: { attributes:[] }
        }]
    }).catch(err=>{
        console.log(err)
        res.sendStatus(400)
    })
    res.send(data)
})

router.post("/add", async (req, res) => {
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

router.patch("/update/:id", async (req,res)=>{
    let teamID = req.params.id
    let data = await team.update(req.body, {where:{team_ID: teamID}}).catch(err=>{
        console.log(err)
        res.sendStatus(400)
    })
    res.send(data)
})

router.patch("/user/add/:id", async (req, res) => {
    let teamID = req.params.id
    let userlist = req.body.userlist

    //Get team data from teamID
    let teamData = await team.findOne({where:{ team_ID: teamID }}).catch(err => {
        console.log(err)
        res.sendStatus(404).send("Team not found.")
    })

    teamData.addUsers(userlist)
    res.sendStatus(200)
})

router.patch("/user/delete/:id", async (req, res) => {
    let teamID = req.params.id
    let userlist = req.body.userlist

    //Get team data from teamID
    let teamData = await team.findOne({where:{ team_ID: teamID }}).catch(err => {
        console.log(err)
        res.sendStatus(404).send("Team not found.")
    })

    teamData.removeUsers(userlist)
    res.sendStatus(200)
})

router.delete("/delete/:id", async (req, res)=>{
    let teamID = req.params.id
    let data =  await team.findOne({where: {team_ID: teamID}}).then((result) => {
        return team.destroy({where:{team_ID: teamID}}).then(() => {return result})
    })
    res.send(data)
})

module.exports = router