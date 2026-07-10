const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');

// @desc    Get all tasks (optionally filtered)
// @route   GET /api/tasks
const getTasks = asyncHandler(async (req, res) => {
  const { column, priority, search } = req.query;
  const filter = {};

  if (column) filter.column = column;
  if (priority) filter.priority = priority;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const tasks = await Task.find(filter).sort({ column: 1, order: 1 });
  res.status(200).json({ success: true, count: tasks.length, data: tasks });
});

// @desc    Create a new task
// @route   POST /api/tasks
const createTask = asyncHandler(async (req, res) => {
  const { title, description, column, priority, assignee } = req.body;
  const targetColumn = column || 'todo';

  // New task goes to the bottom of its column
  const lastTask = await Task.findOne({ column: targetColumn }).sort('-order');
  const nextOrder = lastTask ? lastTask.order + 1 : 0;

  const task = await Task.create({
    title,
    description,
    column: targetColumn,
    priority,
    assignee,
    order: nextOrder,
  });

  res.status(201).json({ success: true, data: task });
});

// @desc    Update a task (text fields, priority, or move between columns)
// @route   PUT /api/tasks/:id
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const { title, description, column, priority, assignee, order } = req.body;

  const isMovingColumn = column && column !== task.column;

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;
  if (assignee !== undefined) task.assignee = assignee;

  if (isMovingColumn) {
    task.column = column;
    if (order !== undefined) {
      task.order = order;
    } else {
      // No explicit order given - push to bottom of the new column
      const lastTask = await Task.findOne({ column }).sort('-order');
      task.order = lastTask ? lastTask.order + 1 : 0;
    }
  } else if (order !== undefined) {
    task.order = order;
  }

  const updatedTask = await task.save();
  res.status(200).json({ success: true, data: updatedTask });
});

// @desc    Bulk reorder tasks (used after drag-and-drop)
// @route   PATCH /api/tasks/reorder
const reorderTasks = asyncHandler(async (req, res) => {
  const { updates } = req.body;

  if (!Array.isArray(updates) || updates.length === 0) {
    res.status(400);
    throw new Error('updates must be a non-empty array');
  }

  const bulkOps = updates.map(({ id, column, order }) => ({
    updateOne: {
      filter: { _id: id },
      update: { column, order },
    },
  }));

  await Task.bulkWrite(bulkOps);

  const tasks = await Task.find().sort({ column: 1, order: 1 });
  res.status(200).json({ success: true, data: tasks });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await task.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  getTasks,
  createTask,
  updateTask,
  reorderTasks,
  deleteTask,
};
