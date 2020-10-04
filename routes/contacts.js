const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { check, validationResult } = require('express-validator'); 
const auth = require('../middlewear/auth');
const Contact = require('../models/Contact');

// @route   GET api/contacts
// @desc    Get all users contacts
// @access  Private
// how do we extract the user from the token.
router.get('/', auth, async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id}).sort({ date: -1});  // Here we get all contacts from a specific user.
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   Post api/contacts
// @desc    Add new contact
// @access  Private
router.post('/',[auth, [
    check('name', 'Name is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // pulling the data from the body. This is anticipating the data from our form. Runs only if req is not empty.
    const {name, email, phone, type} = req.body;

    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            type,
            user: req.user.id  // Tag this contact with this user's id.
        });

        const contact = await newContact.save();

        res.json(contact);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
router.put('/:id', [auth], async (req, res) => {
    const {name, email, phone, type} = req.body;

    const contactFields = {};
    if(name) contactFields.name = name;
    if(email) contactFields.email = email;
    if(phone) contactFields.phone = phone;
    if(type) contactFields.type = type;

    try {
        let contact = await Contact.findById(req.params.id);   // params refers to the parameter /:id which we get from an actual contact's id.
        if(!contact) return res.status(404).json({msg: 'Contact not found'});

        if(contact.user.toString() !== req.user.id) {      // contact.user and user's id are the same. req.user.id is dick's Id. We get it from the token.
            return res.status(401).json({msg: 'Not authorized'});
        }

        contact = await Contact.findByIdAndUpdate(req.params.id,
            {$set: contactFields},
            {new: true});

            res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/contacts/:id
// @desc    Delete contact
// @access  Private
router.delete('/:id', [auth], async (req, res) => {

    try {
        let contact = await Contact.findById(req.params.id);   // params refers to the parameter /:id which we get from an actual contact's id.
        if(!contact) return res.status(404).json({msg: 'Contact not found'});

        if(contact.user.toString() !== req.user.id) {      // contact.user and user's id are the same. req.user.id is dick's Id. We get it from the token.
            return res.status(401).json({msg: 'Not authorized'});
        }

        await Contact.findByIdAndRemove(req.params.id);
        res.json("contact deleted");

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;