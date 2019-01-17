const isMatching = (req, path) => {
  if (path.method && req.method != path.method) return false;
  if (path.url instanceof RegExp && path.url.test(req.url)) return true;
  if (path.url && req.url != path.url) return false;
  return true;
};

class Handler {
  constructor() {
    this.paths = [];
  }

  use(handler) {
    this.paths.push({ handler });
  }

  get(url, handler) {
    this.paths.push({ method: "GET", url, handler });
  }

  post(url, handler) {
    this.paths.push({ method: "POST", url, handler });
  }

  handleRequest(req, res) {
    let matchingPaths = this.paths.filter(path => isMatching(req, path));
    let remainingPaths = matchingPaths.slice();
    const next = function() {
      let current = remainingPaths[0];
      if (!current) return;
      remainingPaths = remainingPaths.slice(1);
      current.handler(req, res, next);
    };
    next();
  }
}

module.exports = Handler;
