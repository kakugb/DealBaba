const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

// Create a new user (Admin only)
router.post('/', userController.createUser);

// Get all users (Admin only)
router.get('/getAllUser', userController.getAllUsers);

// Get user by ID (Admin or User can access own data)
router.get('/:id', userController.getUserById);

// Update user details (Admin or User can update own data)
router.put('/:id', userController.updateUser);

// Delete user (Admin only)
router.delete('/:id', userController.deleteUser);

router.get('/usersByrole', userController.getUsersByRole);


module.exports = router;
