module.exports = (sequelize, DataTypes) =>{
    const team_user = sequelize.define('team_user', {}, {freezeTableName: true})
    return team_user
}