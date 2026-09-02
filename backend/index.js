const express = require('express');
const cors    = require('cors');
const router  = require('./router/router.js');

const app = express()
const port = 3000


app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.use('/api', router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})