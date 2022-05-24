'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('business_units', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('business_units');
  }
};