'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('incomes_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      income_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      counter: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      amount: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('incomes_users');
  }
};