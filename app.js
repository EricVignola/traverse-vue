const express = require('express'),
      path = require('path'),
      pg = require('pg'),
      db = require('./dbCon'),
      hjs = require('hogan-express'),
      parseBody = require('./middleware/parseBody'),
      app = express();

const PORT = 3000;

//letting express know where to find our css, js, and img
app.use(express.static(__dirname + "/public"));

//connect to db using the dbCon.js module
db.connect();

//setting hogan as our templating engine
app.engine('hjs', hjs); //the hjs in single quotes lets express know what file extension to use hogan templating on
app.set('views', path.join(__dirname + "/views"));
app.set('view engine', 'hjs');

//we are letting express know what the name of our partials are for templating purposes
//if you look in ./views/layout.hjs you will see answer and step refereneced in double
//curly braces...that syntax works because we defined those partials here
app.set('partials', {
  answer: 'answer',
  step: 'step'
});

//creating route for base url
app.get('/', (req, res) => {
  db.getStep((err, result) => {
    if(err) return console.log(err);
    res.render('layout', {
      result: result.rows[0]
    });
  });
});

app.use('/submitted', parseBody.parse);

app.post('/submitted', (req, res) => {
  console.log(req.body.answer);
  res.end('<p>Thank you for your response</p>');
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
