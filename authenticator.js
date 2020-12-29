const jwt = require("jsonwebtoken")

//Model
const { user } = require("./models")
const { todolist } = require("./models")

module.exports = async function (req, res, next){
    let authHeader = req.headers.authorization
    let token = authHeader && authHeader.split(" ")[1]
    let path = req.baseUrl

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

    let pathList = [
        "/api/v1/todolist", "/api/v1/todolist/update", "/api/v1/todolist/delete",
        "/api/v1/team", "/api/v1/team/update", "/api/v1/team/delete",
        "/api/v1/checklist", "/api/v1/checklist/update", "/api/v1/checklist/delete",
        "/api/v1/team/todolist", "/api/v1/team/todolist/update", "/api/v1/team/todolist/delete",
        "/api/v1/team/checklist", "/api/v1/team/checklist/update", "/api/v1/team/checklist/delete",
        "/api/v1/user", "/api/v1/user/update", "/api/v1/user/delete"
        ]

    //If GET data and user_ID not match token received then return 401
    if(pathList.includes(path)){
        if(req.body.tokenUserID !== req.params.id){
            return res.sendStatus(401)
        }
    }

    //Process to the requested path
    next()
    
}

