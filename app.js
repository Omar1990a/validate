const express = require("express");
const app = express();
const c = require("./config");
const request = require("request");
const scatteredStore = require("scattered-store");
const cache = scatteredStore.create("./cache", err => {
  if (err) return console.log("Cache Error", err);
});

app.set("view engine", "pug");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", {
    title: c.title
  });
});

app.get("/validate/:number", (req, res) => {
  cache.get("key-" + req.params.number).then(value => {
    if (value) {
      res.send({ cached: true, ...value });
    } else {
      const url =
        "http://apilayer.net/api/validate?access_key=" +
        c.key +
        "&number=" +
        req.params.number;
      request.get({ json: true, url: url }, (err, resp, body) => {
        if (err) {
          res.send({ error: "Check console!" });
          console.log(err);
          return;
        }
        res.send(body);
        if (body.valid) {
          cache.set("key-" + req.params.number, { valid: body.valid });
        }
      });
    }
  });
});

app.listen(c.port, () => {
  console.log(`App listening on port ${c.port}`);
});
