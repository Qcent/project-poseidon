const router = require('express').Router();
const fs = require('fs');

// For uploading photos
const multer = require("multer");
fs.mkdir('../uploads', err => {
    if(err) {
        fs.unlink('../upload', err => {
            console.log(err);
        })
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({storage: storage});

router.get('/', (req, res) => {
    res.render('homepage.handlebars');
});

router.post('/newPost', upload.single('image'), (req, res) => {
    
});

module.exports = router;