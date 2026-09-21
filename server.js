const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = process.env.PORT || 5173;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
};

http
  .createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    let filePath = path.join(root, urlPath);
    if (urlPath.endsWith("/")) filePath = path.join(filePath, "index.html");

    fs.readFile(filePath, (err, data) => {
      if (err) {
        // Support clean URLs like /lifrooms -> /lifrooms/index.html
        fs.readFile(path.join(root, urlPath, "index.html"), (err2, data2) => {
          if (err2) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Not found: " + urlPath);
            return;
          }
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(data2);
        });
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(port, () => console.log(`Lifrooms site running at http://localhost:${port}`));
