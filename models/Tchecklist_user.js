module.exports = (sequelize, DataTypes) => {
  const Tchecklist_user = sequelize.define(
    "Tchecklist_user",
    {
      assign: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    { freezeTableName: true, timestamps: true }
  )

  return Tchecklist_user
}

