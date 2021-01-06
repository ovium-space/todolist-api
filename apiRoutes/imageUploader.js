const express = require('express')
const multer = require('multer')
const authenticator = require('../authenticator')
const fs = require('fs')
const path = require('path')
const AWS = require("aws-sdk")

const router = express.Router()

router.use(express.json())

let { user } = require("../models")

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
})

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

            let fileType = req.file.filename.split(".")[1]
            let params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: user_ID + "." + fileType,
                Body: data
            }

            let s3Error = s3.upload(params, async (err, data)=>{
                if(err){
                    console.log(err)
                    return "error"
                }
                else {
                    //Update current image URL to user's data
                    let imageJSON = { image: data.Location }
                    let updateData = await user.update(imageJSON, {where:{user_ID: user_ID}}).catch(err => {
                        console.log(err)
                        return "error"
                    })

                    if(updateData == "error") return "error"
                }

            })

            //Remove current file out of folder since it has been uploaded to mySQL as BLOB
            let removeFile = fs.unlink('./images/' + req.file.filename, (err) => {
                if(err){
                    console.log(err)
                    return "error"
                }
            })

            //Check if any error from update and remove file process
            if(s3Error == "error" || removeFile == "error") return res.sendStatus(500)

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