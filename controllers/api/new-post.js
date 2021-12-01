const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

// For uploading photos
const multer = require("multer");

fs.mkdir('public/images/userUploads', err => {
    if(err) {
        fs.unlink('upload', err => {
            console.log(err);
        })
    }
});

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

router.post('/upload', [withAuth, upload.single('image')], (req, res) => {
    //console.log(req.file.filename);
    res.render('new-post');
});

router.post('/', withAuth, (req, res) => {
    //console.log(req.file.filename);
    Post.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.session.user_id,
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