const express = require("express")
const router = express.Router()

router.use(express.json())

//Model
const { team } = require('../models')
const { user } = require("../models")

router.get("/", async (req, res) => {
    let data = await team.findAll({
        include:[{
            model: user,
            through:{attributes:[]},
            attributes:{exclude:["password"]}
        }]
    }).catch(err=>{
        console.log(err)
        return res.status(500).send("Data corrupted.")
    })
    res.status(200).send(data)
})

router.post("/add", async (req, res) => {
    let data = await team.create({
        team_ID: req.body.team_ID,
        leader_ID: req.body.leader_ID,
        name: req.body.name
    }).catch(err=>{
        console.log(err)
        return res.sendStatus(400)
    })
    data.addAllTeam(req.body.leader_ID)
    res.status(201).send(data)
})

router.patch("/update/:id", async (req,res)=>{
    let teamID = req.params.id
    //Check if id is Integer or not
    if(isNaN(teamID)) return res.status(400).send("ID should be number.")
    //Check if id is found or not
    let isFound = await team.findOne({where:{team_ID: teamID}}).catch(err=>{
        console.log(err)
        return res.sendStatus(500)
    })
    if (isFound == null) return res.status(404).send("Team not found.")
    //Update
    let data = await team.update(req.body, {where:{team_ID: teamID}}).catch(err=>{
        console.log(err)
        return res.sendStatus(500)
    })
    res.status(200).send(data)
})

router.patch("/user/add/:id", async (req, res) => {
    let teamID = req.params.id
    let userlist = req.body.userlist
    //Check if id is Integer or not
    if(isNaN(teamID)) return res.status(400).send("ID should be number.")
    //Get team data from teamID
    let teamData = await team.findOne({where:{ team_ID: teamID }}).catch(err => {
        console.log(err)
        res.sendStatus(500)
    })
    //Check if id is found or not
    if(teamData == null) return res.status(404).send("Team not found.")
    teamData.addAllTeam(userlist)
    res.status(200).send(teamData)
})

router.patch("/user/delete/:id", async (req, res) => {
    let teamID = req.params.id
    let userlist = req.body.userlist
    //Check if id is Integer or not
    if(isNaN(teamID)) return res.status(400).send("ID should be number.")
    //Get team data from teamID
    let teamData = await team.findOne({where:{ team_ID: teamID }}).catch(err => {
        console.log(err)
        res.sendStatus(500)
    })
    //Check if id is found or not
    if(teamData == null) return res.status(404).send("Team not found.")
    teamData.removeAllTeam(userlist)
    res.status(200).send(teamData)
})

router.delete("/delete/:id", async (req, res)=>{
    let teamID = req.params.id
    //Check if id is Integer or not
    if(isNaN(teamID)) return res.status(400).send("ID should be number.")
    //Get team data from teamID and delete
    let data =  await team.findOne({where: {team_ID: teamID}}).then((result) => {
        return team.destroy({where:{team_ID: teamID}}).then(() => {return result})
    })
    //Check if id is found or not
    if(data == null) return res.status(404).send("Team not found.")
    res.status(200).send(data)
})

module.exports = router