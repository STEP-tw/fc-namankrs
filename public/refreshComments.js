const NEWLINE = "</br>";

const reverse = data =>
  data
    .toString()
    .split(NEWLINE)
    .reverse()
    .join(NEWLINE);

const refreshComments = function() {
  fetch("/comments.txt")
    .then(function(response) {
      return response.text();
    })
    .then(function(data) {
      let reversedData = reverse(data);
      let previousComments = document.getElementById("comments");
      previousComments.innerHTML = reversedData;
    });
};
