const { User } = require('../models');

const userData = [{
        username: 'Alice',
        email: 'alice@email.com',
        about: "I am a seeded test user and my password is 'aliceLogin'",
        private: false,
        password: '$2b$10$6bo8aizE9tZ8YaqS2KoYau6pMdSom9YiW2xlNQuNnEfZcD9HW5.Ru'
    },
    {
        username: 'Bob',
        email: 'bob@email.com',
        about: "I am a seeded test user and my password is 'bobLogin'",
        private: false,
        password: '$2b$10$26cWExXP/ZTPvLetUxlsnexi9YQF5THlvDWclfauQ5jH5i8WkVj3y'
    },


];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;