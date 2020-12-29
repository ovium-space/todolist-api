const express = require("express")
const router = express.Router()

router.use(express.json())

//Model
const { user } = require('../models')
const { todolist } = require('../models')
const { team } = require('../models')

router.get("/", async (req, res)=>{
    //Search all team with all users in team
    let data = await user.findAll({
        include:[{
            model: team,
            as: "with",
            through:{attributes:[]}
        }, todolist]
    }).catch((err)=> {
        console.log(err)
        return res.status(500).send("Data corrupted.")
    })

    res.status(200).send(data)
})

router.post("/add", async (req, res)=>{
    //Create data from request
    let data = await user.create({
        user_ID: req.body.user_ID,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }).catch((err)=>{
        console.log(err)
        return res.sendStatus(400)
    })

    res.status(201).send(data)
})

router.patch("/update/:id", async (req, res)=>{
    let userID = req.params.id
    //Check if id is Integer or not
    if(isNaN(userID)) return res.status(400).send("ID should be number.")

    //Search data from given ID
    let isFound = await user.findOne({where:{user_ID: userID}}).catch(err=>{
        console.log(err)
        return res.sendStatus(500)
    })

    //If don't exist then return 404
    if (isFound == null) return res.status(404).send("User not found.")

    //Update data to database
    let data = await user.update(req.body, {where:{ user_ID: userID }}).catch((err)=> {
        console.log(err)
        res.sendStatus(500)
    })

    res.status(200).send(data)
})

router.delete("/delete/:id", async (req, res)=>{
    let userID = req.params.id

    //Check if id is Integer or not
    if(isNaN(userID)) return res.status(400).send("ID should be number.")

    //Get team data from userID and delete
    let data =  await user.findOne({where: {user_ID: userID}}).then((result) => {
        return user.destroy({where:{user_ID: userID}}).then(() => {return result})
    })

    //Check if id is found or not
    if (data == null) return res.status(404).send("User not found.")

    res.send(data)
})

module.exports = router