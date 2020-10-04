const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { check, validationResult } = require('express-validator');   // for validation of checks.
const bcrypt = require('bcryptjs');                                       // for encrypting password.
const jwt = require('jsonwebtoken');                                      // for encrypting response payload.
const config = require('config');                                         // this is where the sescret token is stored.
const auth = require('../middlewear/auth');

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
// when access is private we need to protect with middlewear (auth).
// The second parameter auth is the middlewear with the encrypted token. 
// router.get gets the logged in user.
router.get('/', auth, async (req, res) => {
    try {
        // Here we get the users info except the password.
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth
// @desc    Auth user & get token
// @access  Public
// Login.
router.post('/',[
    check('email', 'Please include valid email').isEmail(),
    check('password', 'Password required').exists()
], 
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email});
        if(!user) {
            return res.status(400).json({msg: 'Invalid Credentials'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({msg: 'Invalid Credentials'});
        }
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 360000
        }, (err, token) => {
            if(err) throw err;
            res.json({token});
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;