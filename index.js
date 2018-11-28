const express = require('express');
const app = express();

const port = process.env.PORT || 3001
const host = process.env.HOST || 'localhost'

app.get('/', (req, res) => {
  res.json('welcome!');
})

app.listen(port, host, console.log('codybot authorization server listening on port:', port));