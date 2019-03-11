const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const setupProxy = require("./setupProxy");

const notFounds = [
  "/node_modules/*",
  "/server.js",
  "/setupProxy.js",
  "/package.json",
  "/yarn.lock",
  "/package-lock.json"
];
notFounds.map(o => {
  app.all(o, (req, res) => {
    res.status(404).send("Not found");
  });
});
app.use(express.static(__dirname));
app.use("/", express.static(__dirname + "/"));
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

setupProxy(app);

app.listen(port, () => console.log(`Server is running on port ${port}!`));
