const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Category, Post } = require('../models');

// get all posts for homepage
router.get('/', (req, res) => {
    console.log('==========Loading Homepage============');
    Post.findAll({
            attributes: [
                'id',
                'post_content',
                'title',
                'created_at'
            ],
            include: [{
                model: User,
                attributes: ['username']
            }]
        })
        .then(dbPostData => {
            const users = dbPostData.map(post => post.get({ plain: true }));

            res.render('homepage', {
                users,
                session: req.session
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//create a New post
router.get('/newPost', (req, res) => {
    res.render('new-post', { session: req.session });
});

//get specific post by id
router.get('/post/:id', (req, res) => {
    Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'post_content',
                'title',
                'created_at'
            ],
            include: [{
                model: User,
                attributes: ['username']
            }]
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }

            // serialize the data
            const post = dbPostData.get({ plain: true });

            // pass data to template
            res.render('single-post', { post, session: req.session });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/login', (req, res) => {
    console.log(req.session);
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});

// get all posts for homepage/:category
router.get('/:category', (req, res) => {
    console.log('==========Loading Homepage============');
    Category.findAll({
            where: {
                name: req.params.category
            }
        })
        .then(dbPostData => {
            const categories = dbPostData.map(post => post.get({ plain: true }));

            res.render('homepage', {
                categories,
                session: req.session
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;