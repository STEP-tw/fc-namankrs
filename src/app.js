const fs = require("fs");
const Handler = require("./handler");
const app = new Handler();

const { EQUALS, AMPERSAND, NEWLINE, reverse, insert } = require("./appUtil");

const send = function(res, statusCode, data) {
  res.statusCode = statusCode;
  res.write(data);
  res.end();
};

const handler = function(res, url, statusCode = 200) {
  fs.readFile(url, (err, data) => {
    if (err) {
      res.statusCode = 200;
      res.end();
      return;
    }
    send(res, statusCode, data);
  });
};

const addPrefixPublic = url => "./public" + url;

const getFilePath = function(url) {
  if (url == "/") return addPrefixPublic("/index.html");
  return addPrefixPublic(url);
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
    fs.readFile("./public/comments.txt", (err, formData) => {
      let reversedData = reverse(formData);

      let finalData = insert(reversedData, formHTML);

      res.write(finalData);
      res.end();
    });
  });
};

const formatData = function(data) {
  let formattedData = {};
  formattedData.name = data.split(AMPERSAND)[0].split(EQUALS)[1];
  formattedData.comment = data.split(AMPERSAND)[1].split(EQUALS)[1];
  return `${new Date().toLocaleString()} Name: ${formattedData.name} Comment: ${
    formattedData.comment
  }`;
};

const serveGuestBook = function(req, res) {
  if (req.body) {
    let formattedData = formatData(req.body);
    fs.appendFile("./public/comments.txt", NEWLINE + formattedData, err => err);
  }
  writeGuestData(req, res);
};

app.use(readData);

app.post("/guestBook.html", serveGuestBook);
app.get("/guestBook.html", serveGuestBook);
app.use(serveFile);

// Export a function that can act as a handler

module.exports = app.handleRequest.bind(app);
