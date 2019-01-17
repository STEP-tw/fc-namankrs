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
  let content = "";
  req.on("data", chunk => (content += chunk.toString()));
  req.on("end", () => {
    req.body = content;
    next();
  });
};

const log = function(req, res, next) {
  if (req.body) {
    let data = req.body.split("&");
    let formData = {};
    formData.name = data[0].split("=")[1];
    formData.comment = data[1].split("=")[1];
    fs.appendFile(
      "./public/formData.txt",
      `${formData.name} ${formData.comment}`,
      err => err
    );
    console.log(formData.name, formData.comment);
  }
  next();
};

app.use(readData);
app.use(log);
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
