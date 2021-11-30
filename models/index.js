const User = require('./User');
const Post = require('./Post');
const Message = require('./Message');
const Category = require('./Category');
const Message_Chain = require('./Message-Chain');



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

Post.hasMany(Message_Chain, {
    foreignKey: 'post_id',
    onDelete: 'cascade',
});




Message_Chain.belongsTo(User, {
    foreignKey: 'creator_id',
});
Message_Chain.belongsTo(User, {
    foreignKey: 'receiver_id',
});
Message_Chain.belongsTo(Post, {
    foreignKey: 'post_id',
});
User.hasMany(Message_Chain, {
    foreignKey: 'creator_id'
});
User.hasMany(Message_Chain, {
    foreignKey: 'receiver_id'
});


Message.belongsTo(Message_Chain, {
    foreignKey: 'chain_id'
});
Message_Chain.hasMany(Message, {
    foreignKey: 'chain_id',
    onDelete: 'cascade'
});
Message.belongsTo(User, {
    foreignKey: 'sender_id',
});
Message_Chain.belongsTo(User, {
    foreignKey: 'creator_id',
});



module.exports = { User, Message_Chain, Message, Category, Post };