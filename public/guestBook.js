const refreshComments = function() {
  fetch("/comments.txt")
    .then(function(response) {
      return response.text();
    })
    .then(function(data) {
      let previousComments = document.getElementById("comments");
      previousComments.innerHTML = data;
    });
};
