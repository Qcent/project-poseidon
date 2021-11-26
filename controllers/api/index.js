const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const postRoutes = require('./post-routes.js');
const messageRoutes = require('./message-routes.js');
const categoryRoutes = require('./category-routes.js');
const uploadRoutes = require('./image-routes')

router.use('/users', userRoutes);
router.use('/newPosts', postRoutes);
router.use('/messages', messageRoutes);
router.use('/categories', categoryRoutes);
router.use('/newPosts', uploadRoutes);

module.exports = router;