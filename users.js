var _ = require('lodash');
var exports = module.exports = {};
var users;

exports.saveUsers = function (bot, message) {

    bot.api.users.list({}, function(err, response) {
        users = response.members;
    });
    // console.log(users);
};

exports.getUser = function(userid){
  return _.find(users,function(u){
    console.log(u);
    return u.id==userid;
  });
}

exports.findUsers = function(name){
  return _.filter(users,function(u){
    return u.name.includes(name) || u.real_name && u.real_name.includes(name);
  });
}
