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

const renderLoggedInSection = function() {
  let name = document.getElementById("userName").value;
  let partialPage = document.getElementById("loginDetails");
  fetch("/guestBookLoggedIn.html")
    .then(function(response) {
      return response.text();
    })
    .then(function(data) {
      partialPage.innerHTML = data.toString().replace("##NAMEHERE##", name);
    });
};
