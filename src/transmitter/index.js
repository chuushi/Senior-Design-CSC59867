const express = require('express');
const config = require('../../config.js');
const app = express();
const port = config.webPort;

app.get('/config.js', (req, res) => {
    res.set('Content-Type', 'application/javascript')
    res.send("window.config = " + JSON.stringify(config));
});

app.use(express.static('src/transmitter/www'));
app.use(express.static('src/transmitter/demo'));

app.listen(port, () => console.log(`HTTP server listening on port ${port}!`));
