const mongoose = require('mongoose'); 
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema; 

const taskSchema = new Schema({
    
    taskName: { type: String, required: true},
    taskDescription: { type: String },
    taskDuedate: {type: Date},
    taskStatus: { type: Boolean },
    taskImage: {type:String}, 
    taskMembers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    groupId: { type: mongoose.Types.ObjectId, required: true, ref: 'Group'  },
})

taskSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Task', taskSchema);
