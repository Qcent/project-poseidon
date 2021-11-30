const seedCategories = require('./category-seeds');
const seedUsers = require('./user-seeds');
const seedPosts = require('./post-seeds');

const updateTimestamps = require('./update-post-time');

const sequelize = require('../config/connection');

const seedAll = async() => {
    await sequelize.sync({ force: true });
    console.log('\n----- DATABASE SYNCED -----\n');

    await seedCategories();
    console.log('\n----- CATEGORIES SEEDED -----\n');

    await seedUsers();
    console.log('\n----- USERS SEEDED -----\n');

    await seedPosts();
    console.log('\n----- POSTS SEEDED -----\n');

    //await updateTimestamps(1);
    //console.log('\n----- POST MODDED -----\n');

    process.exit(0);
};

seedAll();