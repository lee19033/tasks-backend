const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Task = require('../models/task');
const Group = require('../models/group');
const mongoose = require('mongoose');

const getTasksByGroupId =  async (req, res, next) => {
    const groupId = req.params.gid;
    let groupTasks;

    try {
         groupTasks = await Group.findById(groupId).populate('groupTasks');
    }catch(err) {
        const error = new HttpError('could not find task by group id, 500');
        return next(error);
    }
    
    //if (!groupTasks || groupTasks.groupTasks.length === 0) {
    if (!groupTasks) { 
        const error = new HttpError('could not find group',404);
        return next(error);
    }
    
    res.json( {tasks: groupTasks.groupTasks.map(task => task.toObject({geters: true}))});
}

const createNewTask = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid data', 422);
    }``
    
    const { groupId, taskName, taskDescription, taskDuedate, taskStatus, taskImage, taskMembers } = req.body;
    const createdTask = new Task ({
        groupId, 
        taskName, 
        taskDescription, 
        taskDuedate, 
        taskStatus, 
        taskImage, 
        taskMembers
    });

    let group;
    try {
        group = await Group.findById(groupId);
    } catch (err) {
    const error = new HttpError('Creating task failed, please try again', 500);
    return next(error);
  }

  if (!group) {
    const error = new HttpError('Could not find group for provided id', 404);
    return next(error);
  }

  console.log(group);

    
        
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction(); 
        await createdTask.save({session: sess});
        group.groupTasks.push(createdTask);
        await group.save({session: sess});
        await sess.commitTransaction(); 
    }
    catch(err) {
        const error = new HttpError('created task fail' + err.message,500);
        return next(error);
    }
    
    res.status(201).json({task: createdTask});
};

const getTasks = async (req, res, next) => {
    let tasks;
    try {
        tasks = await Task.find();
    }
    catch(err) {
        const error = new HttpError(
                    'Fetching tasks failed, please try again later.',
                     500
        );
        return next(error);
    }
    res.json({tasks: tasks.map(task => task.toObject({ getters: true}))});
};


const updateTaskById = async (req, res, next) => {
    const { taskName, taskDescription, taskDuedate, taskStatus, taskImage, taskMembers } = req.body;

    const taskId = req.params.tid; 
    console.log(taskId); 


    let task; 
    try {
        task = await Task.findById(taskId);
    }catch(err) {
        const error = new HttpError(
            'Someting went wrong, could not update task.', 500
        );
        return next(error);
    }

    task.taskName  = taskName; 
    task.taskDescription = taskDescription;
    task.taskDuedate = taskDuedate;
    task.taskStatus = taskStatus; 
    task.taskImage = taskImage; 
    task.taskMembers = taskMembers; 

    try {
        await task.save();
    } catch(err) {
        const error = new HttpError(
            'could not update task', 500 
        ); 
        return next(error); 
    }

    res.status(200).json({task: task.toObject({getters : true})});
}

const deleteTaskById = async (req, res, next) => {
    const taskId = req.params.tid;
    console.log('id3333' + taskId);
    let task; 
    try {
        task = await Task.findById(taskId).populate('groupId');
        console.log(task);
    }
    catch (err) {
        const error = new HttpError(
         err.message, 500
        );
        console.log(err.message);
        return next(error);
    }

    if (!task) {
        const error = new HttpError('could not find task for this id.',404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession(); 
        sess.startTransaction(); 
        await task.remove({session: sess}); 
        task.groupId.groupTasks.pull(task);
        await task.groupId.save({session: sess});
        await sess.commitTransaction();
        
    } catch (err) {
        const error = new HttpError(
        'Somting went wrong, could not delete task.' + err.message, 500
        );
         return next(error);
    }

    res.status(200).json({message:'Deleted task'});
}

exports.getTasks = getTasks;
exports.createNewTask = createNewTask;
exports.getTasksByGroupId = getTasksByGroupId; 
exports.updateTaskById = updateTaskById; 
exports.deleteTaskById = deleteTaskById; 