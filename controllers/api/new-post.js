const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { Post, User } = require('../../models');


// For uploading photos
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/userUploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

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
            include: {
                model: User,
                attributes: ['username']
            }
        }).then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

router.post('/', upload.single('image'), (req, res) => {
    Post.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.body.user_id,
            category_id: req.body.category_id
        })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    res.render('new-post');
});

module.exports = router;