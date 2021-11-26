const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Message model
class Message extends Model {}

// define table columns and configuration
Message.init({
    // define an id column
    id: {
        // use the special Sequelize DataTypes object provide what type of data it is
        type: DataTypes.INTEGER,
        // this is the equivalent of SQL's `NOT NULL` option
        allowNull: false,
        // instruct that this is the Primary Key
        primaryKey: true,
        // turn on auto increment
        autoIncrement: true
    },
    // define a sender column
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // define a receiver column
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // define content column
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }

}, {
    // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))
    // pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
    // automatically create createdAt/updatedAt timestamp fields
    timestamps: true,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: 'message'

});

module.exports = Message;