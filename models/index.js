const User = require('./User');
const Post = require('./Post');
const Message = require('./Message');
const Category = require('./Category');



// create associations
User.hasMany(Post, {
    foreignKey: 'user_id'
});

Post.belongsTo(User, {
    foreignKey: 'user_id',
});

Post.belongsTo(Category, {
    foreignKey: 'category_id',
});

Post.hasMany(Message, {
    foreignKey: 'post_id'
});
Message.belongsTo(Post, {
    foreignKey: 'post_id',
});
Message.belongsTo(User, {
    foreignKey: 'sender_id',
});

User.hasMany(Message, {
    foreignKey: 'sender_id'
});


module.exports = { User, Message, Category, Post };