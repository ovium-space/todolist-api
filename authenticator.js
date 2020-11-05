const jwt = require("jsonwebtoken")

module.exports = function (req, res, next){

    let authHeader = req.headers.authorization
    let token = authHeader && authHeader.split(" ")[1]
    //Empty token
    if(token==null) return res.sendStatus(401)

    jwt.verify(token, process.env.SECRET_KEY, async (err, user)=>{
        //invalid tokens
        if(err){
            console.log(err)
            return res.sendStatus(400)
        }
        req.body.user_ID = user.user_ID
        next()
    })
    
}

