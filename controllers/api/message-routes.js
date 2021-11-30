const router = require('express').Router();
const { Message, Message_Chain } = require('../../models');


// GET /api/messages
router.get('/', (req, res) => {
    // Access our Message model and run .findAll() method)
    Message.findAll({})
        .then(dbMsgData => res.json(dbMsgData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
// GET /api/messages/chain
router.get('/chain', (req, res) => {
    // Access our Message model and run .findAll() method)
    Message_Chain.findAll({})
        .then(dbMsgData => res.json(dbMsgData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/messages/new/:id create a new message chain from post :id
router.post('/new/:id', (req, res) => {
    let data = {
        creator_id: req.body.sender_id || req.session.user_id,
        post_id: req.params.id
    };
    if (req.body.receiver_id) {
        data = {
            creator_id: req.session.user_id,
            receiver_id: req.body.receiver_id
        }
    }

    console.log("============= NEW CHAIN ==========:");
    Message_Chain.create(
            data
        )
        .then(msgChainData => {
            Message.create({
                    sender_id: msgChainData.creator_id,
                    chain_id: msgChainData.id,
                    content: req.body.content
                })
                .then(dbMsgData => res.json(dbMsgData))
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/messages
router.post('/', (req, res) => {
    console.log("============= NEW MESSAGE:");
    Message.create({
            sender_id: req.body.sender_id || req.session.user_id,
            chain_id: req.body.chain_id,
            content: req.body.content
        })
        .then(dbMsgData => res.json(dbMsgData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
// PUT /api/messages/:id
router.put('/:id', (req, res) => {
    Message.update({
            content: req.body.content,
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(dbMsgData => res.json(dbMsgData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;