const router = require('express').Router();
const { Category } = require('../../models');
const withAuth = require('../../utils/auth');

// GET /api/categories
router.get('/', (req, res) => {
    // Access our Category model and run .findAll() method)
    Category.findAll({})
        .then(dbCatagoryData => res.json(dbCatagoryData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/categories
router.post('/', withAuth, (req, res) => {
    Category.create({
            name: req.body.name
        })
        .then(dbCatagoryData => res.json(dbCatagoryData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
// PUT /api/Categorys/:id
router.put('/:id', withAuth, (req, res) => {
    Category.update({
            name: req.body.name,
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(dbCatagoryData => res.json(dbCatagoryData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.delete('/:id', withAuth, (req, res) => {
    Category.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(dbCatagoryData => res.json(dbCatagoryData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;