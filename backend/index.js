const express = require('express');
const app = express();
const port = 5000;
const connectDB = require('./dbConnection');
const routes = require('./route')
const cors = require('cors')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api',routes)
connectDB();
app.listen(port, () => {
    console.log("Server running on port", port);
});