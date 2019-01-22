const EQUALS = "=";
const NEWLINE = "</br>";

const getValue = function(keyValue) {
  return keyValue.split(EQUALS)[1];
};

const formatComments = data => {
  let decodedData = unescape(data).replace(/\+/g, " ");
  return decodedData
    .toString()
    .split(NEWLINE)
    .reverse()
    .join(NEWLINE);
};

const insert = (formData, formHTML) =>
  formHTML.toString().replace("##COMMENTSHERE##", formData);

const formatData = function(name, comment) {
  return `${NEWLINE} ${new Date().toLocaleString()} Name: ${name} Comment:${comment}`;
};

const addPrefixPublic = url => "./public" + url;
const getFilePath = function(url) {
  if (url == "/") return addPrefixPublic("/index.html");
  return addPrefixPublic(url);
};

const send = function(res, statusCode, data) {
  res.statusCode = statusCode;
  res.write(data);
  res.end();
};

module.exports = {
  formatComments,
  insert,
  getValue,
  formatData,
  getFilePath,
  send
};
