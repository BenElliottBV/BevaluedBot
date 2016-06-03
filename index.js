var Botkit = require('botkit');
var userService = require('./users');

var controller = Botkit.slackbot({
  debug: false
    //include "log: false" to disable logging
    //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  token: TOKEN,
}).startRTM();
controller.on('rtm_open',userService.saveUsers);

controller.hears('Who am I?','direct_message',function(bot,message){
  console.log(message);
  var user = userService.getUser(message.user);
  bot.reply(message,"Your name is " + user.real_name);
});

// give the bot something to listen for.
controller.hears('hello', ['direct_message', 'direct_mention', 'mention'], function(bot, message) {
  bot.reply(message, 'Hello yourself.');
  console.log(message);
});

controller.hears(['Lets talk', "Let's talk"], ['direct_message'], function(bot, message) {
  bot.startConversation(message, function(err, convo) {

    askWhat(err, convo,bot);
    convo.next();

    convo.on('end', function(convo) {
      if (convo.status == 'completed') {
        handleResponses(convo);
        var res = convo.extractResponses();


        var value  = convo.extractResponse('What do you want to ask?');

      } else {
        console.log(err);
      }
    });
  });
});

askWhat = function(resonse, convo,bot) {
  convo.ask('What do you want to ask?', function(response, convo) {
    convo.say("Awesome!");
    askWho(response, convo,bot);
    convo.next();
  });
};
askWho = function(response, convo,bot) {
  convo.ask('Who do you want me to ask?', function(response, convo) {
    console.log(response);
    var users = userService.findUsers(response.text);
    convo.say("OK, here goes:");
    users.forEach(function(u){
      convo.say(u.real_name);
    });
    askToConfirm(response,convo,bot);
    convo.next();
  });
};
askToConfirm = function(response,convo,bot){
  convo.ask("Does that look right? Say YES or NO",[
    {
      pattern: bot.utterances.yes,
        callback: function(response,convo,bot) {
          convo.say('Great! I will continue...');
          // do something else...
          convo.next();
    }
  },
  {
    pattern: bot.utterances.no,
      callback: function(response,convo) {
        convo.say('Oh, OK. Try again, maybe be more specific?');
        // do something else...
        askWho(response,convo,bot);
        convo.next();
  }
}
  ]);

}
handleResponses = function(convo){

}
