const express = require('express');
const cors = require('cors');
const path = require('path');
const router = require('./router/router.js');

const app = express()
const port = 3001

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/api', router);

app.listen(port, () => {
    console.log(`Site lancé sur : http://localhost:${port}/pages/index.html`)
})