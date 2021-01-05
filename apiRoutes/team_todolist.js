const express = require("express")
const router = express.Router()
const authenticator = require('../authenticator')

router.use(express.json())

//Model
const { team_todolist } = require("../models")

router.post("/add", async (req, res) => {
    //Count data for index
    let size = await team_todolist.count()

    //Create data given in request
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
        return res.sendStatus(400)
    })

    res.status(201).send(data)
})

router.patch("/update/:id", authenticator, async (req, res) => {
    let todolistID = req.params.id

    //Check if id is Integer or not
    if(isNaN(todolistID)) return res.status(400).send("ID should be number.")

    //Search for data from given ID
    let isFound = await team_todolist.findOne({where:{todolist_ID: todolistID}}).catch(err=>{
        console.log(err)
        return res.sendStatus(500)
    })

    //If data is not exist then return 404
    if (isFound == null) return res.status(404).send("Todolist not found.")

    //Update data to database
    let data = await team_todolist.update(req.body, {where:{todolist_ID: todolistID}}).catch((err)=>{
        console.log(err)
        res.sendStatus(500)
    })


    res.status(200).send(data)
})

router.delete("/delete/:id", authenticator, async (req, res) => {
    let todolistID = req.params.id

    //Check if id is Integer or not
    if(isNaN(todolistID)) return res.status(400).send("ID should be number.")

    //Get team data from todolistID and delete
    let data =  await team_todolist.findOne({where: {todolist_ID: todolistID}}).then((result) => {
            return team_todolist.destroy({where:{todolist_ID: todolistID}}).then(() => {return result})
    })

    //Check if id is found or not
    if(data == null) return res.status(404).send("Todolist not found.")

    res.status(200).send(data)
})

module.exports = router