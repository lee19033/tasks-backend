const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Group = require('../models/group');

const getGroups = async (req, res, next) => {
    let groups;
    try {
        groups = await Group.find();
    }
    catch(err) {
        const error = new HttpError(
                    'Fetching groups failed, please try again later.',
                     500
        );
        return next(error);
    }
    res.json({groups: groups.map(group => group.toObject({ getters: true}))});
}


const getGroupById =  async (req, res, next) => {
    const groupId = req.params.groupId; 
    let group;

    try {
         group = await Group.findById(groupId);
    }catch(err) {
        const error = new HttpError('could not find group by id, 500');
        return next(error);
    }
    
    if (!group) { 
        const error = new HttpError('could not find group',404);
        return next(error);
    }
    console.log('GET request in groups routes');
    res.json({group : group.toObject( { getters: true } )}); // => {group: group}
}

const createGroup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid data', 422);
    }
    const { groupName, groupDescription } = req.body;
    const createdGroup = new Group ({
        groupName,
        groupDescription, 
        groupTasks: [],
    });

    
    try {
        createdGroup.save();
    }
    catch(err) {
        const error = new HttpError('created group fail',500);
        return next(error);
    }
    
    res.status(201).json({group: createdGroup});
};

const updateGroupById = async (req, res, next) => {
    const { groupName, description, users } = req.body;
    const groupId = req.params.groupId; 

    let group; 
    try {
        group = await Group.findById(groupId);
    }catch(err) {
        const error = new HttpError(
            'Someting went wrong, could not update group.', 500
        );
        return next(error);
    }

    group.groupName = groupName; 
    group.groupDescription=  description;

    try {
        await group.save();
    } catch(err) {
        const error = new HttpError(
            'could not update group', 500 
        ); 
        return next(error); 
    }

    res.status(200).json({group: group.toObject({getters : true})});
}

const deleteGroupById = async (req, res, next) => {
    const groupId = req.params.groupId;
    let group; 
    try {
        group = await Group.findById(groupId);
    }
    catch (err) {
        const error = new HttpError(
            'Somting went wrong, could not delete group.', 500
        );
        return next(error);
    }

    try {
        await group.remove();
    } catch (err) {
        const error = new HttpError(
        'Somting went wrong, could not delete group.', 500
        );
         return next(error);
    }

    res.status(200).json({message:'Deleted Group'});
}

exports.getGroups = getGroups;
exports.getGroupById = getGroupById;
exports.createGroup = createGroup;
exports.updateGroupById = updateGroupById;
exports.deleteGroupById = deleteGroupById;
