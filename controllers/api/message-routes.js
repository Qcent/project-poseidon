const router = require('express').Router();
const { Message, User } = require('../../models');

// GET /api/messages
router.get('/', (req, res) => {
    // Access our Message model and run .findAll() method)
    Message.findAll({})
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/messages
router.post('/', (req, res) => {
    Message.create({
            sender_id: req.body.sender_id,
            post_id: req.body.post_id,
            content: req.body.content
        })
        .then(dbMsgData => res.json(dbMsgData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;