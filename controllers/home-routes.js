const router = require("express").Router();
const sequelize = require("../config/connection");
const { User, Category, Post, Message_Chain, Message } = require("../models");

// get all posts for homepage
router.get("/", (req, res) => {
    console.log("==========Loading Homepage============");

    Post.findAll({
            attributes: [
                'id',
                'title',
                'content',
                'user_id',
                'category_id',
                'created_at'
            ],
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

            console.log(posts)
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
router.get("/newPost", (req, res) => {
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
                        include: { model: User,
                            attributes: ['id', 'username']
                        }
                    },
                    {
                        model: User,
                        attributes: ['id', "username"],
                    }]
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
router.get("/edit/:id", (req, res) => {
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
            res.render("edit-post", { post, session: req.session });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
        return
});

router.get("/login", (req, res) => {
    console.log(req.session);
    if (req.session.loggedIn) {
        res.redirect("/");
        return;
    }
    res.render("login");
});

router.get("/signup", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect("/");
        return;
    }
    res.render("signup");
});


// get all posts for homepage/:category
router.get("/:category", (req, res) => {
    console.log("==========Loading Category============");
    Category.findAll({
            where: {
                name: req.params.category,
            },
        })
        .then((dbPostData) => {
            const categories = dbPostData.map((post) => post.get({ plain: true }));

            res.render("homepage", {
                categories,
                session: req.session,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;