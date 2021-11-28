const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const postRoutes = require('./post-routes.js');
const messageRoutes = require('./message-routes.js');
const categoryRoutes = require('./category-routes.js');
const newPostRoutes = require('./new-post')

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/messages', messageRoutes);
router.use('/categories', categoryRoutes);
router.use('/newPost', newPostRoutes);

module.exports = router;