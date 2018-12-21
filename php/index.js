const process = require('child_process');

class PHP {
  constructor(path) {
    this.path = path;
  }

  parse(file) {
    return new Promise((resolve, reject) => {
      process.exec(`${this.path} ${file}`, (err, stdout) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout);
        }
      });
    });
  }
}

module.exports = path => new PHP(path || 'php');
