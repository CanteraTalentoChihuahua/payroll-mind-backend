module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("pre_payments", {
      fields: ["payment_period_id"],
      name: "pre_payments_payments_periods_association",
      type: "foreign key",
      references: {
        table: "payments_periods",
        field: "id"
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("pre_payments", "pre_payments_payments_periods_association");
  }
};