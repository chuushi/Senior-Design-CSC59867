const express = require('express');
const config = require('../../config.js');

// === Webserver Engine - sets up a webserver ===
// exit on terminal by [Ctrl] + [C]

const app = express();
const port = config.webPort;

// /config.js URI: gets config information from `config.js` file in root of the project
app.get('/config.js', (req, res) => {
    // set it up as a JavaScript file
    res.set('Content-Type', 'application/javascript')
    res.send("window.config = " + JSON.stringify(config));
});

// www and demo directories are served as-is in static
app.use(express.static('src/transmitter/www'));
app.use(express.static('src/transmitter/demo'));

app.listen(port, () => console.log(`HTTP server listening on port ${port}!`));
