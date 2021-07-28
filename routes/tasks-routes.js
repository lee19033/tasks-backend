const express = require('express');

const taskControllers = require('../controllers/tasks-controllers');

const router = express.Router(); 


router.get('/', taskControllers.getTasks);
router.get('/group/:gid', taskControllers.getTasksByGroupId);
router.post('/', taskControllers.createNewTask);
router.patch('/:tid', taskControllers.updateTaskById);
router.delete('/:tid', taskControllers.deleteTaskById);

module.exports = router; 