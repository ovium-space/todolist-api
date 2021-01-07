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
            type: Datatype.JSON,
            allowNull: false
        },
        image:{
            type: Datatype.STRING,
            allowNull: true
        }

    }, { freezeTableName:true, timestamps:false, tableName:"user"})

    user.associate = models => {
        user.hasMany(models.todolist, {foreignKey: "user_ID"})
        user.belongsToMany(models.team, {through:'team_user', foreignKey:"user_ID", as:"with"})
        user.hasMany(models.team, {foreignKey:"leader_ID"})
        user.belongsToMany(models.team_checklist, {through:'Tchecklist_user', foreignKey:"user_ID"})
    }
    return user
}
