/* eslint-disable indent */
/* eslint-disable linebreak-style */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('indicators', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      new_users: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      inactive_users: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      month: {
        type: Sequelize.STRING,
        allowNull: false
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false
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
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('indicators');
  }
};
