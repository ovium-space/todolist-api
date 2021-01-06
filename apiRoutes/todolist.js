const express = require("express")
const router = express.Router()
const authenticator = require("../authenticator")
const { v4: uuidv4 } = require("uuid")

router.use(express.json())

//Model
const { todolist } = require("../models")
const { checklist } = require("../models")

router.get("/:id", authenticator, async (req, res) => {
  let data = await todolist
    .findAll({
      where: { todolist_ID: req.params.id },
      include: [checklist],
    })
    .catch((err) => res.send(err))
  res.send(data)
})

router.post("/add", async (req, res) => {
  let size = await todolist.count()
  let data = await todolist
    .create({
      todolist_ID: uuidv4(),
      user_ID: req.body.user_ID,
      name: req.body.name,
      description: req.body.description,
      state: req.body.state,
      todolist_index: size,
      expire_datetime: req.body.expire_datetime,
      start_datetime: req.body.start_datetime,
    })
    .catch((err) => {
      if (err) res.send(err)
    })
  res.send(data)
})

router.patch("/update/:id", authenticator, async (req, res) => {
  let todolistID = req.params.id
  let data = await todolist.update(req.body, { where: { todolist_ID: todolistID } })
  res.send(data)
})

router.delete("/delete/:id", authenticator, async (req, res) => {
  let todolistID = req.params.id
  let data = await todolist.findOne({ where: { todolist_ID: todolistID } }).then((result) => {
    return todolist.destroy({ where: { todolist_ID: todolistID } }).then(() => {
      return result
    })
  })
  res.send(data)
})

module.exports = router
