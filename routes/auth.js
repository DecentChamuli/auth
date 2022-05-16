const router = require('express').Router()
const User = require('../model/User')
const { registerValidation, loginValidation } = require('../imp/validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req,res)=>{

    // Validation
    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // Checking if Email Already Exists
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send('Email Already Exists')

    // Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    
    // Create New User
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    })
    try {
        // Save user to DB
        await user.save()
        res.send({userId: user._id})
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/login', async (req,res)=>{

    // Validation
    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // Checking if Entered Email is Correct
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('Email not found')

    // Checking if Entered Password is Correct
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send('Password is Wrong')

    // Create and Assign JWT Token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send('Login Successful')
})

module.exports = router