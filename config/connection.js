// import the Sequelize constructor from the library
const Sequelize = require("sequelize");

require("dotenv").config();

// create connection to our database
let sequelize;
let host = 'localhost'
if (process.env.DB_HOST) host = process.env.DB_HOST;
if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    sequelize = new Sequelize(
        'lj6l5n983sgad6yl',
        'bo374dp14iax1hrw',
        'uuvdoexlmpgufq9b', {
            host: "jtb9ia3h1pgevwb1.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
            dialect: "mysql",
            port: 3306,
        }
    );
}

module.exports = sequelize;