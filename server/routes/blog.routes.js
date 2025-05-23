const expresss = require("express");
const { blgCreationController, getBlogCategoryController, getBlogController, getSingleBlogController } = require("../controllers/blog.controller");
const router = expresss.Router();

router.post("/create-blog",blgCreationController);
router.get("/get-blog-category",getBlogCategoryController);
router.post("/get-blog",getBlogController);
router.post("/get-single-blog",getSingleBlogController);

module.exports = router;