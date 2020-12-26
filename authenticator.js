const jwt = require("jsonwebtoken")

//Model
const { user } = require("./models")
const { todolist } = require("./models")

module.exports = async function (req, res, next){
    let authHeader = req.headers.authorization
    let token = authHeader && authHeader.split(" ")[1]
    let path = req.originalUrl

    //Empty token
    if(token==null) return res.sendStatus(403)

    //Verify tokens
    jwt.verify(token, process.env.SECRET_KEY, async (err, user)=>{
        //invalid tokens
        if(err){
            console.log(err)
            return res.sendStatus(400)
        }
        req.body.tokenUserID = user.user_ID
    })

    //If route is todolist
    if(path === "/api/v1/todolist"){
        if(req.body.tokenUserID !== req.body.user_ID){
            return res.sendStatus(401)
        }
    }

    //Process to the requested path
    next()
    
}

