'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    definition: DataTypes.STRING,
    name: DataTypes.STRING
  });

  return Role;
};