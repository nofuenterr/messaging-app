import { body } from 'express-validator';

export const validateMessage = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage(`Message content must be between 1 and 255 characters`),
];

export const validateReport = [
  body('reason')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage(`Report reason must be between 1 and 255 characters`),
];

export const validateNote = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage(`Note content must be between 1 and 255 characters`),
];

export const validateUserProfile = [
  body('display_name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage(`User display name must be between 1 and 50 characters`),
  body('pronouns')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage(`User pronouns must be between 1 and 20 characters`),
  body('bio')
    .trim()
    .isLength({ min: 1, max: 190 })
    .withMessage(`User bio must be between 1 and 190 characters`),
];

export const validateUsername = [
  body('username')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage(`Username must be between 1 and 30 characters`),
];

export const validateGroup = [
  body('group_name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage(`Group name must be between 1 and 50 characters`),
  body('group_description')
    .trim()
    .isLength({ min: 1, max: 190 })
    .withMessage(`Group description must be between 1 and 190 characters`),
  body('avatar_color')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage(`Avatar color must be between 1 and 30 characters`)
    .optional(),
];

export const validateGroupProfile = [
  body('group_display_name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage(`Group display name must be between 1 and 50 characters`),
  body('group_pronouns')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage(`Group pronouns must be between 1 and 20 characters`),
];

export const validateUser = [
  body('username')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage(`Username must be between 1 and 30 characters`),
  body('password')
    .trim()
    .isStrongPassword()
    .withMessage(
      'Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol'
    ),
  body('avatar_color')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage(`Avatar color must be between 1 and 30 characters`),
];
