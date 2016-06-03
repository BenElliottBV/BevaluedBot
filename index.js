var Botkit = require('botkit');

var controller = Botkit.slackbot({
  debug: false
    //include "log: false" to disable logging
    //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  token: env.process.TOKEN,
}).startRTM();
controller.on('rtm_open',function(bot,message){
  var users;
  bot.api.users.list({},function(err,response){
    users = response;
    console.log(response);
  });
  console.log(users);
  bot.say(
    {
      text: "I'm online!",
      channel: 'D1DCYUULC' // a valid slack channel, group, mpim, or im ID
    }
  );
})


// give the bot something to listen for.
controller.hears('hello', ['direct_message', 'direct_mention', 'mention'], function(bot, message) {
  bot.reply(message, 'Hello yourself.');
  console.log(message);

});

controller.hears(['Lets talk', "Let's talk"], ['direct_message'], function(bot, message) {
  bot.startConversation(message, function(err, convo) {

    askWhat(err, convo);
    convo.next();

    convo.on('end', function(convo) {
      if (convo.status == 'completed') {
        handleResponses(convo);
        var res = convo.extractResponses();
        console.log(res);

        var value  = convo.extractResponse('What do you want to ask?');
        console.log(convo);
      } else {
        console.log(err);
      }
    });
  });
});

askWhat = function(resonse, convo) {
  convo.ask('What do you want to ask?', function(response, convo) {
    convo.say("Awesome!");
    askWho(response, convo);
    convo.next();
  });
};
askWho = function(response, convo) {
  convo.ask('Who do you want me to ask?', function(response, convo) {
    convo.say("Gotcha, asking now");
    convo.next();
  });
};
handleResponses = function(convo){

}
