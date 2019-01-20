const EQUALS = "=";
const AMPERSAND = "&";
const NEWLINE = "</br>";

const reverse = data =>
  data
    .toString()
    .split(NEWLINE)
    .reverse()
    .join(NEWLINE);

const insert = (formData, formHTML) =>
  formHTML.toString().replace("##FORMDETAILSHERE##", formData);

module.exports = {
  EQUALS,
  AMPERSAND,
  NEWLINE,
  reverse,
  insert
};
