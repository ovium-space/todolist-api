const express = require('express')
const multer = require('multer')
const authenticator = require('../authenticator')
const fs = require('fs')

const router = express.Router()

router.use(express.json())

let { user } = require("../models")

router.get("/uploadImage", authenticator, async (req, res)=>{
    let user_ID = req.body.tokenUserID

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './images')
        },
        filename: (req, file, cb) => {
            cb(null, user_ID + "." + file.originalname.split(".")[1])
        }
    })

    let upload = multer({storage}).single('imageFile')

    upload(req, res, (err)=>{
        if(err){
            console.log(err)
            return true
        }

        //Read image file
        let data = fs.readFile('./images/' + req.file.filename, (err, data)=>{
            if(err){
                console.log(err)
                res.sendStatus(500)
                return "error"
            }

            let imageJSON = { image: data }
            let updateData = user.update(imageJSON, {where:{user_ID: user_ID}}).catch(err => {
                console.log(err)
                return "error"
            })
            if(updateData == "error") return res.sendStatus(500)


            res.status(200).send("Upload success!")
        })
    })


})

module.exports = router