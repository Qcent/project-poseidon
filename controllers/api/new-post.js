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

router.post('/', [withAuth, upload.single('post-photo')], (req, res) => {
    var uploadedPhoto = [];

    console.log("**************** CREATING NEW POST ****************");

    if (typeof req.file === 'object') {
        console.log("IMAGE OBJECT === TRUE");
        uploadedPhoto = [];
        // need to remove the public folder from the path
        uploadedPhoto.push(req.file.path.replace(/public\//, ''));
    } else {
        console.log("!!!!!!!!!!NO IMAGE!!!!!!!!!!");
        console.log(req.body);
    }

    const newUpload = uploadedPhoto.toString();
    if (newUpload) {
        console.log("============IMAGE============");
        console.log("============PATH============");
        console.log(newUpload);
        console.log("=========================");
    }
    console.log("**************** SENDING DATABASE REQUEST ****************");
    Post.create({
            title: req.body['post-title'],
            content: req.body['post-content'],
            user_id: req.session.user_id,
            category_id: req.body['post-category'],
            uploaded_photo: newUpload
        })
        .then(dbPostData => {
            console.log(dbPostData.dataValues);
            res.json({ ok: "true" })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});

module.exports = router;