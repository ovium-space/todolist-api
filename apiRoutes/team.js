const express = require("express")
const router = express.Router()
const authenticator = require('../authenticator')

router.use(express.json())

//Model
const { team } = require('../models')
const { team_todolist } = require("../models")
const { team_checklist } = require("../models")

router.get("/:id", authenticator, async (req, res) => {
    let data = await team.findOne({
        where:{ team_ID: req.params.id },
        include:[{
            model: team_todolist,
            include:[{
                model: team_checklist
            }]
        }]
    }).catch(err=>{
        console.log(err)
        return res.status(500).send("Data corrupted.")
    })

    res.status(200).send(data)
})

router.post("/add", authenticator, async (req, res) => {
    //Create data from request
    let data = await team.create({
        team_ID: req.body.team_ID,
        leader_ID: req.body.leader_ID,
        name: req.body.name
    }).catch(err=>{
        console.log(err)
        return res.sendStatus(400)
    })

    //Add leader to his own team
    data.addUser(req.body.leader_ID)
    res.status(201).send(data)
})

router.patch("/update/:id", authenticator, async (req,res)=>{
    let teamID = req.params.id

    //Check if id is Integer or not
    if(isNaN(teamID)) return res.status(400).send("ID should be number.")

    //Search for team by teamID
    let isFound = await team.findOne({where:{team_ID: teamID}}).catch(err=>{
        console.log(err)
        return res.sendStatus(500)
    })

    //If team not found then return 404
    if (isFound == null) return res.status(404).send("Team not found.")

    //If team found then update data
    let data = await team.update(req.body, {where:{team_ID: teamID}}).catch(err=>{
        console.log(err)
        return res.sendStatus(500)
    })

    res.status(200).send(data)
})

router.patch("/user/add/:id", authenticator, async (req, res) => {
    let teamID = req.params.id
    let userlist = req.body.userlist

    //Check if id is Integer or not
    if(isNaN(teamID)) return res.status(400).send("ID should be number.")

    //Get team data from teamID
    let teamData = await team.findOne({where:{ team_ID: teamID }}).catch(err => {
        console.log(err)
        return res.sendStatus(500)
    })

    //Check if id is found or not
    if(teamData == null) return res.status(404).send("Team not found.")

    //Add user to team
    let added = await teamData.addWith(userlist).catch(err => {
        console.log(err)
        res.status(400).send("There is error adding user into team, maybe there is some user that already in this team.")
        return false
    })
    res.status(200).send(teamData)
})

router.patch("/user/delete/:id", authenticator, async (req, res) => {
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

    //Remove user from team
    teamData.removeWith(userlist)

    res.status(200).send(teamData)
})

router.delete("/delete/:id", authenticator, async (req, res)=>{
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