const express = require('express'),
      path = require('path'),
      pg = require('pg'),
      db = require('./dbCon'),
      hjs = require('hogan-express'),
      parseBody = require('./middleware/parseBody'),
      expressValidator = require('express-validator'),
      app = express();

const PORT = 3000;

//letting express know where to find our css, js, and img
app.use(express.static(path.join(__dirname + '/dist/')));

//connect to db using the dbCon.js module
db.connect();

//setting hogan as our templating engine
app.engine('hjs', hjs); //the hjs in single quotes lets express know what file extension to use hogan templating on
app.set('views', path.join(__dirname + "/dist"));
app.set('view engine', 'hjs');

//we are letting express know what the name of our partials are for templating purposes
//if you look in ./views/layout.hjs you will see answer and step refereneced in double
//curly braces...that syntax works because we defined those partials here
app.set('partials', {
  answer: 'answer',
  step: 'step',
  errors: 'errors'
});

//variable to track the current step the player is on
var currentStep;

//creating route for base url
app.get('/', (req, res) => {
  db.getSteps((err, result) => {
    if(err) throw err;
    currentStep = result.rows[0];
    res.render('layout', {
      result: currentStep
    });
  });
});

//sanitizing the user's answer
app.use('/', parseBody.parse);
app.use(expressValidator());

app.post('/', (req, res) => {

  //checking that user submitted a valid answer
  req.checkBody('answer', 'Answer required').notEmpty();
  req.sanitize('answer').escape();
  req.sanitize('answer').trim();

  //if there were any errors with the users answer save them in js object
  var userAnswerErrors = req.validationErrors();

  //if there are errors display the same page with the errors
  if(userAnswerErrors){
    db.getSteps((err, result) => {
      if(err) return console.log(err);
      res.render('layout', {
        result: currentStep,
        errors: userAnswerErrors
      });
    });

    //if no errors check users answer against database
  } else {
    db.getChildren(currentStep, (err, result) => {
      if(err){
        throw err;
      } else {
        if(result.rows.length > 0) {
          for(let i = 0; i < result.rows.length; i++){
            var correct = false;
            if(result.rows[i].answer == req.body.answer){
              currentStep = result.rows[i];
              correct = true;
              break;
            }
          }
          if(!correct){
            userAnswerErrors = {
              'msg': 'Incorrect Answer'
            };
          }
          res.render('layout', {
            result: currentStep,
            errors: userAnswerErrors
          });
        } else {
          res.end('<p>You Win!</p>'); //this is a placeholder, for now there is no win screen so we display this
        }
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
