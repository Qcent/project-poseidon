const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Message model
class Message_Chain extends Model {}

// define table columns and configuration
Message_Chain.init({
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
    // define a creator column
    creator_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // define a receiver column
    receiver_id: {
        type: DataTypes.INTEGER,
    },
    // chains must be attached to a post or a reciever
    post_id: {
        type: DataTypes.INTEGER,
    },

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
    modelName: 'message_chain'

});

module.exports = Message_Chain;