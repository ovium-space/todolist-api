const express = require("express")
const router = express.Router()

router.use(express.json())

const { team_todolist } = require("../models")
const { team_checklist } = require("../models")
const { user } = require("../models")
const { team } = require("../models")

router.get("/checklist", async (req, res)=>{
    let data = await team_checklist.findAll( {include:[team_todolist]}).catch((err)=>{
        console.log(err)
        req.sendStatus(400)
    })
    res.send(data)
})

router.get("/checklist/:id", async (req, res)=>{
    let checklsitID = req.params.id
    let data = await team_checklist.findAll( {where:{checklist_ID: checklsitID}}).catch((err)=>{
        console.log(err)
        req.sendStatus(400)
    })
    res.send(data)
})

router.post("/checklist/add", async (req, res)=>{
    let size = await team_checklist.count()
    let data = await team_checklist.create({
        checklist_ID: req.body.checklist_ID,
        todolist_ID: req.body.todolist_ID,
        userlist: req.body.userlist,
        name: req.body.name,
        state: req.body.state,
        checklist_index: size,
        expire_datetime: req.body.expire_datetime,
        due_datetime: req.body.due_datetime,
        checklist_check: req.body.checklist_check
    }).catch((err)=>{
        console.log(err)
        res.sendStatus(400)
    })
    let userlist = req.body.userlist
    let allUserInTeam = Object.keys(req.body.userlist)
    allUserInTeam.forEach( (userKey) => {
        data.addUser(userKey, {through:{assign: userlist[userKey]}})
    })



    res.send(data)
})

router.patch("/checklist/update/:id", async (req, res)=>{
    let userlist = req.body.userlist
    let allUserInTeam = Object.keys(req.body.userlist)
    delete req.body.userlist
    let checklistID = req.params.id
    let updateData = await team_checklist.findOne({where:{checklist_ID: checklistID}})
    let data = await team_checklist.update(req.body, {where:{checklist_ID: checklistID}}).catch((err)=>{
        console.log(err)
        res.sendStatus(400)
    })
    allUserInTeam.forEach( (userKey) => {
        updateData.addUser(userKey, {through:{assign: userlist[userKey]}})
    })
    res.send(data)
})

router.delete("/checklist/delete/:id", async (req, res)=>{
    let checklistID = req.params.id
    let data =  await team_checklist.findOne({where: {checklist_ID: checklistID}}).then((result) => {
        return team_checklist.destroy({where:{checklist_ID: checklistID}}).then(() => {return result})
    })
    res.send(data)
})

module.exports = router