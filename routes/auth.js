const router = require('express').Router()
const Userdata = require('../models/user')
const keys = require('../config/keys')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcryptjs')
router.use(cors())
const auth = require('../middleware/auth');

router.post('/', (req, res) => {
  console.log('body', req.body.email);
  const { name, email, password } = req.body;

  Userdata.findOne({ email })
    .then(user => {
      if (!user) return res.status(400).json({ msg: "user does not exist" })
      if (user) {
        // validate password
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) return res.status(400).json({ msg: "invalidate credential" })
            jwt.sign(
              { id: user._id },
              keys.secretOrKey,
              {
                expiresIn: 3600
              },
              (err, token) => {
                res.json({
                  success: true,
                  token: token,
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                  }
                });
              }
            );
          })
      }
    });
});
// validating the user with token
router.get('/user', auth, (req, res) => {
  console.log('ress', req.user.id);
  Userdata.findById(req.user.id).select('-password').then(user => res.json(user))
});

module.exports = router