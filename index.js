const dotenv = require('dotenv').config()
const axios = require('axios');
const express = require('express');
const mongoose = require('mongoose');
const chalk = require('chalk');
const app = express();
const router = require('./routes/');
const cors = require('cors');
const beep = require('beepbeep');
const port = process.env.PORT || 8000;
// App stuff
app.use(express.json());
app.use(cors());
app.use('/', router)
app.listen(port, () => console.log(`[!] Listening on port: ${chalk.green(port)}`))

const mongoURL = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`
console.log(mongoURL);
// Connect to MongoD
mongoose.connect(mongoURL, { useNewUrlParser: true });
  mongoose.connection.on('connected', () => {
  console.log(`[!] Connected to MongoD on port: ${process.env.MONGO_PORT}`);
});

mongoose.connection.on('error', (err) => {
  console.log(chalk.red(`[X] Failed to connect to MongoD on port: ${process.env.MONGO_PORT}`));
  console.log(chalk.red(`[X] ${err.errmsg}`))
  beep()
});
