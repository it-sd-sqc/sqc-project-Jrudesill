const express = require('express');
const path = require('path');
const app = express();

// Configure server to use port 5163 by default
const port = process.env.PORT || 5163;

// Configure server to use "./public/" for static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);