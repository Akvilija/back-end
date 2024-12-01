const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

const { connectToDB } = require('./db')
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

connectToDB()
    .then(() => {
        app.listen(port, () => console.log(`Server is running at port ${port}.`))
    })
    .catch(error => console.error('Failed to connect:', error))