'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    definition: DataTypes.STRING
  });

  return Role;
};