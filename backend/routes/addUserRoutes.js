const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');


router.post('/', userController.createUser);


router.get('/getAllUser', userController.getAllUsers);


router.get('/:id', userController.getUserById);


router.put('/:id', userController.updateUser);


router.delete('/:id', userController.deleteUser);

router.get('/usersByrole', userController.getUsersByRole);


module.exports = router;
