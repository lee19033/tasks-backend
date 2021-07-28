const express = require('express');

const groupsControllers = require('../controllers/groups-controllers');

const router = express.Router(); 

router.get('/', groupsControllers.getGroups);

router.get('/:groupId', groupsControllers.getGroupById);

router.post('/', groupsControllers.createGroup);

router.patch('/:groupId', groupsControllers.updateGroupById);

router.delete('/:groupId', groupsControllers.deleteGroupById);

module.exports = router; 