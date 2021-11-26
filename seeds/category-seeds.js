const { Category } = require('../models');

const categoryData = [{
        name: 'Automotive'
    },
    {
        name: 'Clothing'
    },
    {
        name: 'Computers'
    },
    {
        name: 'Electronics'
    },
    {
        name: 'Household'
    },
    {
        name: 'Jewelery'
    },
    {
        name: 'Pets'
    },
    {
        name: 'Sports'
    },
    {
        name: 'Video Games'
    },
];

const seedCategories = () => Category.bulkCreate(categoryData);

module.exports = seedCategories;