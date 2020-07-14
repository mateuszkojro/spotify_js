const express = require("express");
const port = 3000;

let oauth = require("oauth.js");

//app.use('/', express.static('main'));
app.use("/", (req, res) => {});
app.post("/", (req, res) => {
  res.send(`Got a POST method ${req.text}`);
  console.log(req);
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
