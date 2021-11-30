const router = require('express').Router();
const sequelize = require('../config/connection');
const { Op } = require("sequelize");
const { User, Post, Category, Message_Chain, Message } = require('../models');
//const withAuth = require('../utils/auth');

//GET DB info for users dashboard
router.get('/dashboard', (req, res) => {
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
                    attributes: ['id', 'creator_id', 'receiver_id', 'post_id', [sequelize.literal('(SELECT username FROM user WHERE receiver_id = user.id )'), 'receiver_name'], ],
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
                .then(dbMsgData => {
                    let DMs = '';
                    if (dbMsgData) {
                        // serialize the data
                        DMs = dbMsgData.map(post => post.get({ plain: true }));
                        console.log(DMs)
                    }

                    // pass data to template
                    res.render('dashboard', { posts, DMs, session: req.session });
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//get specific user by id
router.get('/:id', (req, res) => {
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