const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const App = sequelize.define('App', {
    key: DataTypes.STRING,
    name: DataTypes.STRING
  }, {});

  App.associate = (models) => {
    App.belongsTo(models.Role, {foreignKey: 'role_id'});
  };

  App.prototype.generateUUID = function generateUUID(){
    return uuid();
  }
  return App;
};