/** @format */

const express = require('express');

const app = express();

app.use(express.json({ limit: '20mb' }));

app.use('/web', express.static('./'));

app.listen(3005);
