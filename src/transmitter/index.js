const express = require('express');
const app = express();
const port = 8080;

//app.get('/', (req, res) => res.send('Hello World!'))

app.use(express.static('src/transmitter/www'));
app.use(express.static('src/transmitter/demo'));

app.listen(port, () => console.log(`HTTP server listening on port ${port}!`));
