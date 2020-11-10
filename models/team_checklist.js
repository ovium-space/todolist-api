module.exports = (sequelize, DataTypes)=>{
    const team_checklist = sequelize.define("team_checklist", {
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
    }, {freezeTableName:true, timestamps:false})
    team_checklist.associate = models =>{
        team_checklist.belongsTo(models.team_todolist, {foreignKey:"todolist_ID"})
        team_checklist.belongsToMany(models.user, {through:'Tchecklist_user', foreignKey:"checklist_ID"})
    }

    return team_checklist
}

