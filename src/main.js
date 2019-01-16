const hide = function() {
  let jar = document.getElementById("jar");
  jar.style.visibility = "hidden";
  setTimeout(() => {
    jar.style.visibility = "visible";
    return;
  }, 1000);
};
