const express = require('express');
const bodyParser = require('body-parser');
const { saveUserData } = require('./api/saveData');
const { loadUserData } = require('./api/loadData');

const app = express