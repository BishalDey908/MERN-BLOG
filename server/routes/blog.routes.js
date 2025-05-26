const expresss = require("express");
const { blgCreationController, getBlogCategoryController, getBlogController, getSingleBlogController, getUserBlogController, updateUserBlogController, deleteUserBlogController, likeBlogService } = require("../controllers/blog.controller");
const router = expresss.Router();

router.post("/create-blog",blgCreationController);
router.get("/get-blog-category",getBlogCategoryController);
router.post("/get-blog",getBlogController);
router.post("/get-single-blog",getSingleBlogController);
router.post("/get-user-blog",getUserBlogController);
router.post("/update-user-blog/:_id",updateUserBlogController);
router.post("/delete-user-blog/:_id",deleteUserBlogController);
router.post("/like-blog",likeBlogService);

module.exports = router;