const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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


    let hashedPassword; 
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    }
    catch (err) {
        const error = new HttpError('Cound not create user, pleas try again.',500);
        return next(error);
    }

    const createdUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });

    try {
        createdUser.save();
    }
    catch(err) {
        const error = new HttpError('Signing up failed, please try again', 500);
        return next(error);
    }

    let token; 
    try {
        token = jwt.sign(
            {userId : createdUser.id, email: createdUser.email },
            'family_board', 
            { expiresIn: '1h'}
        )
    }
    catch(err) {
        const error = new HttpError('Signing up failed, please try again', 500);
        return next(error);
    }

    //res.status(201).json({user: createdUser.toObject({getters: true}), token: token});
    res.status(201).json({
        userId: existingUser.id,
        email: existingUser.email,
        token: token
      });
    
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

    if (!existingUser) {
        const error = new HttpError(
            'Invalide credentials, could not log in.', 401
        );
        return next(error);
    }

    let isValidPassword = false; 
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password); 
    }
    catch (err) {
        const error = new HttpError('Could not log you in, please try again.',500);
        return next(error); 
    }

    if (!isValidPassword) {
        const error = new HttpError(
            'Invalide credentials, could not log in.', 401
        );
        return next(error);
    }

    let token; 
    try {
        token = jwt.sign(
            {userId : existingUser.id, email: existingUser.email },
            'family_board', 
            { expiresIn: '1h'}
        )
    }
    catch(err) {
        const error = new HttpError('Login failed, please try again', 500);
        return next(error);
    }

    res.json({user: existingUser.toObject({getters: true}), token: token});
    /*res.status(201).json({
        userId: existingUser.id,
        email: existingUser.email,
        token: token,
        user: existingUser.toObject({getters: true})
      });*/
    
}

const updateUserAccountById = async (req, res, next) => {
    const { firstName, lastName, email } = req.body;

    const userId = req.params.uid; 

    let user; 
    try {
        user = await User.findById(userId);
    }catch(err) {
        const error = new HttpError(
            'Someting went wrong, could not update user details.' + err.message, 500
        );
        return next(error);
    }

    user.firstName  = firstName; 
    user.lastName = lastName;
    user.email = email; 
     
    if (req.file) {
        user.image = req.file.path; 
    }

    try {
        await user.save();
    } catch(err) {
        const error = new HttpError(
            'could not update user' + err.message, 500 
        ); 
        return next(error); 
    }

    res.status(200).json({user: user.toObject({getters : true})});
}


exports.getUsers = getUsers; 
exports.signup = signup; 
exports.login = login;
exports.updateUserAccountById = updateUserAccountById;
