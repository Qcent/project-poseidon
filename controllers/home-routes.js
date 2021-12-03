const router = require("express").Router();
const sequelize = require("../config/connection");
const { Op } = require("sequelize");
const { User, Category, Post, Message_Chain, Message } = require("../models");
const withAuth = require('../utils/auth');

// get all posts for homepage
router.get("/", (req, res) => {
    //set up a query obj for searching the database
    let query = {}
    if (req.query.search) {
        // if a search query exists search in titles OR content for matches
        query = {
            [Op.or]: [{
                    title: {
                        [Op.like]: `%${req.query.search}%`
                    }
                },
                {
                    content: {
                        [Op.like]: `%${req.query.search}%`
                    }
                }
            ]
        }
    }

    console.log("==========Loading Homepage============");
    Post.findAll({
            attributes: [
                'id',
                'title',
                'content',
                'user_id',
                'category_id',
                'created_at',
                'uploaded_photo'
            ],
            where: query,
            order: [
                ['created_at', 'DESC']
            ],
            include: [{
                    model: User,
                    attributes: ['id', 'username']
                },
                {
                    model: Category,
                    attributes: ["name"],
                }
            ]
        })
        .then(dbPostData => {
            const posts = dbPostData.map(post => post.get({ plain: true }));

            if (req.query.search) { req.session.searchStr = req.query.search; } else { req.session.searchStr = '*'; }
            if (req.params.category) { req.session.searchCat = req.params.category; } else { req.session.searchCat = 'All'; }

            res.render('homepage', {
                posts,
                session: req.session
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//create a New post
router.get("/newPost", withAuth, (req, res) => {
    res.render("new-post", { session: req.session });
});

//get specific post by id
router.get("/post/:id", (req, res) => {
    console.log("==========Loading Single Post============");
    Post.findOne({
            attributes: [
                'id',
                'title',
                'content',
                'user_id',
                'category_id',
                'created_at'
            ],
            where: {
                id: req.params.id,
            },
            include: [{
                    model: User,
                    attributes: ['id', "username"],
                },
                {
                    model: Category,
                    attributes: ["name"],
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
        .then((dbPostData) => {
            if (!dbPostData) {
                res.status(404).json({ message: "No post found with this id" });
                return;
            }
            // serialize the data
            const post = dbPostData.get({ plain: true });

            // pass data to template
            res.render("single-post", { post, session: req.session });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

//get specific post by id for editing
router.get("/edit/:id", withAuth, (req, res) => {
    console.log("==============LOADING EDIT USER=================");
    Post.findOne({
            attributes: [
                'id',
                'title',
                'content',
                'user_id',
                'category_id',
                'created_at'
            ],
            where: {
                id: req.params.id,
            },
            include: [{
                    model: User,
                    attributes: ['id', "username"],
                },
                {
                    model: Category,
                    attributes: ["name"],
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
        .then((dbPostData) => {
            if (!dbPostData) {
                res.status(404).json({ message: "No post found with this id" });
                return;
            }
            // serialize the data
            const post = dbPostData.get({ plain: true });
            // add logged in user id to the message chain for determining ownership for edits
            post.message_chains.forEach(msgChain => msgChain.loggedUser = req.session.user_id);
            // pass data to template
            res.render("edit-post", { post, session: req.session });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    return
});

router.get("/login", (req, res) => {
    console.log("==============LOADING LOGIN=================");
    if (req.session.loggedIn) {
        res.redirect("/user/dashboard");
        return;
    }
    res.render("login");
});

router.get("/signup", (req, res) => {
    console.log("==============LOADING SIGNUP=================");
    if (req.session.loggedIn) {
        res.redirect("/user/dashboard");
        return;
    }
    res.render("signup");
});

// get all posts for homepage/:category
router.get("/:category", (req, res) => {
    // this is constantly being called and i believe is messing up some page loads occasionaly
    if (req.params.category == 'favicon.ico') {
        return;
    }
    console.log("==========Loading Category============");
    console.log(`========== ${req.params.category} ============`);
    let query = { '$category.name$': req.params.category }
    if (req.query.search) {
        query = {
            [Op.and]: [
                { '$category.name$': req.params.category },
                {
                    [Op.or]: [{
                            title: {
                                [Op.like]: `%${req.query.search}%`
                            }
                        },
                        {
                            content: {
                                [Op.like]: `%${req.query.search}%`
                            }
                        }
                    ]
                }
            ]
        }
    }
    Post.findAll({
            attributes: [
                'id',
                'title',
                'content',
                'user_id',
                'category_id',
                'created_at'
            ],
            where: query,
            order: [
                ['created_at', 'DESC']
            ],
            include: [{
                    model: User,
                    attributes: ['id', 'username']
                },
                {
                    model: Category,
                    attributes: ["name"],
                }
            ]
        })
        .then((dbPostData) => {
            const posts = dbPostData.map((post) => post.get({ plain: true }));

            if (req.query.search) { req.session.searchStr = req.query.search; } else { req.session.searchStr = '*'; }
            if (req.params.category) { req.session.searchCat = req.params.category; } else { req.session.searchCat = 'All'; }

            res.render("homepage", {
                posts,
                session: req.session,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;