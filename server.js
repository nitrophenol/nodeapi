const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');  
const app = express();
const port = 3000;

// MySQL database configuration
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.DATABASE,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to the MySQL database');
});

// Set up the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) {
      throw err;
    }
    res.render('index', { employees: results });
  });
});

app.get('/employee/:id', (req, res) => {
  const employeeId = req.params.id;
  db.query(
    'SELECT * FROM employees WHERE id = ?',
    [employeeId],
    (err, results) => {
      if (err) {
        throw err;
      }
      if (results.length === 0) {
        res.send('Employee not found');
      } else {
        res.render('employee', { employee: results[0] });
      }
    }
  );
});

app.post('/employee', (req, res) => {
  const employee = req.body;
  db.query('INSERT INTO employees SET ?', employee, (err, results) => {
    if (err) {
      throw err;
    }
    res.redirect('/');
  });
});

app.post('/employee/update/:id', (req, res) => {
  const employeeId = req.params.id;
  const updatedEmployee = req.body;
  db.query(
    'UPDATE employees SET ? WHERE id = ?',
    [updatedEmployee, employeeId],
    (err, results) => {
      if (err) {
        throw err;
      }
      res.redirect('/');
    }
  );
});

app.get('/employee/delete/:id', (req, res) => {
  const employeeId = req.params.id;
  db.query('DELETE FROM employees WHERE id = ?', [employeeId], (err, results) => {
    if (err) {
      throw err;
    }
    res.redirect('/');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
