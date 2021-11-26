const router = require('express').Router();
const fs = require('fs');
const path = require('path');

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

const upload = multer({storage: storage});

router.get('/', (req, res) => {
    console.log('error1');
    res.render('new-post');
});

router.post('/', upload.single('image'), (req, res) => {
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
    res.render('new-post');
});

module.exports = router;