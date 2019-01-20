const fs = require("fs");
const Handler = require("./handler");
const app = new Handler();

const {
  EQUALS,
  AMPERSAND,
  NEWLINE,
  formatComments,
  insert
} = require("./appUtil");

/**
 *sends response and ends it.
 * @param {object} res
 * @param {number} statusCode
 * @param {string} data
 */
const send = function(res, statusCode, data) {
  res.statusCode = statusCode;
  res.write(data);
  res.end();
};

/**
 * reads the file and calls send with file contents.
 * @param {object} res
 * @param {string} url
 * @param {number} statusCode
 */
const handler = function(res, url, statusCode = 200) {
  fs.readFile(url, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end();
      return;
    }
    send(res, statusCode, data);
  });
};

const addPrefixPublic = url => "./public" + url;

/**
 * add public directory address to the req.url
 * @param {string} url
 */
const getFilePath = function(url) {
  if (url == "/") return addPrefixPublic("/index.html");
  return addPrefixPublic(url);
};

const serveFile = (req, res) => {
  let filePath = getFilePath(req.url);
  handler(res, filePath);
};

/**
 * reads the data asynchronously and adds it to request body.
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
const readData = function(req, res, next) {
  let content = "";
  req.on("data", chunk => (content += chunk.toString()));
  req.on("end", () => {
    req.body = content;
    next();
  });
};

/**
 * integrates form html with the comments.
 * @param {object} req
 * @param {object} res
 */
const writeGuestData = function(req, res) {
  fs.readFile("./public/guestBook.html", (err, formHTML) => {
    fs.readFile("./public/comments.txt", (err, formData) => {
      let formattedComments = formatComments(formData);
      let finalData = insert(formattedComments, formHTML);
      res.write(finalData);
      res.end();
    });
  });
};

/**
 * splits the data to name and comments and adds current date and time to it.
 * @param {string} data
 */
const formatData = function(data) {
  let formattedData = {};
  formattedData.name = data.split(AMPERSAND)[0].split(EQUALS)[1];
  formattedData.comment = data.split(AMPERSAND)[1].split(EQUALS)[1];
  return `${new Date().toLocaleString()} Name: ${formattedData.name} Comment: ${
    formattedData.comment
  }`;
};

/**
 * serves the whole guest book page
 */
const serveGuestBook = function(req, res) {
  if (req.body) {
    let formattedData = formatData(req.body);
    fs.appendFile("./public/comments.txt", NEWLINE + formattedData, err => err);
  }
  writeGuestData(req, res);
};

/** serves comments for refresh button */
const serveComments = function(req, res) {
  fs.readFile("./public/comments.txt", (error, comments) => {
    let formattedComments = formatComments(comments);
    send(res, 200, formattedComments);
  });
};

app.use(readData);
app.post("/guestBook.html", serveGuestBook);
app.get("/guestBook.html", serveGuestBook);
app.get("/comments.txt", serveComments);
app.use(serveFile);

// Export a function that can act as a handler

module.exports = app.handleRequest.bind(app);
