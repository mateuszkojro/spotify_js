const express = require("express");
const port = 3000;

let oauth = require("oauth.js");
const auth = oauth.oauth();

app.use("/", (req, res) => {
  app.render("index.html", (err) => {
    res.send(`Server error: ${err}`);
  });
});
app.use("/callback", (req, res) => {
  auth.request_token();
});
app.post("/", (req, res) => {
  res.send(`Got a POST method ${req.text}`);
  console.log(req);
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
