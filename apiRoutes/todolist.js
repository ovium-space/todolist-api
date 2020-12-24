const express = require("express")
const router = express.Router()

router.use(express.json())

//Model
const { todolist } = require("../models")
const { checklist } = require("../models")

router.get("/", async (req, res)=>{
    let data = await todolist.findAll({ include:[checklist] }).catch((err)=> {
        console.log(err)
        return res.status(500).send("Data corrupted.")
    })
    res.status(200).send(data)
})

router.post("/add", async(req, res)=>{
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
        console.log(err)
        res.sendStatus(400)
    })
    res.status(201).send(data)
})

router.patch("/update/:id", async (req, res)=>{
    let todolistID = req.params.id
    //Check if id is Integer or not
    if(isNaN(todolistID)) return res.status(400).send("ID should be number.")
    //Check if id is found or not
    let isFound = await todolistID.findOne({where:{todolist_ID: todolistID}}).catch(err=>{
        console.log(err)
        return res.sendStatus(500)
    })
    if (isFound == null) return res.status(404).send("Todolist not found.")
    //Update
    let data = await todolist.update(req.body, {where:{ todolist_ID: todolistID }}).catch(err=>{
        console.log(err)
        res.sendStatus(500)
    })

    res.status(200).send(data)
})

router.delete("/delete/:id", async (req, res)=>{
    let todolistID = req.params.id
    //Check if id is Integer or not
    if(isNaN(todolistID)) return res.status(400).send("ID should be number.")
    //Get team data from todolistID and delete
    let data = await todolist.findOne({where:{ todolist_ID: todolistID }}).then((result)=>{
        return todolist.destroy({where:{ todolist_ID: todolistID }}).then(()=>{return result})
    })
    //Check if id is found or not
    if(data == null) return res.status(404).send("Todolist not found.")

    res.status(200).send(data)
})

module.exports = router
