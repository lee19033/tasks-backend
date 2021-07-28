const express = require('express');
const { check } = require('express-validator');

const userConrollers = require('../controllers/user-controllers');

const router = express.Router(); 

router.get('/:userId', userConrollers.getUserById);

router.post(
    '/',
    [
      check('title').not().isEmpty(),
      check('name').isLength({min: 5}),
      check('addres').not().isEmpty()
    ],
    userConrollers.createUser);

router.patch('/:userId', userConrollers.updateUserById);

router.delete('/:userId', userConrollers.deleteUserById);

module.exports = router; 