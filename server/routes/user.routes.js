const expresss = require("express");
const {  getProfileController, deleteUserController } = require("../controllers/user.controller");
const router = expresss.Router();

router.post("/user-fetch",getProfileController);
router.post("/delete-user",deleteUserController);

module.exports = router;