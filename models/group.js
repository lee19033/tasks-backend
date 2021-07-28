const mongoose = require('mongoose'); 

const Schema =  mongoose.Schema;

const groupSchema = new Schema({
        groupName: { type: String, require: true},
        groupDescription: { type: String},
        groupTasks: [{ type: mongoose.Types.ObjectId, required:true, ref: 'Task' }],
    }
);

module.exports = mongoose.model('Group', groupSchema);