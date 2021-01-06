module.exports = (sequelize, DataTypes) => {
    const team_todolist = sequelize.define("team_todolist", {
        todolist_ID: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        team_ID:{
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
    },{freezeTableName: true, timestamps: false})

    team_todolist.associate = models => {
        team_todolist.belongsTo(models.team, {foreignKey:"team_ID"})
        team_todolist.hasMany(models.team_checklist, {foreignKey:"todolist_ID"})
    }

    return team_todolist
}