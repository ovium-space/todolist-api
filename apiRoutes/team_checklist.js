const express = require("express")
const router = express.Router()
const authenticator = require('../authenticator')

router.use(express.json())

const { team_todolist } = require("../models")
const { team_checklist } = require("../models")

router.get("/:id", authenticator, async (req, res)=>{
    let data = await team_checklist.findAll( {
        where:{ checklist_ID: req.params.id},
        include:[team_todolist]
    }).catch((err)=>{
        console.log(err)
        req.sendStatus(400)
    })
    res.send(data)
})

router.post("/add", async (req, res)=>{
    //Create data
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

    //Added association with assign value upon created
    let userlist = req.body.userlist
    let userlistKey = Object.keys(userlist)

    //If userlist is empty
    if(!userlist) return res.status(400).send("Empty userlist")
    
    let assign_trueUser = userlistKey.filter((key)=>userlist[key] == true)
    let assign_falseUser = userlistKey.filter((key)=>userlist[key] == false)

    //If ok return false else if error return true to check
    let isError1 = await data.addUsers(assign_trueUser, {through:{assign: true}}).then(()=>{return false}).catch(err=>{
        console.log(err)
        return true
    })
    let isError2 = await data.addUsers(assign_falseUser, {through:{assign: false}}).then(()=>{return false}).catch(err=>{
        console.log(err)
        return true
    })

    //Check if catch error then return status 200 instead
    if(isError1 || isError2) return res.status(400).send("Invalid userlist")
    res.send(data)
    
})

router.patch("/update/:id", authenticator, async (req, res)=>{
    //Keep userlist from request body then delete it out of request body
    let userlist = req.body.userlist
    let userlistKey = Object.keys(userlist)

    //If userlist empty
    if(!userlist) return res.status(400).send("Empty userlist")

    delete req.body.userlist

    //Update data
    let checklistID = req.params.id
    let updateData = await team_checklist.findOne({where:{checklist_ID: checklistID}})
    let data = await team_checklist.update(req.body, {where:{checklist_ID: checklistID}}).catch((err)=>{
        console.log(err)
        res.sendStatus(400)
    })

    //find which checklist that has been updated
    let assign_trueUser = userlistKey.filter((key)=>userlist[key] == true)
    let assign_falseUser = userlistKey.filter((key)=>userlist[key] == false)

    //If ok return false else if error return true to check
    let isError1 = await updateData.addUsers(assign_trueUser, {through:{assign: true}}).then(()=>{return false}).catch(err=>{
        console.log(err)
        return true
    })
    let isError2 = await updateData.addUsers(assign_falseUser, {through:{assign: false}}).then(()=>{return false}).catch(err=>{
        console.log(err)
        return true
    })

    //Check if catch error then return status 200 instead
    if(isError1 || isError2) return res.status(400).send("Invalid userlist")

    res.send(data)
})

router.delete("/delete/:id", authenticator, async (req, res)=>{
    let checklistID = req.params.id
    let data =  await team_checklist.findOne({where: {checklist_ID: checklistID}}).then((result) => {
        return team_checklist.destroy({where:{checklist_ID: checklistID}}).then(() => {return result})
    })
    res.send(data)
})

module.exports = router