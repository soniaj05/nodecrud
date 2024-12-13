const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database :process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Get all students
app.get('/api/classes', (req, res) => {
  const query = 'SELECT * FROM class_table';
  db.query(query, (err,rows,fields) => {
    if(!err){
      //console.log(rows);  
      res.send(rows);
    }
    else{
      console.log(err);
        }
  });
});

// add the class
app.post('/api/classes', (req, res) => {
  
  const { classname, subjectname, roomno, startdate } = req.body;

  const query = `
    INSERT INTO class_table (classname, subjectname, roomno, startdate)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [classname, subjectname, roomno, startdate], (err, result) => {
    if (!err) {
    
      res.send({ message: 'Class added successfully', result });
    } else {
      console.error('Database error:', err);
      res.send({ error: ' error class not added succesfully' });
    }
  });
});

// delete the class
app.delete('/api/classes/:clsid', (req, res) => {
  const { clsid } = req.params; 

  const query = 'DELETE FROM class_table WHERE clsid = ?';
  
  db.query(query, [clsid], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res({error: ' error'});
    }

   else{
    res.send({ message: 'Class deleted successfully' });
   }
    
  });
});

//update the class
app.put('/api/classes/:clsid', (req, res) => {
  const { clsid } = req.params; 
  const { classname, subjectname, roomno, startdate } = req.body; 

  const query = `
    UPDATE class_table 
    SET classname = ?, subjectname = ?, roomno = ?, startdate = ? 
    WHERE clsid = ?
  `;

  db.query(query, [classname, subjectname, roomno, startdate, clsid], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.send({ error: ' error class not updated' });
    }

else{
  res.send({ message: 'Class updated successfully', result });
}  

    
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

  