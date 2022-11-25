const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());





app.get('/', async (req, res) => {
    res.send('SWAP Station server is running');
})

app.listen(port, () => console.log(`SWAP Station running on ${port}`))