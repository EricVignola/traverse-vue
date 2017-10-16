const pg = require('pg');

//connection string for db, will change when the database is moved to remote server
const client = new pg.Client('postgres://traverse_user:123456@localhost/traversedb');

//connecting to db with the client defined above
function connect(){
  client.connect((err) => {
    if(err){
      console.log(err);
    }
  });
}

//this is a test function to print the step text of all of the steps in the db
function getStep(callback){
  client.query('SELECT * FROM steps', (err, result) => {
    if(err) return console.log(err);
    callback(err, result);
  });
}

module.exports = {
  connect,
  client,
  getStep
}
