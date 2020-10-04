const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { check, validationResult } = require('express-validator');   // for validation of checks.
const bcrypt = require('bcryptjs');                                       // for encrypting password.
const jwt = require('jsonwebtoken');                                      // for encrypting response payload.
const config = require('config');                                         // this is where the sescret token is stored.


// @route   POST api/users
// @desc    Register a user
// @access  Public
// validation goes in the brakets.
// REGISTER A NEW USER. Produce a token.
router.post('/', [
    check('name', 'Please add name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters')
    .isLength({ min: 6 })
], // ValidationResult checks the request and if its empty it runs the checks above and returns an array of the error.
    // req stands for the request we're inputting, name, email, and password.
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // input values:
    const { name, email, password } = req.body;
    
    // User is a template, if one with a matching email already exists return message.
    try {
        let user = await User.findOne({email});

        if(user) {
            return res.status(400).json({ msg: 'User already exists'});
        }

        // Fill out the UserSchema with new user. 
        user = new User({
            name,
            email,
            password
        });

        // Encrypt the new user's password.
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save to data base.
        await user.save();
        
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 360000
        }, (err, token) => {
            if(err) throw err;

            // Return the encrypted token. token = {user: { id: user.id }}
            // This is the response.
            res.json({token});
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;