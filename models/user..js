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
        },username:{
            type: Datatype.STRING,
            allowNull: false
        },password:{
            type: Datatype.STRING,
            allowNull: false
        }

    }, { freezeTableName:true, timestamps:false})
    return model
}