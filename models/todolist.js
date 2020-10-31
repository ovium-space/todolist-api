module.exports = (sequelize, DataTypes) => {
    const todolist = sequelize.define('todolist', {
        todolist_ID: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        user_ID:{
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        todolist_index:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        expire_datetime:{
            type: DataTypes.DATE,
            allowNull: true
        },
        start_datetime: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, { freezeTableName:true, timestamps: false})

    todolist.associate = models => {
        todolist.hasMany(models.checklist, { foreignKey: "todolist_ID"})
        todolist.belongsTo(models.user, {foreignKey: "user_ID"})
    }
    return todolist
}