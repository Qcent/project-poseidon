const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Image extends Model {};

//Post hasMany Image
Image.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
    },
    {
        sequelize, 
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
)