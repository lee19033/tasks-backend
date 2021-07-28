const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
    {
        id: uuidv4(),
        firstName: "lilach", 
        lastName: "ash",
        email: "lilachash1@gmail.com",
        password : "123456"
    },
    {
        id: uuidv4(),
        firstName: "yuval", 
        lastName: "ash",
        email: "lilachash1@gmail.com",
        password : "123456"
    }
];

const getUsers = async (req, res, next) => {    

    let users; 
    try {
        users = await User.find({}, '-password');
    } catch(err) {
        const error = new HttpError(
            'Fetching users failed, please try again later.'
        );
    }

    res.json({users: users.map(user => user.toObject({ getters: true}))});
}

const signup = async (req, res, next) => {
    console.log(req);
    const { firstName, lastName, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email})
    } catch(err) {
        const error = new HttpError(
            'Signing up failed, please try again later.', 500
        );
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError(
            'User already exists, please login instead.', 422
        );
        return next(error);
    }


    const createdUser = new User({
        firstName,
        lastName,
        email,
        password
    });

    try {
        createdUser.save();
    }
    catch(err) {
        const error = new HttpError('Signing up failed, please try again', 500);
        return next(error);
    }

    res.status(201).json({user: createdUser.toObject({getters: true})});
};

const login = async (req, res, next) => {
    const { email, password } = req.body; 

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email})
    } catch(err) {
        const error = new HttpError(
            'Logging in failed, please try again later.', 500
        );
        return next(error);
    }

    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError(
            'Invalide credentials, could not log in.', 401
        );
        return next(error);
    }
    
    res.json({message: 'Logged in', user: existingUser.toObject({getters: true})});
}

exports.getUsers = getUsers; 
exports.signup = signup; 
exports.login = login;
