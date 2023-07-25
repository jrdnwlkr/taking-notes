// Import Express.js
const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');
const notes = require('./db/notes');
const fs = require('fs');

// Import built-in Node.js package 'path' to resolve path of files that are located on the server
// const path = require('path');
const PORT = 3001;
// Initialize an instance of Express.js
const app = express();

// Specify on which port the Express.js server will run


// Static middleware pointing to the public folder

app.use(express.json());

// app.use(bodyParser.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'));

// Create Express.js routes for default '/', '/send' and '/routes' endpoints
app.get('/', (req, res) => res.send('Navigate to /send or /routes'));

app.get('/api/notes', (req, res) => {
  res.status(200).json(notes);
});

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

        const noteString = JSON.stringify(newNote);

        const notes = JSON.parse(fs.readFileSync("./db/notes.json", "utf-8"));

        notes.push(newNote)

        fs.writeFileSync("./db/notes.json", JSON.stringify(notes))

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
