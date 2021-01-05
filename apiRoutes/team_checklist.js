const express = require("express")
const router = express.Router()
const authenticator = require('../authenticator')

router.use(express.json())

const { team_checklist } = require("../models")

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
        return "Error"
    })

    //Check if catch error then return false
    if(data == "Error") return false

    //Added association with assign value upon created
    let userlist = req.body.userlist || {}
    let userlistKey = Object.keys(userlist)

    //Seperate assigned and not assigned users from request into two arrays
    let assign_trueUser = userlistKey.filter((key)=>userlist[key] == true)
    let assign_falseUser = userlistKey.filter((key)=>userlist[key] == false)

    //If ok return false else if error return true to check
    //Set all assigned user from request
    let isError1 = await data.addUsers(assign_trueUser, {through:{assign: true}}).then(()=>{return false}).catch(err=>{
        console.log(err)
        return true
    })
    //Set all not assigned user from request
    let isError2 = await data.addUsers(assign_falseUser, {through:{assign: false}}).then(()=>{return false}).catch(err=>{
        console.log(err)
        return true
    })

    //Check if catch error then return 400
    if(isError1 || isError2) return res.status(400).send("Invalid userlist.")

    res.status(201).send(data)
})

router.patch("/update/:id", authenticator, async (req, res)=>{
    //Keep userlist from request body then delete it out of request body
    let userlist = req.body.userlist || {}
    let userlistKey = Object.keys(userlist)

    //remove userlist from request(Because there is no userlist attribute in database, this is just to update junction table)
    delete req.body.userlist

    //Get ID from parameters
    let checklistID = req.params.id

    //Check if ID is Integer or not
    if(isNaN(checklistID)) return res.status(400).send("ID should be number.")

    //Search data from given ID
    let updateData = await team_checklist.findOne({where:{checklist_ID: checklistID}})

    //If ID is not exist then return 404
    if (updateData == null) return res.status(404).send("Checklist not found.")

    //Update data given in request to database
    let data = await team_checklist.update(req.body, {where:{checklist_ID: checklistID}}).catch((err)=>{
        console.log(err)
        res.sendStatus(500)
    })

    //Seperate user assigned into two array
    let assign_trueUser = userlistKey.filter((key)=>userlist[key] == true)
    let assign_falseUser = userlistKey.filter((key)=>userlist[key] == false)

    //If ok return false else if error return true to check
    //Update all assigned user to database
    let isError1 = await updateData.addUsers(assign_trueUser, {through:{assign: true}}).then(()=>{return false}).catch(err=>{
        console.log(err)
        return true
    })

    //Update all not assigned user to database
    let isError2 = await updateData.addUsers(assign_falseUser, {through:{assign: false}}).then(()=>{return false}).catch(err=>{
        console.log(err)
        return true
    })

    //Check if catch error then return 400
    if(isError1 || isError2) return res.status(400).send("Invalid userlist.")

    res.status(200).send(data)
})

router.delete("/delete/:id", authenticator, async (req, res)=>{
    let checklistID = req.params.id

    //Check if id is Integer or not
    if(isNaN(checklistID)) return res.status(400).send("ID should be number.")

    //Get team data from checklistID and delete
    let data =  await team_checklist.findOne({where: {checklist_ID: checklistID}}).then((result) => {
        return team_checklist.destroy({where:{checklist_ID: checklistID}}).then(() => {return result})
    })

    //Check if id is found or not
    if (data == null) return res.status(404).send("Checklist not found.")

    res.status(200).send(data)
})

module.exports = router