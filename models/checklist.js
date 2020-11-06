module.exports = (sequelize, DataTypes)=>{
    const checklist = sequelize.define("checklist", {
        checklist_ID:{
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        todolist_ID:{
            type: DataTypes.STRING,
            allowNull: false
        },
        name:{
            type : DataTypes.STRING,
            allowNull: false
        },
        state:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        checklist_index:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        expire_datetime:{
            type: DataTypes.DATE,
            allowNull: false
        },
        due_datetime:{
            type: DataTypes.DATE,
            allowNull: false
        },
        checklist_check:{
            type: DataTypes.BOOLEAN,
            allowNull: false
        }

    }, { freezeTableName: true, timestamps : false})

    checklist.associate = models => {
        checklist.belongsTo(models.todolist, { foreignKey: "todolist_ID"})
    }
    return checklist
}