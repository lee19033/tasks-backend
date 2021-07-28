const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

let DUMMY_USERS = [
    {
        name: "lilach", 
        userId: "1", 
        nickName: "lee",
        email: "lilachash1@gmail.com"
    },
    {
        name: "YUVAL", 
        userId: "2", 
        nickName: "lee",
        email: "YUVAL@123"
    }
];

const getUserById = (req, res, next) => {
    const userId = req.params.userId; 
    const user = DUMMY_USERS.find( p => {
        return p.userId === userId;
    });

    if (!user) { 
        return next( 
            new HttpError('could not find user',404)
        );
    }
    console.log('GET request in user routes');
    res.json({user}); // => {user: user}
}

const createUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid data', 422);
    }
    const {name, nickName, email} = req.body;
    const createdUser = { 
        name,
        userId: uuidv4(),
        nickName,
        email
    };

    DUMMY_USERS.push(createdUser); 

    res.status(201).json({user: createdUser});
};

const updateUserById = (req, res, next) => {
    const {name, nickName, email} = req.body;
    const userId = req.params.userId; 

    const updateUser = { ...DUMMY_USERS.find(p => p.userId === userId)};
    const userIndex = DUMMY_USERS.findIndex( p => p.userId === userId); 
    updateUser.name = name; 
    updateUser.nickName = nickName; 
    updateUser.email = email;

    DUMMY_USERS[userIndex] = updateUser;

    res.status(200).json({user: updateUser});
}

const deleteUserById = (req, res, next) => {
    const userId = req.params.userId;
    DUMMY_USERS = DUMMY_USERS.filter( p => p.userId !== userId);

    res.status(200).json({message:'Deleted User'});
}

exports.getUserById = getUserById; 
exports.createUser = createUser; 
exports.updateUserById = updateUserById;
exports.deleteUserById = deleteUserById; 
