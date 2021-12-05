const router = require('express').Router();
const { User } = require('../../models');

const withAuth = require('../../utils/auth');

// GET /api/users
router.get('/', withAuth, (req, res) => {
    // Access our User model and run .findAll() method)
    User.findAll({
            attributes: { exclude: ['password', 'email'] }
        })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET /api/users/1
router.get('/:id', withAuth, (req, res) => {
    User.findOne({
            attributes: { exclude: ['password', 'email'] },
            where: {
                id: req.params.id
            },
            /*      include: [{
                      model: Post,
                      attributes: ['id', 'title', 'created_at']
                  }]*/
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users
router.post('/', (req, res) => {
    console.log("************** CREATING NEW USER **************");
    User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(dbUserData => {
            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.last_msg_time = dbUserData.last_msg_time;
                req.session.loggedIn = true;

                //return the login and not the user data with hashed password
                res.json(req.session);
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users/logout
router.post('/logout', (req, res) => {
    console.log("************** LOGGING OUT **************");
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

// POST /api/users/login
router.post('/login', (req, res) => {
    console.log("*************** LOGIN ATTEMPT ***************");
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            console.log("=========== !FAILURE! =============");
            return;
        }

        // Verify user
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            console.log("=========== !FAILURE! =============");
            return;
        }

        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.last_msg_time = dbUserData.last_msg_time;
            req.session.avatar = dbUserData.avatar || 'https://www.svgrepo.com/show/5319/user.svg';
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are now logged in!' });
            console.log("=========== SUCCESS! =============");
        });
    });

})

// PUT /api/users/1
router.put('/:id', withAuth, (req, res) => {
    console.log("=========== UPDATE USER =============");
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
            individualHooks: true,
            where: {
                id: req.params.id
            }
        })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }

            console.log(req.body);


            req.session.save(() => {
                // update session variables
                req.session.user_id = req.params.id;
                req.session.username = req.body.username;
                req.session.last_msg_time = req.session.last_msg_time;
                req.session.avatar = req.body.avatar;

                console.log("=========== SUCCESS! =============");
                console.log(req.session.avatar);

                res.json({ message: "Success" });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /api/users/1
router.delete('/:id', withAuth, (req, res) => {
    console.log("=========== DELETETING USER =============");
    User.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;