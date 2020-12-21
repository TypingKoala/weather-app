var http = require('http');

const PORT = 3000;

http.createServer((req, res) => {
  res.write("Hello Nafim!");
  res.end();
}).listen(PORT);