const fs = require('fs');
const path = require('path');

const ssl = {};
try {
  ssl.key = fs.readFileSync(path.join(__dirname, 'ssl', 'babelfish.key'), 'utf8');
  ssl.cert = fs.readFileSync(path.join(__dirname, 'ssl', 'babelfish.crt'), 'utf8');
  ssl.ca = [
    fs.readFileSync(path.join(__dirname, 'ssl', 'intermediate1.crt'), 'utf8'),
    fs.readFileSync(path.join(__dirname, 'ssl', 'intermediate2.crt'), 'utf8'),
  ];
} catch (e) {
  ssl.key = '';
  ssl.cert = '';
  ssl.ca = ['', ''];
}

module.exports = {
  mariadb: {
    host: 'localhost',
    user: 'babelfish',
    password: 'Fish42',
    database: 'babelfish',
  },
  ssl,
};
