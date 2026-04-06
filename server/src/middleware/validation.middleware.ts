import { body } from 'express-validator';

export const validateMessage = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage(`Message content must be between 1 and 255 characters`)
    .isString()
    .withMessage(`Must be a string`),
];

export const validateReport = [
  body('reason')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage(`Report reason must be between 1 and 255 characters`)
    .isString()
    .withMessage(`Must be a string`),
];

export const validateNote = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage(`Must must be between 1 and 255 characters`)
    .isString()
    .withMessage(`Must be a string`),
];

export const validateUserProfile = [
  body('display_name')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage(`Must must be between 1 and 50 characters`)
    .isString()
    .withMessage(`Must be a string`),
  body('pronouns')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage(`Must must be between 1 and 20 characters`)
    .isString()
    .withMessage(`Must be a string`),
  body('bio')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 1, max: 190 })
    .withMessage(`Must must be between 1 and 190 characters`)
    .isString()
    .withMessage(`Must be a string`),
];

export const validateUsername = [
  body('username')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage(`Must must be between 1 and 30 characters`)
    .isString()
    .withMessage(`Must be a string`),
];

export const validateCreateGroup = [
  body('group_name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage(`Must must be between 1 and 50 characters`)
    .isString()
    .withMessage(`Must be a string`),
  body('group_description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 1, max: 190 })
    .withMessage(`Must must be between 1 and 190 characters`)
    .isString()
    .withMessage(`Must be a string`),
  body('avatar_color')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage(`Must must be between 1 and 30 characters`)
    .isString()
    .withMessage(`Must be a string`),
];

export const validateUpdateGroup = [
  body('group_name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage(`Must must be between 1 and 50 characters`)
    .isString()
    .withMessage(`Must be a string`),
  body('group_description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 1, max: 190 })
    .withMessage(`Must must be between 1 and 190 characters`)
    .isString()
    .withMessage(`Must be a string`),
];

export const validateGroupProfile = [
  body('group_display_name')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage(`Must must be between 1 and 50 characters`)
    .isString()
    .withMessage(`Must be a string`),
  body('group_pronouns')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage(`Must must be between 1 and 20 characters`)
    .isString()
    .withMessage(`Must be a string`),
];

export const validateUser = [
  body('username')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage(`Must must be between 1 and 30 characters`)
    .isString()
    .withMessage(`Must be a string`),
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage(`Must must be at least 8 characters`)
    .isStrongPassword()
    .withMessage(
      `Password must be at least 8 characters long containing at least 1 uppercase, 1 lowercase, 1 number, and 1 special character`
    )
    .isString()
    .withMessage(`Must be a string`),
  body('avatar_color')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage(`Must must be between 1 and 30 characters`)
    .isString()
    .withMessage(`Must be a string`),
];
