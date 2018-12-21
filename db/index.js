const mariadb = require('mariadb');
const config = require('../config');

const pool = mariadb.createPool({
  host: config.mariadb.host,
  user: config.mariadb.user,
  password: config.mariadb.password,
  database: config.mariadb.database,
});

module.exports = pool;
