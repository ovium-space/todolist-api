module.exports = (sequelize, DataTypes) =>{
    const team = sequelize.define('team', {
        team_ID:{
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        leader_ID:{
            type: DataTypes.STRING,
            allowNull: false
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {freezeTableName: true})
    team.associate = models => {
        team.belongsToMany(models.user, {through:'team_user'})
        team.belongsTo(models.user, {foreignKey:"leader_ID"})
    }
    return team
}