const mysql = require('mysql');

var createConnection  = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database : 'may'
  
});

createConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
module.exports = createConnection;