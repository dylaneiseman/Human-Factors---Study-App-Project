const AccessControl = require('accesscontrol');
const ac = new AccessControl();

// Define roles and permissions
ac.grant('user')
  .readOwn('course')
  .createOwn('course')
  .updateOwn('course')
  .deleteOwn('course')
  .createOwn('assignment')
  .updateOwn('assignment')
  .deleteOwn('assignment')
  .readOwn('assignment')
  .createOwn('scheduler')
  .readOwn('scheduler')
  .readOwn('flashcard')
  .createOwn('flashcard')
  .updateOwn('flashcard')
  .deleteOwn('flashcard')

ac.grant('admin')
  .extend('user')
  .readAny('profile')
  .updateAny('profile')
  .deleteAny('profile')
  .readAny('course')
  .updateAny('course')
  .deleteAny('course')
  .readAny('flashcard')
  .updateAny('flashcard')
  .deleteAny('flashcard')

module.exports = ac
