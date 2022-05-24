'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('business_units', [{
      id: 1,
      name: 'Michelada',
    }])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('business_units', null, {});
  }
};
