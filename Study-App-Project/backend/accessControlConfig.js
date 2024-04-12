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

ac.grant('admin')
  .extend('user')
  .readAny('profile')
  .updateAny('profile')
  .deleteAny('profile')
  .readAny('course')
  .updateAny('course')
  .deleteAny('course')

module.exports = ac