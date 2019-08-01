const router = require('express').Router();
const ProductData = require('../models/product');
const auth = require('../middleware/auth');


router.get('/', (req, res) => {
    ProductData.find()
        .then(blogdata => res.json(blogdata))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/product', (req, res) => {

    const user = req.body.user;
    const proName = req.body.product_name;
    const rate = req.body.rate;
    const status = req.body.status;


    const newproduct = new ProductData({ user, product_name: proName, rate, status });
    newproduct.save()
        .then(response => res.json(response))
        .catch(err => console.log('err', err));
});

router.post('/query', (req, res) => {
    const data = {
        user: req.body.user,
        status: req.body.status,
        startdate: req.body.startdate,
        enddate: req.body.enddate
    }

    ProductData.aggregate(
        [
            {
                $match: {
                    $and: [
                        { user: data.user },
                        { status: data.status },
                        {
                            date: {
                                $gte: new Date(data.startdate),
                                $lte: new Date(data.enddate)
                            }
                        }
                    ]

                },

            },

            {
                $count: data.user
            },

        ]
    ).then(response => console.log(response))
        .catch(err => console.log('err', err));
});

router.delete('/delete/:id', auth, (req, res) => {
    ProductData.findByIdAndDelete(req.params.id).then((users) => res.json(users)
    )
});
module.exports = router;