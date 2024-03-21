require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

// Middleware
app.use(express.json()); // chomikuje (umoznuje pracovat s) req.body
app.use(cors()); // umoznuje komunikaci mezi frontendem a backendem

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server chilluje na portu ${port}`)
})