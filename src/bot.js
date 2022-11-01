require('dotenv').config();

const Mimu = require('./structures/mimu');
const mimu = new Mimu();
module.exports = mimu;

mimu.build();