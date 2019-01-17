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
  let filePath = getFilePath(req.url);
  handler(res, filePath);
};

const readData = function(req, res, next) {
  let body = "";
  req.on("data", chunk => {
    body += chunk.toString();
  });
  req.on("end", () => {
    console.log(body);
    res.end();
  });
};

app.get("/", serveFile);
app.get("/main.css", serveFile);
app.get("/waterJar.js", serveFile);
app.get("/images/flowers.jpg", serveFile);
app.get("/images/jar.gif", serveFile);
app.get("/guestBook.html", serveFile);
app.post("/guestBook.html", serveFile);
app.get("/index.html", serveFile);

// Export a function that can act as a handler

module.exports = app.handleRequest.bind(app);
