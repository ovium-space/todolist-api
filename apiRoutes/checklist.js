const express = require("express")
const router = express.Router()

router.use(express.json())

//Model
const { checklist } = require('../models')
const { todolist } = require("../models")

router.get("/checklist", async (req, res)=>{
    let data = await checklist.findAll({ include:[todolist] }).catch((err)=>res.send(err))
    res.send(data)
})

router.post("/checklist/add", async (req, res)=>{
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
        if(err) res.send(err)
    })
    res.send(data)
})

router.patch("/checklist/update/:id", async (req, res)=>{
    let checklistID = req.params.id
    let data = await checklist.update(req.body, {where:{ checklist_ID: checklistID }})
    res.send(data)
})

router.delete("/checklist/delete/:id", async (req, res)=>{
    let checklistID = req.params.id
    let data =  await checklist.findOne({where: {checklist_ID: checklistID}}).then((result) => {
            return checklist.destroy({where:{checklist_ID: checklistID}}).then(() => {return result})
    })
    res.send(data)
})

module.exports = router