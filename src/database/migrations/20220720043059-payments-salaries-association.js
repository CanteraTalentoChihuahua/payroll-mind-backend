module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("payments", {
      fields: ["salary_id"],
      name: "payments_salaries_association",
      type: "foreign key",
      references: {
        table: "salaries",
        field: "id"
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("payments", "payments_salaries_association");
  }
};
