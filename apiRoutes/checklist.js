const express = require("express")
const router = express.Router()

router.use(express.json())

//Model
const { checklist } = require('../models')
const { todolist } = require("../models")

router.get("/", async (req, res)=>{
    let data = await checklist.findAll({ include:[todolist] }).catch((err)=> {
        console.log(err)
        return res.status(500).send("Data corrupted.")
    })
    res.status(200).send(data)
})

router.post("/add", async (req, res)=>{
    let size = await checklist.count()
    let data = await checklist.create({
        checklist_ID: req.body.checklist_ID,
        todolist_ID: req.body.todolist_ID,
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
    res.status(201).send(data)
})

router.patch("/update/:id", async (req, res)=>{
    let checklistID = req.params.id
    //Check if id is Integer or not
    if (isNaN(checklistID)) return res.status(400).send("ID should be number.")
    //Check if id is found or not
    let isFound = await checklist.findOne({where:{checklist_ID: checklistID}}).catch(err=>{
        console.log(err)
        return res.sendStatus(500)
    })
    if (isFound == null) return res.status(404).send("Checklist not found.")
    //Update
    let data = await checklist.update(req.body, {where:{ checklist_ID: checklistID }}).catch(err=>{
        console.log(err)
        return res.status(500)
    })
    res.status(200).send(data)
})

router.delete("/delete/:id", async (req, res)=>{
    let checklistID = req.params.id
    //Check if id is Integer or not
    if (isNaN(checklistID)) return res.status(400).send("ID should be number.")
    //Get team data from checklistID and delete
    let data =  await checklist.findOne({where: {checklist_ID: checklistID}}).then((result) => {
            return checklist.destroy({where:{checklist_ID: checklistID}}).then(() => {return result})
    })
    //Check if id is found or not
    if(data == null) return res.status(404).send("Checklist not found.")
    res.status(200).send(data)
})

module.exports = router