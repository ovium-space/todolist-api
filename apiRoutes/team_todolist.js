const express = require("express")
const router = express.Router()

router.use(express.json())

//Model
const { team_todolist } = require("../models")
const { team } = require("../models")

router.get("/:id", async (req, res) => {
    let data = await team_todolist.findAll({
        where:{ todolist_ID: req.params.id},
        include:[team]
    }).catch((err)=>{
        console.log(err)
        res.sendStatus(400)
    })
    res.send(data)
})

router.post("/add", async (req, res) => {
    let size = await team_todolist.count()
    let data = await team_todolist.create({
        todolist_ID: req.body.todolist_ID,
        team_ID: req.body.team_ID,
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
    res.send(data)
})

router.patch("/update/:id", async (req, res) => {
    let todolistID = req.params.id
    let data = await team_todolist.update(req.body, {where:{todolist_ID: todolistID}}).catch((err)=>{
        console.log(err)
        res.sendStatus(400)
    })
    res.send(data)
})

router.delete("/delete/:id", async (req, res) => {
    let todolistID = req.params.id
    let data =  await team_todolist.findOne({where: {todolist_ID: todolistID}}).then((result) => {
            return team_todolist.destroy({where:{todolist_ID: todolistID}}).then(() => {return result})
    })
    res.send(data)
})

module.exports = router