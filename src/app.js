const fs = require("fs");

const send = function(req, res, statusCode, data = "") {
  res.statusCode = statusCode;
  res.write(data);
  res.end();
  return;
};

const handler = function(req, res, url, statusCode = 200) {
  fs.readFile(url, (err, data) => {
    if (err) {
      send(res, 404, "file not found");
      return;
    }
    send(req, res, statusCode, data);
  });
};

const app = (req, res) => {
  let currUrl = "";
  if (req.url == "/favicon.ico") {
    res.end();
    return;
  }
  if (req.url == "/") {
    currUrl = "./src/index.html";
    handler(req, res, currUrl);
    return;
  }
  currUrl = "." + req.url;
  handler(req, res, currUrl);
  return;
};

// Export a function that can act as a handler

module.exports = app;
