const express = require("express")
const router = express.Router()

router.use(express.json())

const { user } = require("../models")
const { team_checklist } = require("../models")

router.get("/", async (req, res)=>{
    let data = await team_checklist.findAll( {
        include:[{
            model: user,
            through:{
                where:{assign: 1},
                attributes:[]
            },
            attributes:{exclude:["password"]}
        }]
    }).catch((err)=>{
        console.log(err)
        return req.status(500).send("Data corrupted.")
    })
    res.status(200).send(data)
})

router.get("/:id", async (req, res)=>{
    let checklistID = req.params.id
    //Check if id is Integer or not
    if(isNaN(checklistID)) return res.status(400).send("ID should be number.")
    let data = await team_checklist.findOne({
        where:{
            checklist_ID: checklistID
        },
        include:[{
            model: user,
            through:{
                where:{
                    assign: 1
                },
                attributes:[]
            },
            attributes:{
                exclude:["password"]
            }
        }]
    }).catch((err)=>{
        console.log(err)
        return req.status(500).send("Data corrupted.")
    })
    res.status(200).send(data)
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
        return res.sendStatus(400)
    })
    //Added association with assign value upon created
    let userlist = req.body.userlist || {}
    let userlistKey = Object.keys(userlist)

    
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
    if(isError1 || isError2) return res.status(400).send("Invalid userlist.")
    res.status(201).send(data)
    
})

router.patch("/update/:id", async (req, res)=>{
    //Keep userlist from request body then delete it out of request body
    let userlist = req.body.userlist || {}
    let userlistKey = Object.keys(userlist)
    delete req.body.userlist

    //Update data
    let checklistID = req.params.id
    //Check if id is Integer or not
    if(isNaN(checklistID)) return res.status(400).send("ID should be number.")
    let updateData = await team_checklist.findOne({where:{checklist_ID: checklistID}})
    //Check if id is found or not
    let isFound = await updateData.findOne({where:{checklist_ID: checklistID}}).catch(err=>{
        console.log(err)
        return res.sendStatus(500)
    })
    if (isFound == null) return res.status(404).send("Checklist not found.")
    //Update
    let data = await team_checklist.update(req.body, {where:{checklist_ID: checklistID}}).catch((err)=>{
        console.log(err)
        res.sendStatus(500)
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
    if(isError1 || isError2) return res.status(400).send("Invalid userlist.")

    res.status(200).send(data)
})

router.delete("/delete/:id", async (req, res)=>{
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