module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("pre_payments", {
      fields: ["salary_id"],
      name: "pre_payments_salaries_association",
      type: "foreign key",
      references: {
        table: "salaries",
        field: "id"
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("pre_payments", "pre_payments_salaries_association");
  }
};
