
const router = require('express').Router()
const UserDatas = require('../models/user')
const keys = require('../config/keys')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const Loginuser = require('../models/loginDetails');


router.use(cors())
router.get('/', (req, res) => {
  UserDatas.find()
    .sort({ date: -1 })
    .then(userdata => res.json(userdata))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/register', (req, res) => {
  const userdata = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }
  if (!userdata.name || !userdata.email || !userdata.password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  UserDatas.findOne({
    email: userdata.email
  })
    .then(user => {
      if (!user) {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(userdata.password, salt, (err, hash) => {
            if (err) {
              throw err
            }
            userdata.password = hash;
            UserDatas
              .create(userdata)
              .then(user =>
                jwt.sign(
                  { id: user._id },
                  keys.secretOrKey,
                  {
                    expiresIn: 3600
                  },
                  (err, token) => {
                    if (err) throw err;
                    res.json({
                      success: true,
                      token: token,
                      user: {
                        _id: user.id,
                        name: user.name,
                        email: user.email
                      }
                    });
                  }
                )
              )
              .catch(err => console.log(err));
          });

        });
      }
    }).catch(err => {
      res.send('email already taken');
    });
});

router.post('/login', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  UserDatas.findOne({
    email: req.body.email
  })
    .then(user => {
    
      if (user) {
        Loginuser.create( {user_id: user._id , date: new Date(user.date).toLocaleDateString()} );
        console.log(Loginuser);
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            _id: user._id,
            name: user.name,
            email: user.email
          }
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 3600
            },
            (err, token) => {
              res.json({

                success: true,
                token: token,
                user: {
                  _id: user._id,
                  name: user.name,
                  email: user.email
                }
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      }
    }).catch(err => {
      res.send('error' + err);
    });
});
// yyyy-month-day (2019-8-1)

router.post('/numOfLogins', (req, res) => {
  const data = {
    date: req.body.date
  }
  console.log(data.date);
  Loginuser.find( { date:  data.date } ).countDocuments().then(response => console.log(response))
    .catch(err => console.log('err', err));
});


module.exports = router
