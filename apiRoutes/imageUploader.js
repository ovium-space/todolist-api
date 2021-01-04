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

    //Declare multer function
    let upload = multer({storage}).single('imageFile')

    //Image uploading function
    upload(req, res, (err)=>{
        //If any error
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

            //Update current image upload to user's data
            let imageJSON = { image: data }
            let updateData = user.update(imageJSON, {where:{user_ID: user_ID}}).catch(err => {
                console.log(err)
                return "error"
            })

            //Remove current file out of folder since it has been uploaded to mySQL as BLOB
            let removeFile = fs.unlink('./images/' + req.file.filename, (err) => {
                if(err){
                    console.log(err)
                    return "error"
                }
            })

            //Check if any error from update and remove file process
            if(updateData == "error" || removeFile == "error") return res.sendStatus(500)

            //OK if nothing wrong
            res.status(200).send("Upload success!")
        }) || false

        //If multer upload function is error
        if(data){
            console.log(err)
            res.status(500)
        }
    })


})

module.exports = router