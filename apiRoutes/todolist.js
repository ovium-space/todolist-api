const express = require("express")
const router = express.Router()

router.use(express.json())

//Model&Database
const { todolist } = require("../models")

router.get("/todolist", async (req, res)=>{
    let data = await todolist.findAll()
    res.send(data)
})

router.post("/todolist/add", async(req, res)=>{
    const data = await todolist.create({
        name: req.body.name,
        description: req.body.description,
        state: req.body.state,
        todolist_index: await todolist.count(),
        expire_datetime: req.body.expire_datetime,
        start_datetime: req.body.start_datetime,
        checklist: req.body.checklist
    }).catch((err)=>{
        if(err) res.send(err)
    })
    res.send(data)
})

router.patch("/todolist/update/:id", async (req, res)=>{
    let userID = req.params.id
    let data = await todolist.update(req.body, {where:{ todolist_ID: userID }})
    res.send(data)
})

router.delete("/todolist/delete/:id", async (req, res)=>{
    let userID = req.params.id
    let data = await todolist.findOne({where:{ todolist_ID: userID }}).then((result)=>{
        return todolist.destroy({where:{ todolist_ID: userID }}).then(()=>{return result})
    })
    res.send(data)
})

module.exports = router
