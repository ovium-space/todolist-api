module.exports = (sequelize, Datatype) => {
    const user = sequelize.define("user", {
        user_ID:{
            type: Datatype.STRING,
            primaryKey: true,
            allowNull: false
        },
        firstname:{
            type: Datatype.STRING,
            allowNull: false
        },
        lastname:{
            type: Datatype.STRING,
            allowNull: false
        },
        email:{
            type: Datatype.STRING,
            allowNull: false
        },
        username:{
            type: Datatype.STRING,
            allowNull: false
        },
        password:{
            type: Datatype.STRING,
            allowNull: false
        }

    }, { freezeTableName:true, timestamps:false})

    user.associate = models => {
        user.belongsToMany(models.team, {through:'team_user', as:"User"})
        user.hasMany(models.todolist, {foreignKey: "user_ID"})
    }
    return user
}