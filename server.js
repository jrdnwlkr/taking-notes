const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');
const fs = require('fs');
const notesFile = path.join(__dirname, 'db', 'notes.json');

const PORT = 3001;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => res.send('Navigate to /send or /routes'));

app.get('/api/notes', (req, res) => {
  fs.readFile(notesFile, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading notes file:', err);
      return res.status(500).json('Error fetching notes');
    }

    const notes = JSON.parse(data);
    res.status(200).json(notes);
  });
});

app.get('/send', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/sendFile.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      review_id: uuid(),
    };

    fs.readFile(notesFile, 'utf-8', (err, data) => {
      if (err) {
        console.error('Error reading notes file:', err);
        return res.status(500).json('Error in posting note');
      }

      const notes = JSON.parse(data);
      notes.push(newNote);

      fs.writeFile(notesFile, JSON.stringify(notes, null, 4), (err) => {
        if (err) {
          console.error('Error writing notes file:', err);
          return res.status(500).json('Error in posting note');
        }

        const response = {
          status: 'success',
          body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
      });
    });
  } else {
    res.status(500).json('Error in posting note');
  }
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
