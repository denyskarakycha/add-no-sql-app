const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "295q6722822", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
