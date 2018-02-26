var mysql = require('mysql');
var express = require('express');
var app = express();
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'sqluser123',
  password: 'sqluser123',
  database: 'FilesCopy',
});
//connection.connect();

// Listen to POST requests to /users.
app.post('/users', function(req, res) {
  // sent data. Get
  var user = req.body;
  // Do a MySQL query.
  var query = connection.query('INSERT INTO users SET ?', user, function(err, result) {
    // Neat!
  });
  res.end('Success');
});

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(__dirname));

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});