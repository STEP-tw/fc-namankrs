const EQUALS = "=";
const AMPERSAND = "&";

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

const writeGuestData = function(req, res) {
  fs.readFile("./public/guestBook.html", (err, formHTML) => {
    fs.readFile("./public/formData.txt", (err, formData) => {
      let finalData = formHTML
        .toString()
        .replace("##FORMDETAILSHERE##", formData.toString());
      res.write(finalData);
      res.end();
    });
  });
};

const formatData = function(data) {
  let formattedData = {};
  formattedData.name = data.split(AMPERSAND)[0].split(EQUALS)[1];
  formattedData.comment = data.split(AMPERSAND)[1].split(EQUALS)[1];
  return `${new Date().toLocaleString()} ${formattedData.name} ${
    formattedData.comment
  }`;
};

const serveGuestBook = function(req, res) {
  if (req.body) {
    let formattedData = formatData(req.body);
    fs.appendFile("./public/formData.txt", formattedData, err => err);
  }
  writeGuestData(req, res);
};

app.use(readData);
app.get("/", serveFile);
app.get("/main.css", serveFile);
app.get("/waterJar.js", serveFile);
app.get("/images/flowers.jpg", serveFile);
app.get("/images/jar.gif", serveFile);
app.post("/guestBook.html", serveGuestBook);
app.get("/guestBook.html", serveGuestBook);
app.get("/index.html", serveFile);

// Export a function that can act as a handler

module.exports = app.handleRequest.bind(app);
