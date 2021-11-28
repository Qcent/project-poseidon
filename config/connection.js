// import the Sequelize constructor from the library
const Sequelize = require("sequelize");

require("dotenv").config();

// create connection to our database
let sequelize;
let host = 'localhost'
if (process.env.DB_HOST) host=process.env.DB_HOST;
if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PW,
    {
      host: host,
      dialect: "mysql",
      port: 3306,
    }
  );
}

module.exports = sequelize;