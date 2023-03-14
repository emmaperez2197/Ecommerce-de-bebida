require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./src/routes');

const app = express();

app.use(morgan('dev'));
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
});

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/* eslint-disable */
app.listen(process.env.PORT, () => {
	console.log('listening to port:', process.env.PORT);
});

const staticStr = path.join(__dirname, './src/public');
app.use('/', express.static(staticStr));

routes(app);

module.exports = app;
