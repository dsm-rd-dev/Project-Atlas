const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
      user_id: DataTypes.STRING,
      api_token: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING
  });

user.prototype.generateHash = function generateHash() {
  return bcrypt.hash(password, bcrypt.genSaltSync(8));
}

user.prototype.validPassword = function validPassword(password) {
  return bcrypt.compare(password, this.password);
}
return user;
};