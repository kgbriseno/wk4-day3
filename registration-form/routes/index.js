const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('http-auth');
const { check, validationResult } = require('express-validator');


const router = express.Router();
const Registration = mongoose.model('Registration');
const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
});

router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Registration form' });
});

router.get('/thankyou', (req, res) => {
    res.render('thankyou', { title: 'Thank You Message' });
});

router.get('/registrants', basic.check((req, res) => {
    Registration.find()
    .then((registrations) => {
        res.render('registrants', { title: 'Listing registrations', registrations });
    })
    .catch((err) => {
        console.log(err);
        res.send('Sorry! Something went wrong.');
    });
}));

router.post('/', 
    [
        check('name')
        .isLength({ min: 1 })
        .withMessage('Please enter a name'),
        check('email')
        .isLength({ min: 1 })
        .withMessage('Please enter an email'),
    ],
    async (req, res) => {
        //console.log(req.body);
        const errors = validationResult(req);
        if (errors.isEmpty()) {
          const registration = new Registration(req.body);
          //generate alt to hash password
          const salt = await bcrypt.genSalt(10);
          //set user password to hashed password
          registration.password = await bcrypt.hash(registrtion.password, salt);

          registration.save()
            .then(() => {res.send('Thank you for your registration!');})
            .catch((err) => {
              console.log(err);
              res.send('Sorry! Something went wrong.');
            });
          } else {
            res.render('form', { 
                title: 'Registration form',
                errors: errors.array(),
                data: req.body,
             });
          }
    });

module.exports = router;