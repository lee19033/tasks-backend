const express = require('express');
const fileUpload = require('../middleware/file-upload.js');
const checkAuth = require('../middleware/check-auth.js');

const usersConrollers = require('../controllers/users-controllers');

const router = express.Router(); 

router.get('/', usersConrollers.getUsers);

router.post('/login', usersConrollers.login);

router.post('/signup', usersConrollers.signup);

//router.use(checkAuth);

router.patch('/:uid', 
                fileUpload.single('image'),
                usersConrollers.updateUserAccountById);


module.exports = router; 