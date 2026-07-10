const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  reorderTasks,
  deleteTask,
} = require('../controllers/taskController');
const {
  validateCreateTask,
  validateUpdateTask,
  validateIdParam,
} = require('../middleware/taskValidators');

router.get('/', getTasks);
router.post('/', validateCreateTask, createTask);
router.patch('/reorder', reorderTasks); // must come before '/:id'
router.put('/:id', validateUpdateTask, updateTask);
router.delete('/:id', validateIdParam, deleteTask);

module.exports = router;
