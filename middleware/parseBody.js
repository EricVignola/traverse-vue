var cleanString = function(data) {
  data = data.split(/[=&]/);
  for(let i = 0; i < data.length; i++){
    data[i] = data[i].replace(/[\+*]/g, " ");
  }
  return data;
}

var parse = function(req, res, next) {
  let temp = [];
  let body = {};
  req.on('data', (chunk) => {
    temp.push(chunk);
  }).on('end', () => {
    temp = Buffer.concat(temp).toString();
    temp = cleanString(temp);
    for(let i = 0; i < temp.length; i += 2){
      body[temp[i]] = temp[i + 1];
    }
    req.body = body;
    next();
  });
}

module.exports = {
  parse
};
