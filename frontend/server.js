const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Serve timestamp.txt
app.get('/timestamp.txt', (req, res) => {
  const filePath = path.join(__dirname, 'timestamp.txt');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  res.set('Content-Type', 'text/plain');
  res.send(fileContent);
});

// Serve robots.txt
app.get('/robots.txt', (req, res) => {
  const filePath = path.join(__dirname, 'robots.txt');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  res.set('Content-Type', 'text/plain');
  res.send(fileContent);
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});