const router = require('express').Router();
const sequelize = require('../config/connection');
const { User } = require('../models');
//const withAuth = require('../utils/auth');


//get specific user by id
router.get('/:id', (req, res) => {
    User.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'username',
                'about',
                'private',
                'email',
                'created_at'
            ]
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            // serialize the data
            const user = dbUserData.get({ plain: true });

            // pass data to template
            res.render('single-user', { user, session: req.session });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;