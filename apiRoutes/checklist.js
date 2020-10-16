const express = require("express")
const Checklist = express.Router()
const { checklist } = require('../models')

Checklist.use(express.json())

Checklist.get("/checklist", async (req, res)=>{
    let data = await checklist.findAll()
    res.send(data)
})

Checklist.post("/checklist/add", async (req, res)=>{
    let size = await checklist.count()
    let data = await checklist.create({
        todo_ID:req.body.todo_ID,
        name:req.body.name,
        description:req.body.description,
        state:req.body.state,
        checklist_index: size,
        expire_datetime: req.body.expire_datetime,
        due_datetime: req.body.due_datetime,
        checklist_check: req.body.checklist_check
    })
    res.send(data)
})

Checklist.patch("/checklist/update/:id", async (req, res)=>{
    let userID = req.params.id
    let data = await checklist.update(req.body, {where:{ checklist_ID: userID }})
    res.send(data)
})

Checklist.delete("/checklist/delete/:id", async (req, res)=>{
    let userID = req.params.id
    let datadelete =  await checklist.findOne({where: {checklist_ID: userID}}).then((result) => {
            return checklist.destroy({where:{checklist_ID: userID}}).then(() => {return result})
    })
    res.send(datadelete)
})

module.exports = Checklist