const jwt = require("jsonwebtoken")

//Model
const { user } = require("./models")
const { team } = require("./models")

module.exports = async function (req, res, next){
    let authHeader = req.headers.authorization
    let token = authHeader && authHeader.split(" ")[1]
    let path = req.baseUrl

    //Empty token
    if(token==null) return res.sendStatus(403)

    //Verify tokens
    jwt.verify(token, process.env.SECRET_KEY, async (err, userToken)=>{
        //invalid tokens
        if(err){
            console.log(err)
            return res.sendStatus(400)
        }

        //Keep user_ID in req body
        req.body.tokenUserID = userToken.user_ID

        //If GET user and user_ID not match token then return 401
        if(path == "/api/v1/user"){
            if(req.body.tokenUserID !== req.params.id){
                return res.sendStatus(401)
            }
        }

        //If GET team and user is not in the team then return 401
        if(path == "/api/v1/team"){
            //Get userValues
            let userData = await user.findOne({where:{user_ID: req.body.tokenUserID},
                include:{
                    model: team,
                    as: "with"
                }}).catch(err => {
                console.log(err)
                res.sendStatus(500)
                return "Error"
            })

            //Check if Error catch
            if(userData == "Error") return false

            //Get all related team from user
            let teamKey = userData["with"].map(teamData => {return teamData.team_ID}).filter(key => {return key == req.params.id})

            //If there is no team related then return 401
            if(teamKey.length == 0) return res.sendStatus(401)
        }
    })


    //Process to the requested path
    next()

}