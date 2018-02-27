var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'sqlUser',
  password: 'sqluser123',
  database: 'FilesCopy',
});
//connection.connect();

// create the table of DB if that doesn't exist
function createTable() {
  connection.query("CREATE TABLE IF NOT EXISTS persons (\n" +

    " id VARCHAR(255) NOT NULL,\n" +
    " name VARCHAR(100) NOT NULL,\n" +
    " age INT,\n" +
    " gender VARCHAR(20) NOT NULL,\n" +
    " email VARCHAR(255),\n" +
    " company VARCHAR(255),\n" +
    " phone VARCHAR(255),\n" +
    " address VARCHAR(255),\n" +
    "PRIMARY KEY (id))", function (err, result) {
      if (err)
        throw err;
      // Neat!
    });
}
createTable();



app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(__dirname));


app.listen(app.get('port'), function () {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});


app.get('/users', function(req, res){
  try{
    connection.query('SELECT id FROM persons', function(err, result){
        res.send(result);
    });
  }
  catch(err){}
});

// Listen to POST requests to /users.
app.post('/users', function (req, res) {
  //if the table has deleted;
  createTable();
  // sent data. Get
  var data = req.body;
  var dataUpd = req.body;
  for (var index = 0; index < data.length; index++) {


    // Do a MySQL query.
    try {
      var query = connection.query('INSERT INTO persons SET ?', data[index], function (err, result) {

        // Neat!
      });
    }
    catch (err) { }
  }

  //update exist data
  delete dataUpd.id;
  for (var index = 0; index < dataUpd.length; index++) {
    try {
      var query = connection.query('UPDATE persons SET ? WHERE id=?', [dataUpd[index], data[index].id], function (err, result) {

        // Neat!
      });
    }
    catch (err) { }
  }

});