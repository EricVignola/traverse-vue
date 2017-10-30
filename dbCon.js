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

//this is a function to retrieve the immediate children of a given parent node
function getChildren(parent, callback){
  client.query(
    `SELECT * FROM steps JOIN paths on (steps.id = paths.descendent_id)
    WHERE paths.ancestor_id = ${parent.id} and paths.path_length = 1`, (err, result) => {
      if(err) {
        callback(err);
      } else {
        callback(err, result);
      }
    });
}

//this is a function to retrieve all of the columns in the steps table
function getSteps(callback){
  client.query('SELECT * FROM steps', (err, result) => {
    if(err) {
      callback(err);
    } else {
      callback(err, result);
    }
  });
}

module.exports = {
  connect,
  client,
  getSteps,
  getChildren
};
