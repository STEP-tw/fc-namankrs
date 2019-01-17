const fs = require("fs");
const Handler = require("./handler");
const app = new Handler();
const send = function(res, statusCode, data) {
  res.statusCode = statusCode;
  res.write(data);
  res.end();
};

const handler = function(res, url, statusCode = 200) {
  fs.readFile(url, (err, data) => {
    if (err) {
      send(res, 404, "Not found");
      return;
    }
    send(res, statusCode, data);
  });
};

const getFilePath = function(url) {
  if (url == "/") return "./public/index.html";
  return "./public" + url;
};

const serveFile = (req, res) => {
  console.log(req.url);
  let filePath = getFilePath(req.url);
  handler(res, filePath);
};

app.use(serveFile);

// Export a function that can act as a handler

module.exports = app.handleRequest.bind(app);
