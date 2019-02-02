const fs = require("fs");
const express = require("express");
const app = express();

let comments = fs.readFileSync("./public/comments").toString();
const guestBook = fs.readFileSync("./public/guestBook.html").toString();
const loginForm = fs.readFileSync("./public/login.html").toString();
const loggedInForm = fs.readFileSync("./public/loggedIn.html").toString();

const { formatComments, insert, getValue, formatData } = require("./appUtil");

const readData = function(req, res, next) {
  let content = "";
  req.on("data", chunk => (content += chunk.toString()));
  req.on("end", () => {
    req.body = content;
    next();
  });
};

/** serves comments for refresh button */
const serveComments = function(req, res) {
  let formattedComments = formatComments(comments);
  console.log("hello");
  res.send(formattedComments);
};

const generateLoggedInForm = function(name) {
  let guestForm = guestBook.replace("##FORMTEMPLATE##", loggedInForm);
  return guestForm.replace("##NAMEHERE##", name);
};

const appendNameAndComments = function(name) {
  let namedForm = generateLoggedInForm(name);
  return namedForm.replace("##COMMENTSHERE##", formatComments(comments));
};

const generateLoginPage = function(req, res) {
  name = getValue(req.body);
  res.setHeader("Set-Cookie", name);
  let finalGuestForm = appendNameAndComments(name);
  res.send(finalGuestForm);
};

const generateLoggedInPage = function(req, res) {
  let name = req.headers.cookie;
  let comment = getValue(req.body);
  let formattedData = formatData(name, comment);
  fs.appendFile("./public/comments", formattedData, err => err);
  comments = comments.concat(formattedData);
  let finalGuestForm = appendNameAndComments(name);
  res.send(finalGuestForm);
};

const loginUser = function(req, res) {
  let name = req.headers.cookie;
  if (!name) {
    generateLoginPage(req, res);
    return;
  }
  generateLoggedInPage(req, res);
};

const serveGuestBook = function(req, res) {
  let name = req.headers.cookie;
  let formHTML = guestBook.replace("##FORMTEMPLATE##", loginForm);
  if (name) {
    formHTML = generateLoggedInForm(name);
  }
  let formattedComments = formatComments(comments);
  let finalData = insert(formattedComments, formHTML);
  res.send(finalData);
};

const logout = function(req, res) {
  res.setHeader("Set-Cookie", "cookie;expires=Thu, Jan 01 1970 00:00:00 GMT;");
  res.statusCode = 302;
  res.setHeader("Location", "/guestBook.html");
  res.end();
};

app.use(readData);
app.post("/logout", logout);
app.get("/guestBook.html", serveGuestBook);
app.post("/guestBook.html", loginUser);
app.get("/comments", serveComments);
app.use(express.static("public"));

// Export a function that can act as a handler

module.exports = app;
