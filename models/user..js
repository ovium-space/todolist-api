module.exports = (sequelize, Datatype) => {
    let model = sequelize.define("user", {
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
        auth:{
            type: Datatype.JSON,
            allowNull: false
        },
        todolist_ID:{
            type: Datatype.JSON
        }
    }, { freezeTableName:true, timestamps:false})
    return model
}