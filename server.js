const express = require('express')
var cors = require('cors');
const app = express();
const port = 3000;
const path = require('path');


//app.get('/', (req, res) => res.send('Hello World!'))


let whitelist = ['http://localhost:3000', 'http://spotify.com']

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin 
        if (!origin) return callback(null, true);
        if (whitelist.indexOf(origin) === -1) {
            var message = 'The CORS policy for this origin doesnt' +
            'allow access from the particular origin.';
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

