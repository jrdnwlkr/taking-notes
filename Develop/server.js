// Import Express.js
const express = require('express');
const uuid = require('./helpers/uuid');

// const db = require('.db/db.json');

// Import built-in Node.js package 'path' to resolve path of files that are located on the server
const path = require('path');

// Initialize an instance of Express.js
const app = express();

// Specify on which port the Express.js server will run
const PORT = 3001;

// Static middleware pointing to the public folder
app.use(express.static('public'));

// Create Express.js routes for default '/', '/send' and '/routes' endpoints
app.get('/', (req, res) => res.send('Navigate to /send or /routes'));

app.get('/api/notes', (req, res) => res.json('db'));

// app.get('/send', (req, res) =>
//   res.sendFile(path.join(__dirname, 'public/sendFile.html'))
// );

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if ( title && text ) {
        const newNote = {
            title,
            text,
            review_id: uuid()
        };

        const response = {
            status: 'success',
            body: newNote,
          };

        console.log(response);
          res.status(201).json(response);
        } else {
          res.status(500).json('Error in posting review');
        }
});

// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
