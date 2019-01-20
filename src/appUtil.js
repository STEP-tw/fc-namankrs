const EQUALS = "=";
const AMPERSAND = "&";
const NEWLINE = "</br>";

const formatComments = data => {
  let decodedData = unescape(data).replace(/\+/g, " ");
  return decodedData
    .toString()
    .split(NEWLINE)
    .reverse()
    .join(NEWLINE);
};

const insert = (formData, formHTML) =>
  formHTML.toString().replace("##FORMDETAILSHERE##", formData);

module.exports = {
  EQUALS,
  AMPERSAND,
  NEWLINE,
  formatComments,
  insert
};
