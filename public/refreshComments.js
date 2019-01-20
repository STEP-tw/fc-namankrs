const refreshComments = function() {
  fetch("/comments.txt").then(function(response) {
    // if (!response.ok) {
    //   console.log("not ok");
    //   return;
    // }
    console.log(response.text());
  });
};
