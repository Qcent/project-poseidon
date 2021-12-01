const router = require('express').Router();
const sequelize = require('../config/connection');
const { Op } = require("sequelize");
const { User, Post, Category, Message_Chain, Message } = require('../models');
const withAuth = require('../utils/auth');

//* HELPER FUNCTIONS FOR GETTING NEW MESSAGES  */
const findNewDMs = (lastCheck, uid) =>
    Message.findAll({
        attributes: ['id', 'chain_id', 'created_at', 'content'],
        where: {
            [Op.and]: [
                sequelize.where(sequelize.fn('date', sequelize.col('message.created_at')), '>', sequelize.fn('date', lastCheck)),
                {
                    [Op.or]: [
                        { '$message_chain.creator_id$': uid },
                        { '$message_chain.receiver_id$': uid }
                    ]
                }
            ]
        },
        include: [{
            model: Message_Chain,
            attributes: ['id']
        }],
        order: [
            ['created_at', 'DESC']
        ]
    }).then(newMsgData => newMsgData.map(msg => msg.get({ plain: true })))


const findNewPostMsg = (lastCheck, uid) =>
    Message.findAll({
        attributes: ['id', 'chain_id', 'created_at', 'content'],
        where: {
            [Op.and]: [
                sequelize.where(sequelize.fn('date', sequelize.col('message.created_at')), '>', sequelize.fn('date', lastCheck)),
                { '$message_chain.post.user_id$': uid }
            ]
        },
        include: [{
            model: Message_Chain,
            attributes: ['id'],
            include: [{
                model: Post,
                attributes: ['id', 'user_id']
            }],

        }],
        order: [
            ['created_at', 'DESC']
        ]
    }).then(newMsgData => newMsgData.map(msg => msg.get({ plain: true })))
    /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */
    //* HELPER FUNCTIONS FOR GETTING NEW MESSAGES  */

//GET DB info for users dashboard
router.get('/dashboard', withAuth, (req, res) => {
    Post.findAll({
            attributes: ['id', 'title', 'content', 'user_id', 'created_at'],
            where: {
                user_id: req.session.user_id
            },
            include: [{
                    model: Category,
                    attributes: ["name"],
                },
                {
                    model: User,
                    attributes: ['id', "username"],
                },
                {
                    model: Message_Chain,
                    attributes: ['id', 'creator_id', 'post_id'],
                    include: [{
                            model: Message,
                            attributes: ['chain_id', 'sender_id', 'created_at', 'content'],
                            include: {
                                model: User,
                                attributes: ['id', 'username']
                            }
                        },
                        {
                            model: User,
                            attributes: ['id', "username"],
                        }
                    ]
                }
            ]

        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            // serialize the data
            const posts = dbUserData.map(post => post.get({ plain: true }));

            // Get any DM messages
            Message_Chain.findAll({
                    attributes: ['id', 'creator_id', 'receiver_id', 'post_id', [sequelize.literal('(SELECT username FROM user WHERE receiver_id = user.id )'), 'receiver_name'],
                        [sequelize.literal('(SELECT username FROM user WHERE creator_id = user.id )'), 'creator_name'],
                        [sequelize.literal(`(SELECT COUNT(*) FROM message WHERE message.created_at > 1 AND (creator_id = ${req.session.user_id}))`), 'newMessages'],
                    ],
                    where: {
                        [Op.or]: [
                            { creator_id: req.session.user_id },
                            { receiver_id: req.session.user_id }
                        ]
                    },
                    include: [{
                            model: Message,
                            attributes: ['chain_id', 'sender_id', 'created_at', 'content'],
                            include: {
                                model: User,
                                attributes: ['id', 'username']
                            }
                        },
                        {
                            model: User,
                            attributes: ['id', "username"],
                        },
                        {
                            model: Post,
                            include: {
                                model: User,
                                attributes: ['id', 'username']
                            }
                        }
                    ]
                })
                .then(async dbMsgData => {
                    let DMs = '';
                    if (dbMsgData) {
                        // serialize the data
                        DMs = dbMsgData.map(post => post.get({ plain: true }));
                        // add logged in user id to the message chain for determining ownership for edits
                        DMs.forEach(msgChain => msgChain.loggedUser = req.session.user_id);
                    }

                    /************************* */
                    /* TRY AND GET THE NEW DMs */
                    /************************* */
                    const newMsg = await findNewDMs(req.session.last_msg_time, req.session.user_id);
                    const newPostMsg = await findNewPostMsg(req.session.last_msg_time, req.session.user_id);

                    /*
                    if (newMsg.length) req.session.newMessages = 1;
                    else req.session.newMessages = 0;
                    */

                    /* SET THE DMs[n].new = true if newMessages[n].chain_id == DMs[n].id */
                    DMs.forEach(convo => {
                        newMsg.forEach(msg => {
                            if (msg.chain_id == convo.id) convo.new = true;
                        });
                    });
                    /* */

                    /* SET THE Post[n].new = true if newMessages[n].chain_id == DMs[n].id */
                    DMs.forEach(convo => {
                        newMsg.forEach(msg => {
                            if (msg.chain_id == convo.id) convo.new = true;
                        });
                    });
                    /* */

                    /*^^^^^^^^^^^^^^^^^^^^^^^^^*/


                    // pass data to template
                    res.render('dashboard', { posts, DMs, newMsg, session: req.session });
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//get specific user by id
router.get('/:id', withAuth, (req, res) => {
    User.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'username',
                'about',
                'private',
                'email',
                'created_at'
            ]
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            // serialize the data
            const user = dbUserData.get({ plain: true });

            // pass data to template
            res.render('single-user', { user, session: req.session });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;