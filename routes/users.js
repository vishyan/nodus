var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', { title: 'User Administration' , error: 'No Users in the system', userList: [ { name: 'Vishal' }, {name: 'Admin'} , {name: 'Editor'} ] });
});

module.exports = router;
