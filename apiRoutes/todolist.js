const express = require("express")
const router = express.Router()

router.use(express.json())

//Model
const { todolist } = require("../models")
const { checklist } = require("../models")

router.get("/todolist", async (req, res)=>{
    let data = await todolist.findAll({ include:[checklist] }).catch((err)=>res.send(err))
    res.send(data)
})

router.post("/todolist/add", async(req, res)=>{
    let size = await todolist.count()
    let data = await todolist.create({
        todolist_ID: req.body.todolist_ID,
        user_ID: req.body.user_ID,
        name: req.body.name,
        description: req.body.description,
        state: req.body.state,
        todolist_index: size,
        expire_datetime: req.body.expire_datetime,
        start_datetime: req.body.start_datetime        
    }).catch((err)=>{
        if(err) res.send(err)
    })
    res.send(data)
})

router.patch("/todolist/update/:id", async (req, res)=>{
    let todolistID = req.params.id
    let data = await todolist.update(req.body, {where:{ todolist_ID: todolistID }})
    res.send(data)
})

router.delete("/todolist/delete/:id", async (req, res)=>{
    let todolistID = req.params.id
    let data = await todolist.findOne({where:{ todolist_ID: todolistID }}).then((result)=>{
        return todolist.destroy({where:{ todolist_ID: todolistID }}).then(()=>{return result})
    })
    res.send(data)
})

module.exports = router
