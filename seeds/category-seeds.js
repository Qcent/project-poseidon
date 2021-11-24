const { Category } = require('../models');

const categoryData = [{
        name: 'Automotive'
    },
    {
        name: 'Household'
    },
    {
        name: 'Pets'
    },
    {
        name: 'Sports'
    },
    {
        name: 'Electronics'
    },
    {
        name: 'Computers'
    },
    {
        name: 'Video Games'
    },
    {
        name: 'Clothing'
    },
    {
        name: 'Jewelery'
    }
];

const seedCategories = () => Category.bulkCreate(categoryData);

module.exports = seedCategories;