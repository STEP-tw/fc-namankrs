const fs = require("fs");

const send = function(res, statusCode, data) {
  res.statusCode = statusCode;
  res.write(data);
  res.end();
};

const handler = function(res, url, statusCode = 200) {
  fs.readFile(url, (err, data) => {
    if (err) {
      send(res, 404, "file not found");
      return;
    }
    send(res, statusCode, data);
  });
};

const getFilePath = function(url) {
  if (url == "/") return "./src/index.html";
  return "." + url;
};

const app = (req, res) => {
  let filePath = getFilePath(req.url);
  handler(res, filePath);
};

// Export a function that can act as a handler

module.exports = app;
