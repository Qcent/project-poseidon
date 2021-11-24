const router = require('express').Router();

const userRoutes = require('./user-routes.js');
//const postRoutes = require('./post-routes.js');
const messageRoutes = require('./message-routes.js');

router.use('/users', userRoutes);
//router.use('/posts', postRoutes);
router.use('/messages', messageRoutes);

module.exports = router;