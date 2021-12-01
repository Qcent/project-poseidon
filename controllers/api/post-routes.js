const sequelize = require('../../config/connection');
const router = require('express').Router();
const { Op } = require("sequelize");
const { Post, User, Message, Category, Message_Chain } = require('../../models');

const withAuth = require('../../utils/auth');

/* only needed for API testing */
router.get('/dashboard', (req, res) => {
    Post.findAll({
            attributes: ['id', 'title', 'content', 'user_id', 'created_at'],
            where: {
                user_id: '2'
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
                        },
                        {
                            model: Post,
                            attributes: [
                                ['user_id', 'op']
                            ],
                            include: {
                                model: User,
                                attributes: ['username']
                            }
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
                        [sequelize.literal('(SELECT COUNT(*) FROM message WHERE message.created_at > 1)'), 'newMessages'],
                    ],
                    where: {
                        [Op.or]: [
                            { creator_id: 2 },
                            { receiver_id: 2 }
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
                    let newMessages = 0;
                    if (dbMsgData) {
                        // serialize the data
                        DMs = dbMsgData.map(post => post.get({ plain: true }));
                        newMessages += DMs[0].newMessages
                    }
                    req.session.newMessages = newMessages;

                    // pass data to template
                    //res.render('dashboard', { posts, DMs, session: req.session });
                    res.json({ posts, DMs, session: req.session })
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
/* */


// GET all posts
router.get('/', (req, res) => {
    Post.findAll({
            attributes: [
                'id',
                'title',
                'content',
                'user_id',
                'category_id',
                'created_at'
            ],
            include: [{
                    model: Category,
                    attributes: ['name']
                }, {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Message_Chain,
                    attributes: ['id', 'creator_id', 'post_id', 'receiver_id'],
                    include: {
                        model: Message,
                        attributes: ['sender_id', 'chain_id'],
                        include: {
                            model: User,
                            attributes: ['id', 'username']
                        }
                    }
                }
            ]
        }).then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

//get one post
router.get('/:id', (req, res) => {
    Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'title',
                'content',
                'user_id',
                'category_id',
                'created_at'
            ],
            include: [{
                    model: Category,
                    attributes: ['name']
                }, {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Message_Chain,
                    attributes: ['id', 'creator_id', 'post_id', 'receiver_id'],
                    include: [{
                            model: Message,
                            attributes: ['sender_id', 'chain_id', 'created_at', 'content'],
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
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

/* Handled by new-post Route
//post a new post
router.post('/', (req, res) => {
    Post.create({
            title: req.body.title,
            post_url: req.body.post_url,
            user_id: req.session.user_id
        })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});
*/

// update a post 
router.put('/:id', withAuth, (req, res) => {
    Post.update({
            title: req.body.title,
            content: req.body.content
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//delete a route
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;