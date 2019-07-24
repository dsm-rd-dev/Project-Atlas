const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
      user_id: DataTypes.STRING,
      api_token: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING
  });

User.associate = (models) => {
  User.belongsTo(models.Role, {foreignKey: 'role_id'});
}

User.prototype.generateHash = function generateHash(password){
  return bcrypt.hash(password, bcrypt.genSaltSync(8));
}

User.prototype.validPassword = function validPassword(password) {
  return bcrypt.compare(password, this.password);
}
return User;
};