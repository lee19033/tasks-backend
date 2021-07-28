const express = require('express');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');

const userRoutes = require('./routes/user-routes');
const usersRoutes = require('./routes/users-routes');
const groupsRoutes = require('./routes/groups-routes');
const tasksRoutes = require('./routes/tasks-routes');



const app = express(); 

app.use( (req, res, next)  => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH, DELETE');

   next(); 
});



app.use(express.json());


//app.use('/api/users', userRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/tasks',tasksRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
});

app.use((error, req, res, next) => {''
    if(res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occured!'});

});

mongoose.connect('mongodb+srv://lilach-mongo:1974mongo@cluster0.q7c5r.mongodb.net/taskForce?retryWrites=true&w=majority', {useNewUrlParser: true})
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });
                  
