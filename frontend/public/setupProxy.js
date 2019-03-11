const fs = require("fs");
const path = require("path");
const multer = require("multer");
const fetch = require("node-fetch");
const proxy = require("http-proxy-middleware");
const chalk = require("chalk");

const constants = require("../src/constants");
const { tokenName, profileUrl, apiUrl } = constants;
console.log(chalk.cyan(`API: ${chalk.yellow(apiUrl)}`));

/** Set middlewares **/
const uploadsDir = "./public/uploads/";
!fs.existsSync(uploadsDir) && fs.mkdirSync(uploadsDir);
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Add middleware for http proxying
const proxyEndpoint = "/api";
const apiProxy = proxy(proxyEndpoint, {
  target: apiUrl,
  changeOrigin: true
});

// TODO: Currently only supports small file size upload of 1mb. To increase limit in next release.
module.exports = function(app) {
  /** Set Routes **/
  app.post("/api/v1/upload", upload.single("files"), async function(req, res) {
    // check authentication
    let token = req.headers[tokenName];
    try {
      const headers = { [tokenName]: token, token };
      const resp = await fetch(profileUrl, { headers });
      const json = await resp.json();
      token = json[tokenName];
      return res
        .set(tokenName, token)
        .set("token", token)
        .json({
          message: "Upload succeed.",
          name: req.file.originalname,
          token,
          [tokenName]: token
        });
    } catch (e) {
      res.status(500).json({ message: "Invalid token" });
    }
  });
  app.get("/api/v1/telekom-malaysia-chatbot/query", function(req, res, next) {
    return res.sendFile(
      path.join(__dirname, "../public/data/telekom-malaysia-chatbot.json")
    );
  });
  app.get("/api/v1/telekom-malaysia-chatbot/follow-up", function(
    req,
    res,
    next
  ) {
    return res.sendFile(
      path.join(__dirname, "../public/data/telekom-malaysia-chatbot.json")
    );
  });
  app.get("/api/v1/icons", function(req, res, next) {
    const icondir = "./public/assets/node";
    const files = fs.readdirSync(icondir);
    return res.json(files);
  });
  app.get("/api/v1/assets/:dir", async function(req, res, next) {
    const readDir = async (dir, root, urlroot) => {
      const dirpath = `${root}/${dir}`;
      const files = await fs.readdirSync(dirpath);
      const json = {};
      await Promise.all(
        files.map(async f => {
          if (fs.lstatSync(`${dirpath}/${f}`).isDirectory())
            json[f] = await readDir(f, dirpath, `${urlroot}/${dir}`);
          else json[f] = `${urlroot}/${dir}/${f}`;
        })
      );
      return json;
    };
    return res.json(
      await readDir(req.params.dir, `./public/assets`, `/assets`)
    );
  });

  app.use(proxyEndpoint, apiProxy);
};
