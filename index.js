// Mòduls necessaris
const config = require('./config.js')
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const http = require('http');
const https = require('https');
const fs = require('fs');

// Instancia d'express
const app = express();

// Middlewares
app.use(express.json());


var options = {
    key: fs.readFileSync('./keys/key.pem'),
    cert: fs.readFileSync('./keys/cert.pem')
};

// Block petitions to some files
app.use((req, res, next) => {
    if (config.blockedPaths.includes(req.path)) {
        // Send 404 Not Found response
        res.status(404).send('Not Found');
    } else {
        next();
    }
});

app.use('/', express.static(path.join(__dirname, '')));



// Create an HTTP service.
http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443);

console.log('Server is running on environment ' + process.env.NODE_ENV);


// Database connection
const db = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
});

// Database connection
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

console.log('Server is running on environment' + process.env.NODE_ENV);

// Client posts their result
app.post('/gameOver', (req, res) => {
    let sql = `INSERT INTO leaderboards (playerName, round, kills, headshotKills) VALUES ('${req.body.playerName}', ${req.body.round}, ${req.body.kills}, ${req.body.headshotkills});`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log('Data saved successfully');
        res.json({ message: 'Data saved successfully' });
    });
});

// Get top 10 from leaderboards
app.get('/leaderboards', (req, res) => {
    db.query(`SELECT 
    *
FROM
    leaderboards
ORDER BY round DESC , kills DESC , headshotKills DESC , playerName DESC
LIMIT 10;`, (err, results) => {
        if (err) {
            console.error('Error en la consulta 1:', err);
            res.status(500).json({ error: 'Error en la consulta 1' });
        } else {
            res.json(results);
        }
    });
});