const multer = require('multer');
const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'project',
  password: 'psp123'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database');
  }
});

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

// Serve static files
app.use('/uploads', express.static('uploads'));

app.post('/complaint', upload.single('photo'), (req, res) => {
  const { title } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;

  const query = 'INSERT INTO complaints (title, photo) VALUES (?, ?)';
  connection.query(query, [title, photo], (err, result) => {
    if (err) {
      console.error('Error inserting complaint:', err);
      res.status(500).send('Error inserting complaint');
    } else {
      res.status(201).send('Complaint inserted successfully');
    }
  });
});

app.get('/complaints', (req, res) => {
  const query = 'SELECT * FROM complaints';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving complaints:', err);
      res.status(500).send('Error retrieving complaints');
    } else {
      res.json(results);
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;

  try {

    // Store user information in the 'Users' table
    const q = 'INSERT INTO Users (fullName, email, password) VALUES (?, ?, ?)';
    connection.query(q, [fullName, email, password], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error registering user');
      }

      // User registered successfully
      res.sendFile(path.join(__dirname, 'views', 'complaint_page.html'));
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
  }
});

app.post('/login', async (req, res) => {
  const { loginEmail, loginPassword } = req.body;

  try {
    // Retrieve user information from the 'Users' table
    const q = 'SELECT * FROM Users WHERE email = ?';
    connection.query(q, [loginEmail], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error retrieving user information');
      }

      // Check if the user exists
      if (result.length === 0) {
        return res.status(401).send('User not found');
      }

      const user = result[0];

      if (user.password == loginPassword) {
        // Passwords match, user is authenticated
        res.sendFile(path.join(__dirname, 'views', 'complaint_page.html'));
      } else {
        // Passwords do not match
        res.status(401).send('Incorrect password');
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during login');
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
