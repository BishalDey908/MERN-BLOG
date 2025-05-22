const expresss = require("express");
const { blgCreationController } = require("../controllers/blog.controller");
const router = expresss.Router();

router.post("/create-blog",blgCreationController);

module.exports = router;