const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

// For uploading photos
const multer = require("multer");

if (fs.existsSync('public/images/userUploads')) {
    //console.log('Directory exists!');
} else {
    //console.log('Directory not found.');
    fs.mkdir('public/images/userUploads', err => {
        if (err) {
            console.log(err);
        }
    });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/userUploads');
    },
    filename: (req, file, cb) => {
        //console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// router.post('/', [withAuth, upload.single('image')], (req, res) => {
//     //console.log(req.file.filename);
//     res.render('new-post');
// });
var uploadedPhoto = [];
router.post('/', [withAuth, upload.single('image')], (req, res) => {

    //console.log(req.file.path.replace(/^.==public\//, ''))

    if (typeof req.file === 'object') {
        console.log("OBJECT === TRUE");
        uploadedPhoto = [];
        // need to remove the public folder from the path
        uploadedPhoto.push(req.file.path.replace(/public\//, ''));
    }

    const newUpload = uploadedPhoto.toString();
    console.log("=========================");
    console.log("=========================");
    console.log(newUpload);
    console.log("=========================");

    if (typeof req.body.title === 'string') {
        Post.create({
                title: req.body.title,
                content: req.body.content,
                user_id: req.session.user_id,
                category_id: req.body.category_id,
                uploaded_photo: newUpload
            })
            .then(dbPostData => {
                console.log(dbPostData);
                res.json(dbPostData)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    } else {
        res.render('new-post');
    }
});

module.exports = router;