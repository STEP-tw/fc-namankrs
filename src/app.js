const fs = require("fs");

const app = (req, res) => {
  if (req.url == "/favicon.ico") {
    res.end();
    return;
  }
  fs.readFile("." + req.url, (err, data) => {
    res.statusCode = 200;
    res.write(data);
    res.end();
  });
};

// Export a function that can act as a handler

module.exports = app;
