const { User } = require('../models');

const userData = [{
        username: 'Alice',
        email: 'alice@email.com',
        about: "I am a seeded test user and my password is 'aliceLogin'",
        private: false,
        password: 'aliceLogin'
    },
    {
        username: 'Bob',
        email: 'bob@email.com',
        about: "I am a seeded test user and my password is 'bobLogin'",
        private: false,
        password: 'bobLogin'
    },


];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;