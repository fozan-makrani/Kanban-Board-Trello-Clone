const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

const validateCreateTask = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('column')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Invalid column value'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority value'),
  body('assignee').optional().trim(),
  handleValidationErrors,
];

const validateUpdateTask = [
  param('id').isMongoId().withMessage('Invalid task ID'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('column')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Invalid column value'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority value'),
  body('order').optional().isNumeric().withMessage('Order must be a number'),
  handleValidationErrors,
];

const validateIdParam = [
  param('id').isMongoId().withMessage('Invalid task ID'),
  handleValidationErrors,
];

module.exports = {
  validateCreateTask,
  validateUpdateTask,
  validateIdParam,
};
