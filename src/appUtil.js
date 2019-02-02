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

module.exports = {
  formatComments,
  insert,
  getValue,
  formatData
};
