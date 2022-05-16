const router = require('express').Router()
const verify = require('../imp/verifyToken')

router.get('/',verify , (req, res) => {
    res.json({check: "This is Private route to check JWT"})
})

module.exports = router