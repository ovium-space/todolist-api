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
        user.hasMany(models.todolist, {foreignKey: "user_ID"})
        user.belongsToMany(models.team, {as:"allTeam", through:'team_user', foreignKey:"user_ID"})
        user.hasMany(models.team, {foreignKey:"leader_ID"})
        user.belongsToMany(models.team_checklist, {through:'Tchecklist_user', foreignKey:"user_ID"})
    }
    return user
}