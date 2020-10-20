module.exports = (sequelize, DataTypes) => {
    const Todolist = sequelize.define('todolist', {
        todolist_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
            type: DataTypes.DATE
        },
        start_datetime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        checklist:{
            type: DataTypes.JSON
        }
    }, { freezeTableName:true, timestamps: false})
    return Todolist
}